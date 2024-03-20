import { type NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import { type Product } from "@prisma/client";


const ProductsView: NextPage = () => {
    const router = useRouter();
    let storeId;
    try {
        storeId = parseInt(router.query.id as string);
    } catch (_ex) {
        return null;
    }

    const getCheckoutSession = api.products.purchaseProduct.useMutation();
    const { data: store } = api.stores.get.useQuery({ storeId });
    const { data: account } = api.stripe.getAccount.useQuery({ id: store?.accountId })
    const { data: products } = api.products.getAllByStore.useQuery(
        {
            storeId,
        },
        {
            enabled: !!storeId,
        }
    );

    if (!products || !store) {
        return null;
    }

    const handlePurchase = async (product: Product) => {
        const url = await getCheckoutSession.mutateAsync({
            price: product.price,
            productPriceId: product.stripePriceId,
            stripeAccountId: account!.stripeId,
        });

        window.location.assign(url!);
    }

    return (
        <>
            <Head>
                <title>View {store.name}</title>
                <meta name="description" content="Viewing Store" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className="flex flex-col items-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
                <div className="mt-10 flex flex-col gap-8 items-top">
                    <h1 className="text-5xl font-sans tracking-tight text-white sm:text-[5rem]">
                        {store.name} <span className="text-[hsl(280,100%,70%)]">Storefront</span>
                    </h1>
                </div>
                <div className="container flex min-h-screen flex-col items-center px-4 py-16 bg-gradient-to-b from-[#2e026d] to-[#15162c]">
                    <div className="w-full grid grid-cols-1 gap-4 sm:grid-cols-3 md:gap-8">
                        {products?.map((product: Product) => (
                            <div key={product.id}
                                className="flex-col gap-4 rounded-xl bg-white/10 p-4 text-white "
                            >
                                <div className="w-full grid grid-cols-2 gap-4">
                                    <div>
                                        <h3 className="text-2xl font-bold">{product.name} →</h3>
                                    </div>
                                    <div>
                                        <button className="ml-4 justify-self-end bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded" onClick={() => handlePurchase(product)}>Purchase</button>
                                    </div>
                                </div>

                                <div className="w-full grid grid-cols-1 gap-4">
                                    <div className="text-lg">
                                        {product.description}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </main>
        </>
    );
};

export default ProductsView;
