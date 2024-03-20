import { useFormDirty } from "./useFormDirty";

export const SubmitButton = () => {
  const isFormDirty = useFormDirty();
  return (<input className="ml-4 justify-self-end bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 mt-6 rounded" type="submit" disabled={!isFormDirty} />);
};