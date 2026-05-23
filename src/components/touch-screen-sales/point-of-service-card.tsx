import { makeStyles } from "tss-react/mui";
import Badge from "@mui/material/Badge";

const useStyles = makeStyles()(() => ({
  root: {
    margin: "10px",
  },
  container: {
    display: "flex",
    backgroundColor: "#08415c90",
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
  disabled: {
    opacity: 0.7,
    cursor: "default",
  },
  selected: {
    backgroundColor: "#82b9d3 !important",
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
  selected: boolean;
  edit: () => void;
  disabled?: boolean;
}

export default function PointOfServiceCard({
  title,
  active,
  selected,
  edit,
  disabled = false,
}: PointOfServiceCardProps) {
  const { classes } = useStyles();

  const PointOfServiceInfo = () => (
    <div
      className={`${classes.container} ${disabled ? classes.disabled : ""} ${active ? classes.active : selected ? classes.selected : ""}`}
      onClick={() => !disabled && edit()}
    >
      <div className={classes.title}>
        <span>{title}</span>
      </div>
    </div>
  );

  if (active) {
    return (
      <div className={classes.root}>
        <Badge color="info" badgeContent="1" variant="standard">
          <PointOfServiceInfo />
        </Badge>
      </div>
    );
  }
  return (
    <div className={classes.root}>
      <PointOfServiceInfo />
    </div>
  );
}
