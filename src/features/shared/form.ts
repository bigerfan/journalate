import { get } from "react-hook-form";
import type {
  FieldErrors,
  FieldPath,
  FieldValues,
  RegisterOptions,
  UseFormRegister,
} from "react-hook-form";

export type FieldKind = "text" | "number" | "datetime-local";

// Empty input -> undefined, so optional numbers stay optional and required ones show their message.
const toNum = (v: unknown) => (v === "" || v == null ? undefined : Number(v));

type Options<T extends FieldValues> = {
  readOnly?: boolean;
  register?: RegisterOptions<T, FieldPath<T>>; // extra react-hook-form options if a field needs them
};

/**
 * Builds the props a MUI <TextField> needs to work with react-hook-form:
 * the input ref, change/blur handlers, error state, and the error message as helper text.
 *
 *   const field = makeFieldProps(register, errors);
 *   <TextField label="Pair" {...field('pair')} />
 *   <TextField label="Entry" {...field('entry', 'number')} />
 *   <TextField label="Opened" {...field('openedAt', 'datetime-local')} />
 */
export function makeFieldProps<T extends FieldValues>(
  register: UseFormRegister<T>,
  errors: FieldErrors<T>,
) {
  return (
    name: FieldPath<T>,
    kind: FieldKind = "text",
    options?: Options<T>,
  ) => {
    // MUI's `ref` points at the wrapper div, but react-hook-form needs the <input>, so use inputRef.
    const { ref, ...rest } = register(name, {
      ...(kind === "number" ? { setValueAs: toNum } : {}),
      ...options?.register,
    } as RegisterOptions<T, FieldPath<T>>);

    const error = get(errors, name) as { message?: string } | undefined; // `get` also handles nested names like "a.b"

    return {
      ...rest,
      inputRef: ref,
      type: kind === "text" ? undefined : kind,
      slotProps: {
        ...(kind === "datetime-local" ? { inputLabel: { shrink: true } } : {}),
        htmlInput: {
          ...(kind === "number" ? { step: "any" } : {}),
          ...(options?.readOnly ? { readOnly: true } : {}),
        },
      },
      error: !!error,
      helperText: error?.message,
    };
  };
}
