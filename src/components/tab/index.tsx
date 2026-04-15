import { useStyles } from "./styles";

interface TabProps {
  title: string;
  edit: () => void;
}

export default function Tab({ title, edit }: TabProps) {
  const { classes } = useStyles();
  return (
    <div className={classes.container} onClick={edit}>
      <div className={classes.title}>
        <span>{title}</span>
      </div>
    </div>
  );
}
