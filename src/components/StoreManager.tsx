import { api } from '~/utils/api';
import { useState } from "react";
import Link from "next/link";

export default function StoreManager() {
    const { data: stores, refetch } = api.stores.getAll.useQuery();
    const addStoreMutation = api.stores.create.useMutation();

    const [newStoreName, setNewStoreName] = useState('');

    const handleAddStore = async () => {
        await addStoreMutation.mutateAsync({ name: newStoreName, userId: 1 });
        setNewStoreName('');
        await refetch();
    };

    return (
        <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded 
  bg-violet-900 text-white">
            <div className="rounded-t mb-0 px-4 py-3 border-0">
                <div className="flex flex-wrap items-center">
                    <div className="relative w-full px-4 max-w-full flex-grow flex-1 ">
                        <h3 className="font-semibold text-lg text-white">Stores</h3>
                    </div>
                </div>
            </div>
            <div className="block w-full overflow-x-auto ">
                <table className="items-center w-full bg-transparent rounded-sm">
                    <thead className="bg-gray-50">
                        <tr>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider"
                            >
                                Name
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider"
                            >
                                Description
                            </th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody
                        className="bg-white divide-y divide-gray-200"
                    >
                        {stores?.map((store) => (
                            <tr key={store.id}>
                                <td className="px-6 py-4 text-gray-600 whitespace-nowrap">{store.name}</td>
                                <td className="px-6 py-4 text-gray-600 whitespace-nowrap">{store.description}</td>
                                <td><Link className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded" href={`/store/${store.id}`}>Edit Store</Link></td>
                            </tr>
                        ))}
                        <tr>
                            <td colSpan={2} className="p-3">
                                <input
                                    className="shadow appearance-none border rounded w-80 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    type="text"
                                    placeholder="New Store Name"
                                    value={newStoreName}
                                    onChange={(e) => setNewStoreName(e.target.value)}
                                />

                            </td>
                            <td> <button className="ml-4 justify-self-end bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded" onClick={handleAddStore}>Add Store</button></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}