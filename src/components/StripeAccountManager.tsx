import { api } from '~/utils/api';
import { useState } from "react";
import { type Account, type Store } from '@prisma/client';

interface StripeAccountManagerProps {
    store: Store | undefined
    account: Account | undefined | null
}

export default function StripeAccountManager({ store, account }: StripeAccountManagerProps) {
    const utils = api.useUtils();

    const addAccountMutation = api.stripe.createAccount.useMutation({
        onSuccess: async () => {
            await utils.stores.get.invalidate();
            await utils.stripe.getAccount.invalidate();
        },
    });
    const getOnboardingUrlMutation = api.stripe.getOnboardingUrl.useMutation();

    console.log(account)
    const [newAccountEmail, setNewAccountEmail] = useState('');

    const handleAddAccount = async () => {
        const newAccount = await addAccountMutation.mutateAsync({ email: newAccountEmail, storeId: store!.id, userId: 1 });
        setNewAccountEmail('');
        const url = await getOnboardingUrlMutation.mutateAsync({stripeAccountId: newAccount.stripeId, storeId: store!.id });
        window.location.assign(url);
    };

    return (
        <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded 
  bg-violet-900 text-white">
            <div className="rounded-t mb-0 px-4 py-3 border-0">
                <div className="flex flex-wrap items-center">
                    <div className="relative w-full px-4 max-w-full flex-grow flex-1 ">
                        <h3 className="font-semibold text-lg text-white">Stripe Account</h3>
                    </div>
                </div>
            </div>
            <div className="block w-full overflow-x-auto ">
                <table className="items-center w-full bg-transparent rounded-sm">
                    <thead className="bg-gray-50">
                        {account?.id ? (
                            <tr>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider"
                                >
                                    Stripe Account Id
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider"
                                >
                                    Email
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider"
                                >
                                    Charges Enabled
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider"
                                >
                                    Payouts Enabled
                                </th>
                            </tr>)
                            : (
                                <tr>
                                    <th></th>
                                    <th></th>
                                    <th></th>
                                    <th></th>
                                </tr>
                            )}
                    </thead>
                    <tbody
                        className="bg-white divide-y divide-gray-200"
                    >
                        {account?.id ? (
                            <tr key={account?.id}>
                                <td className="px-6 py-4 text-gray-600 whitespace-nowrap">{account?.stripeId}</td>
                                <td className="px-6 py-4 text-gray-600 whitespace-nowrap">{account?.email}</td>
                                <td className="px-6 py-4 text-gray-600 whitespace-nowrap">{account?.chargesEnabled}</td>
                                <td className="px-6 py-4 text-gray-600 whitespace-nowrap">{account?.payoutsEnabled}</td>
                            </tr>
                        ) : (
                            <tr>
                                <td colSpan={3} className="p-3">
                                    <input
                                        className="shadow appearance-none border rounded w-80 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        type="text"
                                        placeholder="New Account Email"
                                        value={newAccountEmail}
                                        onChange={(e) => setNewAccountEmail(e.target.value)}
                                    />

                                </td>
                                <td> <button className="ml-4 justify-self-end bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded" onClick={handleAddAccount}>Add Stripe Account</button></td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}