import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select, { SelectProps } from "@mui/material/Select";

export default function CustomSelect({
  style,
  label,
  className,
  id,
  children,
  ...rest
}: SelectProps<string>) {
  return (
    <FormControl className={className} style={style}>
      {label && <InputLabel htmlFor={id}>{label}</InputLabel>}
      <Select {...rest} inputProps={{ id: id }}>
        {children}
      </Select>
    </FormControl>
  );
}
