import { makeStyles } from "tss-react/mui";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select, { SelectProps } from "@mui/material/Select";

import { TRANSITION_ANIMATION } from "utils/constants";

export const useStyles = makeStyles()(theme => ({
  container: {
    minWidth: "100%",
    "& label": {
      backgroundColor: theme.palette.background.paper,
      paddingInlineStart: "5px",
      paddingInlineEnd: "7px",
      transition: `background-color ${TRANSITION_ANIMATION}`,
    },
  },
}));

export default function CustomSelect({ label, className, id, children, ...rest }: SelectProps<string>) {
  const { classes } = useStyles();
  return (
    <FormControl className={`${classes.container} ${className}`}>
      {label && <InputLabel htmlFor={id}>{label}</InputLabel>}
      <Select {...rest} variant="outlined" size="small" inputProps={{ id: id }}>
        {children}
      </Select>
    </FormControl>
  );
}
