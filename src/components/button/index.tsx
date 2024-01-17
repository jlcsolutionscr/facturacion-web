import { Button as MuiButton } from "@mui/material";

import { useStyles } from "./styles";

interface ButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  style?: { [key: string]: string | number | boolean };
  negative?: boolean;
  autoFocus?: boolean;
}

export default function Button({ disabled, style, negative, autoFocus, label, onClick }: ButtonProps) {
  const { classes } = useStyles();
  let styles = {};
  if (negative) styles = { backgroundColor: "#505050" };
  return (
    <div style={style}>
      <MuiButton
        variant="contained"
        disabled={disabled}
        style={styles}
        className={classes.button}
        autoFocus={autoFocus}
        onClick={onClick}
      >
        {label}
      </MuiButton>
    </div>
  );
}
