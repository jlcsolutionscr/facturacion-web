import { makeStyles } from "tss-react/mui";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select, { SelectProps } from "@mui/material/Select";

export const useStyles = makeStyles()(() => ({
  container: {
    minWidth: "100%",
  },
}));

export default function CustomSelect({ label, className, id, children, ...rest }: SelectProps<string>) {
  const { classes } = useStyles();
  return (
    <FormControl className={`${classes.container} ${className}`}>
      {label && <InputLabel id={id}>{label}</InputLabel>}
      <Select {...rest} label={label ?? undefined} variant="outlined" size="small" inputProps={{ id: id }}>
        {children}
      </Select>
    </FormControl>
  );
}
