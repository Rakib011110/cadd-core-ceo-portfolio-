"use client";

import { useFormContext } from "react-hook-form";
import { cn } from "@/lib/utils"; // If using classNames utility
import { Input } from "@/components/ui/input";
import { IInput } from "@/lib/types";

type IProps = IInput;

export default function CaddInput({
  required = false,
  type = "text",
  label,
  name,
  disabled = false,
  placeholder,
}: IProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const errorMessage = errors[name]?.message as string | undefined;

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={name} className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <Input
        {...register(name)}
        id={name}
        type={type}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className={cn(
          "border rounded-md p-2 focus:outline-none",
          errorMessage ? "border-red-500" : "border-gray-300"
        )}
      />
      {errorMessage && (
        <span className="text-red-500 text-xs">{errorMessage}</span>
      )}
    </div>
  );
}
