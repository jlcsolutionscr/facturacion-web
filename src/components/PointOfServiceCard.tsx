import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles()(() => ({
  container: {
    display: "flex",
    backgroundColor: "rgb(8, 65, 96)",
    color: "#CCC",
    boxShadow: "6px 6px 6px #777",
    cursor: "pointer",
    margin: "10px",
    padding: "7px",
    border: "solid 1px lightgray",
    borderRadius: "5px",
    width: "auto",
    height: "50px",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    display: "flex",
    fontSize: "18px",
    fontFamily: "Russo One",
    margin: "5px",
    maxHeight: "20px",
    overflow: "hidden",
  },
  actions: {
    display: "flex",
    justifyContent: "flex-end",
  },
  chipLeft: {
    marginRight: "10px",
  },
}));

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
