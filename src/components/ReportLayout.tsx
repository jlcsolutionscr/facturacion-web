import { Button, DataGrid } from "jlc-component-library";
import { makeStyles } from "tss-react/mui";
import Typography from "@mui/material/Typography";

import { TRANSITION_ANIMATION } from "utils/constants";
import { formatCurrency } from "utils/utilities";

const useStyles = makeStyles()(theme => ({
  container: {
    overflow: "auto",
  },
  title: {
    color: theme.palette.text.primary,
    textAlign: "center",
    fontSize: theme.typography.pxToRem(20),
    marginBottom: "12px",
    transition: `color ${TRANSITION_ANIMATION}`,
  },
  subTitle: {
    color: theme.palette.text.primary,
    textAlign: "center",
    fontSize: theme.typography.pxToRem(15),
    marginBottom: "8px",
    transition: `color ${TRANSITION_ANIMATION}`,
  },
  headerRange: {
    display: "flex",
    flexDirection: "row",
  },
}));

type DataType = { [key: string]: any };

interface DetailLayoutProps {
  reportName: string;
  summary: any;
  data: DataType[];
  returnOnClick: () => void;
}

function DetailLayout({ reportName, summary, data, returnOnClick }: DetailLayoutProps) {
  const { classes } = useStyles();
  const columns = Object.entries(data[0]).map(key => ({
    field: key[0],
    headerName: key[0],
    type: typeof key[1] === "number" && key[0] !== "Id" ? "number" : "",
  }));
  const rows = data.map(row => {
    const data: typeof row = {};
    columns.forEach(col => {
      data[col.field] = col.type === "number" ? formatCurrency(row[col.field]) : row[col.field];
    });
    return data;
  });

  return (
    <div className={classes.container}>
      <Typography className={classes.title} color="textPrimary" component="p">
        {reportName}
      </Typography>
      <div className={classes.headerRange}>
        <div style={{ width: "60%" }}>
          {summary && (
            <Typography className={classes.subTitle} color="textPrimary" component="p">
              Fecha inicio: {summary.startDate}
            </Typography>
          )}
        </div>
        <div style={{ width: "60%" }}>
          {summary && (
            <Typography className={classes.subTitle} color="textPrimary" component="p">
              Fecha final: {summary.endDate}
            </Typography>
          )}
        </div>
      </div>
      <DataGrid showHeader dense columns={columns} rows={rows} rowsPerPage={6} />
      <div style={{ margin: "10px 0 7px 0" }}>
        <Button label="Regresar" onClick={() => returnOnClick()} />
      </div>
    </div>
  );
}

export default DetailLayout;
