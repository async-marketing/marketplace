import { type NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import ProductManager from "~/components/ProductManager";
import { StoreForm } from "~/components/StoreForm";
import StripeAccountManager from "~/components/StripeAccountManager";

const StoreView: NextPage = () => {
    const router = useRouter();
    let storeId;

    try {
        storeId = parseInt(router.query.id as string);
    } catch (_ex) {
        return null;
    }

  
    const { data: store } = api.stores.get.useQuery({ storeId });
    const { data: account } = api.stripe.getAccount.useQuery({id: store?.accountId});
    
    if (!store) {
        return null;
    }


    return (
        <>
            <Head>
                <title>Manage {store.name}</title>
                <meta name="description" content="Manage Store" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className="flex flex-col items-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
                <div className="mt-10 mb-8 flex flex-col gap-8 items-top">
                    <h1 className="text-5xl font-sans tracking-tight text-white sm:text-[5rem]">
                        {store.name} <span className="text-[hsl(280,100%,70%)]">Management</span>
                    </h1>
                </div>
                <div className="container flex min-h-screen flex-col items-center px-4 py-8 bg-transparent">
                    <div className="grid grid-cols-1 gap-4 md:gap-8 p-6 w-full">
                        <StoreForm store={store} />
                    </div>
                    <div className="grid grid-cols-1 gap-4 md:gap-8 p-6 w-full">
                    <ProductManager store={store} account={account} />
                    </div>
                    <div className="grid grid-cols-1 gap-4 md:gap-8 p-6 w-full">
                        <StripeAccountManager store={store} account={account} />
                    </div>
                </div>

            </main>
        </>
    );
};

export default StoreView;