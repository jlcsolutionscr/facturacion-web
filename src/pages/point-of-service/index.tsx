import { Button, TextField, type TextFieldOnChangeEventType } from "jlc-component-library";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "tss-react/mui";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

import { setActiveSection } from "state/ui/reducer";
import { saveServicePoint } from "state/working-order/asyncActions";
import { getServicePointEntity, setServicePointAttribute } from "state/working-order/reducer";
import { TRANSITION_ANIMATION } from "utils/constants";

const useStyles = makeStyles()(theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    overflowY: "hidden",
    maxWidth: "600px",
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

export default function PointOfServicePage() {
  const { classes } = useStyles();
  const dispatch = useDispatch();
  const servicePoint = useSelector(getServicePointEntity);

  const handleChange = (event: TextFieldOnChangeEventType) => {
    dispatch(
      setServicePointAttribute({
        attribute: event.target.id,
        value: event.target.value,
      })
    );
  };

  const disabled = servicePoint === null || servicePoint.Descripcion === "";

  return (
    <Box className={classes.root}>
      <Box className={classes.header}>
        <Typography variant="h6" textAlign="center" fontWeight="700" color="textPrimary">
          Información del Punto de Servicio
        </Typography>
      </Box>
      <Box className={classes.content}>
        <Grid container spacing={{ xs: 1, sm: 2 }}>
          <Grid item xs={12}>
            <TextField
              required
              id="Descripcion"
              value={servicePoint.Descripcion}
              label="Descripción"
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              componentsProps={{
                typography: { variant: "body1", color: "text.primary" },
              }}
              control={
                <Checkbox
                  checked={servicePoint.Activo}
                  onChange={event =>
                    dispatch(
                      setServicePointAttribute({
                        attribute: "Activo",
                        value: event.target.checked,
                      })
                    )
                  }
                  name="Activo"
                />
              }
              label="Estado activo:"
            />
          </Grid>
        </Grid>
      </Box>
      <Box className={classes.footer}>
        <Grid container justifyContent="center" gap={1}>
          <Button disabled={disabled} label="Guardar" onClick={() => dispatch(saveServicePoint())} />
          <Button label="Regresar" onClick={() => dispatch(setActiveSection(18))} />
        </Grid>
      </Box>
    </Box>
  );
}
