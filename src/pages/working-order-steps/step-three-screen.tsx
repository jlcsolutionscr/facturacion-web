import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "tss-react/mui";
import Grid from "@mui/material/Grid";

import TextField from "components/text-field";
import { getDeliveryDetails, getStatus, setDeliveryAttribute } from "state/working-order/reducer";

const useStyles = makeStyles()(theme => ({
  container: {
    flex: 1,
    overflowY: "auto",
    backgroundColor: theme.palette.background.paper,
    padding: "20px",
    "@media screen and (max-width:959px)": {
      padding: "15px",
    },
    "@media screen and (max-width:599px)": {
      padding: "10px",
    },
    "@media screen and (max-width:429px)": {
      padding: "10 5px 5px 5px",
    },
  },
}));

interface StepThreeScreenProps {
  index: number;
  value: number;
  className?: string;
}

export default function StepThreeScreen({ value, index, className }: StepThreeScreenProps) {
  const { classes } = useStyles();
  const dispatch = useDispatch();
  const myRef = useRef<HTMLDivElement>(null);

  const delivery = useSelector(getDeliveryDetails);
  const status = useSelector(getStatus);

  useEffect(() => {
    if (value === 2) myRef.current?.scrollTo(0, 0);
  }, [value]);

  const fieldDisabled = status === "converted";

  return (
    <div ref={myRef} className={`${classes.container} ${className}`} hidden={value !== index}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            disabled={fieldDisabled}
            label="Teléfono"
            id="Telefono"
            value={delivery.phone}
            onChange={event => dispatch(setDeliveryAttribute({ attribute: "phone", value: event.target.value }))}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            disabled={fieldDisabled}
            label="Dirección"
            id="Direccion"
            value={delivery.address}
            onChange={event => dispatch(setDeliveryAttribute({ attribute: "address", value: event.target.value }))}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            disabled={fieldDisabled}
            label="Descripción"
            id="ThreeDescripcion"
            value={delivery.description}
            onChange={event => dispatch(setDeliveryAttribute({ attribute: "description", value: event.target.value }))}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            disabled={fieldDisabled}
            label="Fecha de entrega"
            id="FechaDeEntrega"
            value={delivery.date}
            onChange={event => dispatch(setDeliveryAttribute({ attribute: "date", value: event.target.value }))}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            disabled={fieldDisabled}
            label="Hora de entrega"
            id="HoraDeEntrega"
            value={delivery.time}
            onChange={event => dispatch(setDeliveryAttribute({ attribute: "time", value: event.target.value }))}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            disabled={status === "converted"}
            label="Observaciones"
            id="Observaciones"
            value={delivery.details}
            onChange={event => dispatch(setDeliveryAttribute({ attribute: "details", value: event.target.value }))}
          />
        </Grid>
      </Grid>
    </div>
  );
}
