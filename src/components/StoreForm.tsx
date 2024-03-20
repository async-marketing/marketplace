import { useForm, FormProvider } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitButton } from "~/components/SubmitButton";
import { FormInput } from "~/components/FormInput";
import { FormTextarea } from "~/components/FormTextarea";
import { type StoreFormSchema, storeFormSchema } from "~/components/helpers/storeFormSchema";
import { api } from '~/utils/api';
import { type Store } from "@prisma/client";
import { toast } from 'react-hot-toast';1

interface StoreFormProps {
    store: Store | undefined
}

export const StoreForm = ({ store }: StoreFormProps) => {

    let defaultName = '';
    let defaultDescription = '';

    if (typeof store !== 'undefined') {
        defaultName = store.name;
        defaultDescription = store.description ?? '';
    }

    const form = useForm<StoreFormSchema>({
        defaultValues: { name: defaultName, description: defaultDescription },
        resolver: zodResolver(storeFormSchema)
    });

    const updateStoreMutation = api.stores.update.useMutation({
        onSuccess: () => {
            toast.success(`Successfully updated ${store?.name}`)
        }
    });

    const onSubmit = async (data: { name: string, description?: string }) => {
        if (typeof store !== 'undefined') {
            store.name = data.name;
            store.description = data.description ?? '';
            await updateStoreMutation.mutateAsync({ id: store.id, name: store.name, description: store.description });
        }
    };

    return (
        <FormProvider {...form}>
            <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded 
  bg-violet-900 text-white">
                <div className="rounded-t mb-0 px-4 py-3 border-0">
                    <div className="flex flex-wrap items-center">
                        <div className="relative w-full px-4 max-w-full flex-grow flex-1 ">
                            <h3 className="font-semibold text-lg text-white">Edit Store</h3>
                        </div>
                    </div>
                </div>
                <div className="max-w-sm w-full lg:max-w-full lg:flex bg-white">
                    <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4 p-4 w-full">
                        <StoreFormInputs />
                        <SubmitButton />
                    </form>
                </div>
            </div>
        </FormProvider>
    );
};

const StoreFormInputs = () => {
    return (
        <>
            <FormInput inputProps={{ type: "text" }} name="name" label="Name" />
            <FormTextarea name="description" label="Description" />
        </>
    );
};