import { makeStyles } from "tss-react/mui";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select, { SelectProps } from "@mui/material/Select";

export const useStyles = makeStyles()(() => ({
  container: {
    "& .MuiInputLabel-root": {
      transform: "translate(0px, 0px) scale(0.75)",
    },
  },
}));

export default function CustomSelect({ style, label, className, id, children, ...rest }: SelectProps<string>) {
  const { classes } = useStyles();
  return (
    <FormControl className={`${classes.container} ${className}`} style={style}>
      {label && <InputLabel htmlFor={id}>{label}</InputLabel>}
      <Select {...rest} variant="standard" inputProps={{ id: id }}>
        {children}
      </Select>
    </FormControl>
  );
}
