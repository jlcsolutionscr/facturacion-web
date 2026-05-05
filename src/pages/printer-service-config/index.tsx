import { Button, TextField } from "jlc-component-library";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "tss-react/mui";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

import { getPrinterServerAddress, setActiveSection, setPrinterServerAddress } from "state/ui/reducer";
import { TRANSITION_ANIMATION } from "utils/constants";

const useStyles = makeStyles()(theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    overflowY: "hidden",
    maxWidth: "900px",
    width: "100%",
    margin: "10px auto",
    transition: `background-color ${TRANSITION_ANIMATION}`,
    "@media screen and (max-width:959px)": {
      width: "calc(100% - 20px)",
      margin: "10px",
    },
    "@media screen and (max-width:599px)": {
      width: "calc(100% - 10px)",
      margin: "5px",
    },
  },
  header: {
    height: "45px",
    alignContent: "center",
  },
  content: {
    overflowY: "scroll",
    height: "calc(100% - 105px)",
    padding: "5px",
    scrollbarWidth: "thin",
  },
  footer: {
    display: "flex",
    height: "50px",
    alignItems: "center",
  },
}));

export default function CompanyPage() {
  const { classes } = useStyles();

  const dispatch = useDispatch();
  const printerServerAddress = useSelector(getPrinterServerAddress);

  return (
    <Box className={classes.root}>
      <Box className={classes.header}>
        <Typography variant="h6" textAlign="center" fontWeight="700" color="textPrimary">
          Configuración del servidor de impresión
        </Typography>
      </Box>
      <Box className={classes.content}>
        <Grid container spacing={{ xs: 1, sm: 2 }}>
          <Grid item xs={12}>
            <TextField
              id="printerServerAddress"
              value={printerServerAddress}
              label="Dirección del servidor"
              autoComplete="off"
              onChange={e => dispatch(setPrinterServerAddress(e.target.value))}
            />
          </Grid>
        </Grid>
      </Box>
      <Box className={classes.footer}>
        <Grid container justifyContent="center" gap={1}>
          <Button label="Regresar" onClick={() => dispatch(setActiveSection(0))} />
        </Grid>
      </Box>
    </Box>
  );
}
