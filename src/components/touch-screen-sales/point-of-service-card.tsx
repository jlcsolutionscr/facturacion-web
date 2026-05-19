import { makeStyles } from "tss-react/mui";
import Badge from "@mui/material/Badge";

const useStyles = makeStyles()(() => ({
  root: {
    margin: "10px",
  },
  container: {
    display: "flex",
    backgroundColor: "#08415c90 ",
    color: "#444",
    boxShadow: "2px 2px 4px #777",
    cursor: "pointer",
    padding: "10px",
    border: "solid 1px lightgray",
    borderRadius: "5px",
    minWidth: "50px",
    height: "50px",
    alignItems: "center",
    justifyContent: "center",
  },
  active: {
    backgroundColor: "#08415c !important",
    color: "#CCC !important",
    boxShadow: "5px 5px 3px #777 !important",
  },
  title: {
    display: "flex",
    fontSize: "18px",
    fontFamily: "Helvetica",
    fontWeight: 600,
    margin: "5px",
    maxHeight: "20px",
    overflow: "hidden",

    "& span": {
      display: "inline-block",
      whiteSpace: "nowrap",
    },
  },
  actions: {
    display: "flex",
    justifyContent: "flex-end",
  },
  chipLeft: {
    marginRight: "10px",
  },
}));

interface PointOfServiceCardProps {
  title: string;
  active: boolean;
  edit: () => void;
}

export default function PointOfServiceCard({ title, active, edit }: PointOfServiceCardProps) {
  const { classes } = useStyles();

  if (active) {
    return (
      <div className={classes.root}>
        <Badge color="info" badgeContent="1" variant="standard">
          <div className={`${classes.container} ${active ? classes.active : ""}`} onClick={edit}>
            <div className={classes.title}>
              <span>{title}</span>
            </div>
          </div>
        </Badge>
      </div>
    );
  }
  return (
    <div className={classes.root}>
      <div className={`${classes.container} ${active ? classes.active : ""}`} onClick={edit}>
        <div className={classes.title}>
          <span>{title}</span>
        </div>
      </div>
    </div>
  );
}
