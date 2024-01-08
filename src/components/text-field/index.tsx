import TextField, { TextFieldVariants } from "@mui/material/TextField";

export type TextFieldOnChangeEventType = {
  target: { id?: string; value: string };
};

interface CustomTextFieldProps {
  value: string;
  label: string;
  id?: string;
  numericFormat?: boolean;
  autoComplete?: string;
  variant?: TextFieldVariants;
  disabled?: boolean;
  required?: boolean;
  onChange: (event: TextFieldOnChangeEventType) => void;
}

export default function CustomTextField(props: CustomTextFieldProps) {
  const { onChange, numericFormat, variant, ...restProps } = props;
  const handleChange = (event: { target: { value: string } }) => {
    let value = event.target.value;
    if (numericFormat) value = event.target.value.replace(/[^0-9.]/g, "");
    event.target.value = value;
    onChange({ target: { id: props.id, value } });
  };

  return (
    <TextField
      {...restProps}
      size="small"
      fullWidth
      variant={variant ? variant : "outlined"}
      onChange={handleChange}
    />
  );
}
