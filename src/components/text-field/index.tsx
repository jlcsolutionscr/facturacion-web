import React from "react";
import TextField from "@mui/material/TextField";

function CustomTextField(props) {
  const { onChange, numericFormat, variant, ...restProps } = props;
  const handleChange = (event) => {
    let value = event.target.value;
    if (numericFormat) value = event.target.value.replace(/[^0-9.]/g, "");
    event.target.value = value;
    onChange(event);
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

export default CustomTextField;
