import { SyntheticEvent } from "react";
import TextField, { TextFieldVariants } from "@mui/material/TextField";

import { useStyles } from "./styles";

export type TextFieldOnChangeEventType = {
  target: { id?: string; value: string };
};

interface CustomTextFieldProps {
  value: string;
  label: string;
  id?: string;
  placeholder?: string;
  numericFormat?: boolean;
  autoComplete?: string;
  variant?: TextFieldVariants;
  readOnly?: boolean;
  disabled?: boolean;
  required?: boolean;
  inputProps?: { [key: string]: string | number | boolean };
  onChange?: (event: TextFieldOnChangeEventType) => void;
  onPaste?: (event: SyntheticEvent) => void;
}

export default function CustomTextField(props: CustomTextFieldProps) {
  const { classes } = useStyles();
  const { onChange, numericFormat, variant, readOnly, ...restProps } = props;
  const handleChange = (event: { target: { value: string } }) => {
    let value = event.target.value;
    if (numericFormat) value = event.target.value.replace(/[^0-9.]/g, "");
    event.target.value = value;
    onChange && onChange({ target: { id: props.id, value } });
  };

  return (
    <TextField
      {...restProps}
      InputProps={{
        readOnly: readOnly ?? false,
      }}
      className={classes.input}
      size="small"
      fullWidth
      variant={variant ? variant : "outlined"}
      onChange={handleChange}
    />
  );
}
