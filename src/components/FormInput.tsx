import { type ComponentProps } from "react";
import { useFormContext, Controller } from "react-hook-form";

export const FormInput = (props: {
  inputProps?: ComponentProps<"input">;
  name: string;
  label?: string;
  rules?: ComponentProps<typeof Controller>["rules"];
}) => {
  const { control } = useFormContext();
  const label = props.label ?? props.name;
  return (
    <Controller
      control={control}
      name={props.name}
      render={(context) => (
        <div className="p-4">
          <label htmlFor={props.name} className="block">
            <span className="text-gray-700">
            {label}
            </span>
          <input className="form-input mt-1 block w-full text-gray-600"
            id={props.name}
            {...props.inputProps}
            {...context.field}
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            value={context.field.value ?? ""}
          />
          </label>
          {context.fieldState.error && (
            <div style={{ color: "red" }}>
              {context.fieldState.error.message!}
            </div>
          )}
        </div>
      )}
    />
  );
};
