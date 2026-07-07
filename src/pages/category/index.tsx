import { Button, Select, TextField, type TextFieldOnChangeEventType } from "jlc-component-library";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "tss-react/mui";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";

import { saveCategory } from "state/product/asyncActions";
import {
  addBranchToCategory,
  getCategory,
  getProductTypeList,
  removeBranchFromCategory,
  setCategoryAttribute,
} from "state/product/reducer";
import { getBranchList } from "state/session/reducer";
import { setActiveSection } from "state/ui/reducer";
import { TRANSITION_ANIMATION } from "utils/constants";
import { AddCircleIcon, RemoveCircleIcon } from "utils/iconsHelper";

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
  innerButton: {
    padding: "0px",
  },
  outerButton: {
    padding: "8px",
  },
  footer: {
    display: "flex",
    height: "50px",
    alignItems: "center",
  },
}));

export default function CategoryPage() {
  const { classes } = useStyles();
  const [branchId, setBranchId] = useState(0);
  const dispatch = useDispatch();
  const category = useSelector(getCategory);
  const branchList = useSelector(getBranchList);
  const productTypeList = useSelector(getProductTypeList);

  useEffect(() => {
    if (branchList.length > 0) {
      setBranchId(branchList[0].Id);
    }
  }, [branchList]);

  const handleChange = (event: TextFieldOnChangeEventType) => {
    dispatch(
      setCategoryAttribute({
        attribute: event.target.id,
        value: event.target.value,
      })
    );
  };

  const productTypes = productTypeList.map(item => (
    <MenuItem key={item.Id} value={item.Id}>
      {item.Descripcion}
    </MenuItem>
  ));

  const branchItems = branchList.map(item => (
    <MenuItem key={item.Id} value={item.Id}>
      {item.Descripcion}
    </MenuItem>
  ));

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
          <Grid item xs={12} sm={6}>
            <TextField
              required
              id="Descripcion"
              value={category.Descripcion}
              label="Descripción"
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Select
              id="tipo-select-id"
              label="Seleccione el tipo de producto"
              value={category.Tipo.toString()}
              onChange={event => dispatch(setCategoryAttribute({ attribute: "Tipo", value: event.target.value }))}
            >
              {productTypes}
            </Select>
          </Grid>
          {branchList.length > 1 && (
            <Grid item container spacing={{ xs: 1, sm: 2 }} alignItems="center">
              <Grid item xs={10} md={11}>
                <Select
                  id="sucursal-select-id"
                  label="Seleccione la sucursal:"
                  value={branchId.toString()}
                  onChange={event => dispatch(setBranchId(parseInt(event.target.value)))}
                >
                  {branchItems}
                </Select>
              </Grid>
              <Grid item xs={2} md={1}>
                <button
                  type="submit"
                  style={{
                    backgroundColor: "transparent",
                    border: "none",
                    margin: "auto",
                    padding: "0",
                    width: "auto",
                    height: "auto",
                  }}
                >
                  <IconButton
                    className={classes.outerButton}
                    color="primary"
                    disabled={category.LineaPorSucursal.some(b => b.IdSucursal === branchId)}
                    component="span"
                    onClick={() => dispatch(addBranchToCategory(branchId))}
                  >
                    <AddCircleIcon />
                  </IconButton>
                </button>
              </Grid>
            </Grid>
          )}
          <Grid item container style={{ overflowY: "auto" }}>
            <Grid item xs={12}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell align="left">Sucursales asignadas</TableCell>
                    <TableCell align="center"> - </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {category.LineaPorSucursal.map(row => (
                    <TableRow key={row.IdSucursal}>
                      <TableCell>{branchList.find(b => b.Id === row.IdSucursal)?.Descripcion || ""}</TableCell>
                      <TableCell align="center">
                        <IconButton
                          className={classes.innerButton}
                          color="secondary"
                          component="span"
                          onClick={() => dispatch(removeBranchFromCategory(row.IdSucursal))}
                        >
                          <RemoveCircleIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Grid>
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
