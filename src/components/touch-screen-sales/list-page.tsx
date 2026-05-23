import { Button } from "jlc-component-library";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "tss-react/mui";
import Grid from "@mui/material/Grid";

import Tab from "./point-of-service-card";
import { setActiveSection } from "state/ui/reducer";
import { openServicePoint } from "state/working-order/asyncActions";
import { getServicePointList } from "state/working-order/reducer";

const useStyles = makeStyles()(theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    display: "flex",
    flexDirection: "column",
    maxWidth: "900px",
    width: "100%",
    margin: "10px auto",
    "@media screen and (max-width:959px)": {
      width: "calc(100% - 20px)",
      margin: "10px",
    },
    "@media screen and (max-width:599px)": {
      width: "100%",
      margin: "0",
    },
  },
  dataContainer: {
    display: "inline-flex",
    overflowX: "hidden",
    overflowY: "auto",
    margin: "20px",
    maxHeight: "calc(100% - 80px)",
    alignItems: "flex-start",
    "@media screen and (max-width:959px)": {
      margin: "15px",
    },
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "center",
  },
}));

export default function RestaurantOrderListPage() {
  const { classes } = useStyles();
  const dispatch = useDispatch();

  const servicePointList = useSelector(getServicePointList);

  const handleOpenOrderClick = (id: number) => {
    dispatch(openServicePoint({ id: id }));
  };

  const rows = servicePointList.map(row => (
    <Grid item key={row.Id} xs={4} sm={3} md={2} justifyItems="center">
      <Tab selected={false} title={row.Descripcion} active={row.Valor > 0} edit={() => handleOpenOrderClick(row.Id)} />
    </Grid>
  ));

  return (
    <div className={classes.root}>
      <div className={classes.dataContainer}>
        <Grid container justifyContent="center">
          {rows}
        </Grid>
      </div>
      <div className={classes.buttonContainer}>
        <Button label="Regresar" onClick={() => dispatch(setActiveSection(0))} />
      </div>
    </div>
  );
}
