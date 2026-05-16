export enum EInputType {
  text = "text",
  email = "email",
  password = "password",
}

interface InputProps {
  type: EInputType;
  placeholder?: string;
  onChange?:
    | React.ChangeEventHandler<HTMLInputElement, HTMLInputElement>
    | undefined;
  value?: string;
  text?: string;
}

export const Input = ({
  type,
  placeholder,
  onChange,
  value,
  text,
}: InputProps) => {
  return (
    <input
      type={type}
      onChange={onChange}
      value={value}
      placeholder={placeholder}
    >
      {text}
    </input>
  );
};
