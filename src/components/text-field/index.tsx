import TextField, { TextFieldVariants } from "@mui/material/TextField";

interface CustomTextFieldProps {
  id: string;
  value: string;
  label: string;
  numericFormat?: string;
  variant?: TextFieldVariants;
  onChange: (event: { target: { id: string; value: string } }) => void;
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
