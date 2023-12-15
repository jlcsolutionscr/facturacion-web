import { useStyles } from "./styles";

interface LabelFieldProps {
  id: string;
  label: string;
  value: string;
}

export default function LabelField(props: LabelFieldProps) {
  const { classes } = useStyles();
  return (
    <div className={classes.container}>
      <div className={classes.root}>
        <div className={classes.input}>
          <span className={`${classes.innerText} ${classes.font}`}>
            {props.value}
          </span>
        </div>
        <label className={`${classes.label} ${classes.font}`}>
          {props.label}
        </label>
      </div>
    </div>
  );
}
