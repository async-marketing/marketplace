import { useForm, FormProvider } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitButton } from "~/components/SubmitButton";
import { FormInput } from "~/components/FormInput";
import { type ProductFormSchema, productFormSchema } from "~/components/helpers/productFormSchema";
import { type Account, type Product, type Store } from "@prisma/client";
import { api } from "~/utils/api";
import toast from "react-hot-toast";

interface ProductFormProps {
    product: Product | undefined
    store: Store,
    account: Account | undefined | null
}

export const ProductForm = ({ product, store, account }: ProductFormProps) => {
    let defaultName = '';
    let defaultPrice = '';

    if (typeof product !== 'undefined') {
        defaultName = product.name;
        defaultPrice = product.price;
    }

    const form = useForm<ProductFormSchema>({
        defaultValues: { name: defaultName, price: defaultPrice },
        resolver: zodResolver(productFormSchema)
    });

    const updateProductMutation = api.products.update.useMutation({
        onSuccess: () => {
            toast.success(`Successfully updated ${product?.name}`)
        }
    });
    const addProductMutation = api.products.create.useMutation({
        onSuccess: () => {
            toast.success(`Successfully added Product`)
        }
    });

    const onSubmit = async (data: { name: string, price: string }) => {
        try{
            const numericPrice = parseFloat(data.price)
        if (typeof product !== 'undefined') {
            product.name = data.name;
            product.price = data.price;
            await updateProductMutation.mutateAsync({ id: product.id, name: product.name, price: numericPrice, storeId: product.storeId, stripeId: product.stripeId, stripePriceId: product.stripePriceId, data: product.data });
        } else {
            if (account) {
                await addProductMutation.mutateAsync({ name: data.name, storeId: store.id, price: numericPrice, stripeAccountId: account.stripeId });
            }
        }
    } catch(ex) {
        console.log('Unable to parse string to float');
    }
    };

    return (
        <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <ProductFormInputs />
                <SubmitButton />
            </form>
        </FormProvider>
    );
};

const ProductFormInputs = () => {
    return (
        <>
            <FormInput inputProps={{ type: "text" }} name="name" label="Name" />
            <FormInput inputProps={{ type: "text" }} name="price" label="Price" />
        </>
    );
};