import { useMemo } from "react";
import { useFormContext } from "react-hook-form";

export const useFormDirty = () => {
  const {
    formState: { dirtyFields },
  } = useFormContext();

  return useMemo(() => Object.values(dirtyFields).length > 0, [dirtyFields]);
};
