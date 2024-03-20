import { type Store, type Account, type Product } from "@prisma/client";
import { api } from '~/utils/api';
import { ProductForm } from "./ProductForm";
import { useState } from "react";

interface ProductManagerProps {
    store: Store,
    account: Account | undefined | null
}

export default function ProductManager({ store, account }: ProductManagerProps) {
    const [showForm, setShowForm] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product|undefined>();

    const { data: products, refetch } = api.products.getAllByStore.useQuery(
        {
            storeId: store.id,
        }
    );

    const hasAccount = !!account;

    const handleShowForm = (productId?: number) => {
        if(productId) {
            setSelectedProduct(products?.find(x => x.id === productId));
        }
        setShowForm(true);
    };

    const handleCloseForm = async () => {
        await refetch();
        setShowForm(false);
    }

    return (
        <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded 
  bg-violet-900 text-white">
            <div className="rounded-t mb-0 px-4 py-3 border-0">
                <div className="flex flex-wrap items-center">
                    <div className="relative w-full px-4 max-w-full flex-grow flex-1 ">
                        <h3 className="font-semibold text-lg text-white">Products</h3>
                    </div>
                </div>
            </div>
            <div className="block w-full overflow-x-auto h-full">
                {!showForm ? (
                    <table className="items-center w-full bg-white h-full rounded-sm">
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
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider"
                                >Price</th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider"
                                >Stripe Product ID</th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider"
                                >Stripe Price ID</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody
                            className="bg-white divide-y divide-gray-200"
                        >
                            {products?.map((product) => (
                                <tr key={product.id}>
                                    <td className="px-6 py-4 text-gray-600 whitespace-nowrap">{product.name}</td>
                                    <td className="px-6 py-4 text-gray-600 whitespace-nowrap">{product.description}</td>
                                    <td className="px-6 py-4 text-gray-600 whitespace-nowrap">{product.price}</td>
                                    <td className="px-6 py-4 text-gray-600 whitespace-nowrap">{product.stripeId}</td>
                                    <td className="px-6 py-4 text-gray-600 whitespace-nowrap">{product.stripePriceId}</td>
                                    <td><button className="justify-self-end bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded" onClick={() => handleShowForm(product.id)}>Edit Product</button></td>
                                </tr>
                            ))}
                            {hasAccount ?
                                (
                                    <tr>
                                        <td colSpan={6}> <button className="ml-4 mt-4 mb-4 justify-self-end bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded" onClick={() => handleShowForm()} >Add Product</button></td>
                                    </tr>
                                ) :
                                (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-4 text-gray-600 whitespace-nowrap"> You Must Add A Stripe Account Before Adding Products</td>
                                    </tr>
                                )}
                        </tbody>
                    </table>
                ) :
                    (
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8 p-6 bg-white">
                            <ProductForm product={selectedProduct} store={store} account={account} />
                            <div className="flex relative w-full px-4 max-w-full flex-grow flex-1 h-full items-end">
                            <button className="ml-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded" onClick={() => handleCloseForm()}>Close Form</button>
                            </div>
                        </div>
                    )}
            </div>
        </div>
    );
}