import { makeStyles } from "tss-react/mui";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select, { SelectProps } from "@mui/material/Select";

export const useStyles = makeStyles()(() => ({
  container: {
    width: "100%",
  },
}));

type CustomSelectType = SelectProps<string> & {
  maxWidth?: string;
};

export default function CustomSelect({ label, className, id, maxWidth, children, ...rest }: CustomSelectType) {
  const { classes } = useStyles();
  return (
    <FormControl className={`${classes.container} ${className}`} style={{ maxWidth }}>
      {label && <InputLabel id={id}>{label}</InputLabel>}
      <Select {...rest} label={label ?? undefined} variant="outlined" size="small" inputProps={{ id: id }}>
        {children}
      </Select>
    </FormControl>
  );
}
