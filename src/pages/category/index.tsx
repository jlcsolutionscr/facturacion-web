import { Button, TextField, type TextFieldOnChangeEventType } from "jlc-component-library";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "tss-react/mui";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

import { saveCategory } from "state/product/asyncActions";
import { getCategory, setCategoryAttribute } from "state/product/reducer";
import { setActiveSection } from "state/ui/reducer";
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

export default function CategoryPage() {
  const { classes } = useStyles();
  const dispatch = useDispatch();
  const category = useSelector(getCategory);

  const handleChange = (event: TextFieldOnChangeEventType) => {
    dispatch(
      setCategoryAttribute({
        attribute: event.target.id,
        value: event.target.value,
      })
    );
  };

  const disabled = category === null || category.Descripcion === "";

  return (
    <Box className={classes.root}>
      <Box className={classes.header}>
        <Typography variant="h6" textAlign="center" fontWeight="700" color="textPrimary">
          Información de la Categoría del Producto
        </Typography>
      </Box>
      <Box className={classes.content}>
        <Grid container spacing={{ xs: 1, sm: 2 }}>
          <Grid item xs={12} md={6}>
            <TextField
              required
              id="Descripcion"
              value={category.Descripcion}
              label="Descripción"
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              id="ImpresoraTiquete"
              value={category.ImpresoraTiquete}
              label="Impresora Tiquete"
              onChange={handleChange}
            />
          </Grid>
        </Grid>
      </Box>
      <Box className={classes.footer}>
        <Grid container justifyContent="center" gap={1}>
          <Button disabled={disabled} label="Guardar" onClick={() => dispatch(saveCategory())} />
          <Button label="Regresar" onClick={() => dispatch(setActiveSection(16))} />
        </Grid>
      </Box>
    </Box>
  );
}
