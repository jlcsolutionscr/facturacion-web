import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "tss-react/mui";
import Grid from "@mui/material/Grid";
import FormControl from "@mui/material/FormControl";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import MenuItem from "@mui/material/MenuItem";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";

import TextField from "components/text-field";
import LabelField from "components/label-field";
import Button from "components/button";
import Select from "components/select";
import {
  updateCantonList,
  updateDistritoList,
  updateBarrioList,
} from "state/ui/asyncActions";
import {
  setActiveSection,
  getBarrioList,
  getCantonList,
  getDistritoList,
} from "state/ui/reducer";
import {
  saveCompany,
  addActivity,
  removeActivity,
} from "state/company/asyncActions";
import {
  getCredentials,
  setCompanyAttribute,
  setCredentialsAttribute,
  getAvailableEconomicActivityList,
} from "state/company/reducer";
import { convertToDateString } from "utils/utilities";
import { AddCircleIcon, RemoveCircleIcon } from "utils/iconsHelper";
import { getCompany } from "state/session/reducer";

const useStyles = makeStyles()((theme) => ({
  root: {
    backgroundColor: theme.palette.custom.pagesBackground,
    overflowY: "auto",
    margin: "20px auto auto auto",
    padding: "20px",
    "@media screen and (max-width:960px)": {
      marginTop: "16px",
      padding: "16px",
    },
    "@media screen and (max-width:600px)": {
      marginTop: "13px",
      padding: "13px",
    },
    "@media screen and (max-width:414px)": {
      marginTop: "10px",
      padding: "10px",
    },
  },
}));

export default function CompanyPage() {
  const { classes } = useStyles();
  const dispatch = useDispatch();
  const company = useSelector(getCompany);
  const credentials = useSelector(getCredentials);
  const cantonList = useSelector(getCantonList);
  const distritoList = useSelector(getDistritoList);
  const barrioList = useSelector(getBarrioList);
  const economicActivityList = useSelector(getAvailableEconomicActivityList);

  const [certificate, setCertificate] = React.useState("");
  const [activityCode, setActivityCode] = React.useState<string>(
    economicActivityList.length > 0 ? economicActivityList[0].Id.toString() : ""
  );
  const inputFile = React.useRef<HTMLInputElement>(null);
  let disabled = true;
  if (company === null) return null;
  disabled =
    company.NombreEmpresa === "" ||
    company.Identificacion === "" ||
    activityCode === null ||
    company.Direccion === "" ||
    company.Telefono1 === "" ||
    company.CorreoNotificacion === "" ||
    (!company.RegimenSimplificado &&
      (credentials === null ||
        company.ActividadEconomicaEmpresa.length === 0 ||
        credentials.UsuarioHacienda === "" ||
        credentials.ClaveHacienda === "" ||
        credentials.Certificado === "" ||
        credentials.PinCertificado === ""));

  const handleChange = (event: { target: { id?: any; value: any } }) => {
    dispatch(
      setCompanyAttribute({
        attribute: event.target.id,
        value: event.target.value,
      })
    );
  };

  const handleSelectChange = (id: string, value: number) => {
    if (id === "IdProvincia") {
      dispatch(updateCantonList({ id: value }));
      dispatch(setCompanyAttribute({ attribute: "IdProvincia", value: value }));
      dispatch(setCompanyAttribute({ attribute: "IdCanton", value: 1 }));
      dispatch(setCompanyAttribute({ attribute: "IdDistrito", value: 1 }));
      dispatch(setCompanyAttribute({ attribute: "IdBarrio", value: 1 }));
    } else if (id === "IdCanton") {
      dispatch(updateDistritoList({ id: company.IdProvincia, subId: value }));
      dispatch(setCompanyAttribute({ attribute: "IdCanton", value: value }));
      dispatch(setCompanyAttribute({ attribute: "IdDistrito", value: 1 }));
      dispatch(setCompanyAttribute({ attribute: "IdBarrio", value: 1 }));
    } else if (id === "IdDistrito") {
      dispatch(
        updateBarrioList({
          id: company.IdProvincia,
          subId: company.IdCanton,
          subSubId: value,
        })
      );
      dispatch(setCompanyAttribute({ attribute: "IdDistrito", value: value }));
      dispatch(setCompanyAttribute({ attribute: "IdBarrio", value: 1 }));
    } else {
      dispatch(setCompanyAttribute({ attribute: "IdBarrio", value: value }));
    }
  };

  const handleCertificateChange = (event: {
    preventDefault: () => void;
    target: { files: FileList | null };
  }) => {
    event.preventDefault();
    if (event.target.files !== null) {
      const reader: FileReader = new FileReader();
      const file = event.target.files[0];
      dispatch(
        setCredentialsAttribute({ attribute: "certificate", value: file.name })
      );
      reader.onloadend = () => {
        const certificateBase64 = (reader.result as string).substring(
          (reader.result as string).indexOf(",") + 1
        );
        setCertificate(certificateBase64);
      };
      reader.readAsDataURL(file);
    }
  };

  const cantonItems = cantonList.map((item) => {
    return (
      <MenuItem key={item.Id} value={item.Id}>
        {item.Descripcion}
      </MenuItem>
    );
  });

  const distritoItems = distritoList.map((item) => {
    return (
      <MenuItem key={item.Id} value={item.Id}>
        {item.Descripcion}
      </MenuItem>
    );
  });

  const barrioItems = barrioList.map((item) => {
    return (
      <MenuItem key={item.Id} value={item.Id}>
        {item.Descripcion}
      </MenuItem>
    );
  });

  const activityItems = economicActivityList.map((item) => {
    return (
      <MenuItem key={item.Id} value={item.Id}>
        {item.Descripcion}
      </MenuItem>
    );
  });

  return (
    <div className={classes.root}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            id="NombreEmpresa"
            value={company.NombreEmpresa}
            label="Nombre empresa"
            autoComplete="off"
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            id="NombreComercial"
            value={company.NombreComercial}
            label="Nombre comercial"
            autoComplete="off"
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <LabelField
            id="FechaVence"
            value={convertToDateString(company.FechaVence)}
            label="Fecha vencimiento plan"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Select
            id="IdProvincia"
            label="Provincia"
            value={company.IdProvincia.toString()}
            onChange={(event) =>
              handleSelectChange("IdProvincia", parseInt(event.target.value))
            }
          >
            <MenuItem value={1}>SAN JOSE</MenuItem>
            <MenuItem value={2}>ALAJUELA</MenuItem>
            <MenuItem value={3}>CARTAGO</MenuItem>
            <MenuItem value={4}>HEREDIA</MenuItem>
            <MenuItem value={5}>GUANACASTE</MenuItem>
            <MenuItem value={6}>PUNTARENAS</MenuItem>
            <MenuItem value={7}>LIMON</MenuItem>
          </Select>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Select
            id="IdCanton"
            label="Cantón"
            value={cantonItems.length > 1 ? company.IdCanton.toString() : ""}
            onChange={(event) =>
              handleSelectChange("IdCanton", parseInt(event.target.value))
            }
          >
            {cantonItems}
          </Select>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Select
            id="IdDistrito"
            label="Distrito"
            value={
              distritoItems.length > 1 ? company.IdDistrito.toString() : ""
            }
            onChange={(event) =>
              handleSelectChange("IdDistrito", parseInt(event.target.value))
            }
          >
            {distritoItems}
          </Select>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Select
            id="IdBarrio"
            label="Barrio"
            value={barrioItems.length > 1 ? company.IdBarrio.toString() : ""}
            onChange={(event) =>
              handleSelectChange("IdBarrio", parseInt(event.target.value))
            }
          >
            {barrioItems}
          </Select>
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            id="Direccion"
            value={company.Direccion}
            label="Dirección"
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            id="Telefono1"
            value={company.Telefono1}
            label="Teléfono 1"
            numericFormat
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            id="Telefono2"
            value={company.Telefono2}
            label="Teléfono 2"
            numericFormat
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            id="CorreoNotificacion"
            value={company.CorreoNotificacion}
            label="Correo para notificaciones"
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            disabled={company.RegimenSimplificado}
            id="UsuarioHacienda"
            value={credentials.UsuarioHacienda}
            label="Usuario ATV"
            onChange={(event) =>
              dispatch(
                setCredentialsAttribute({
                  attribute: "UsuarioHacienda",
                  value: event.target.value,
                })
              )
            }
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            disabled={company.RegimenSimplificado}
            id="ClaveHacienda"
            value={credentials.ClaveHacienda}
            label="Clave ATV"
            onChange={(event) =>
              dispatch(
                setCredentialsAttribute({
                  attribute: "ClaveHacienda",
                  value: event.target.value,
                })
              )
            }
          />
        </Grid>
        <Grid item xs={8} sm={9} md={10}>
          <TextField
            disabled
            id="Certificado"
            value={credentials.Certificado}
            label="Llave criptográfica"
            onChange={(event) =>
              dispatch(
                setCredentialsAttribute({
                  attribute: "Certificado",
                  value: event.target.value,
                })
              )
            }
          />
        </Grid>
        <Grid item xs={1}>
          <input
            accept="p12/*"
            style={{ display: "none" }}
            id="contained-button-file"
            ref={inputFile}
            multiple
            type="file"
            onChange={handleCertificateChange}
          />
          <Button
            disabled={company.RegimenSimplificado}
            label="Cargar"
            onClick={() => inputFile.current?.click()}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            disabled={company.RegimenSimplificado}
            id="PinCertificado"
            value={credentials.PinCertificado}
            label="Pin de llave criptográfica"
            onChange={(event) =>
              dispatch(
                setCredentialsAttribute({
                  attribute: "PinCertificado",
                  value: event.target.value,
                })
              )
            }
          />
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Checkbox
                checked={company.PrecioVentaIncluyeIVA}
                onChange={() =>
                  dispatch(
                    setCompanyAttribute({
                      attribute: "PrecioVentaIncluyeIVA",
                      value: !company.PrecioVentaIncluyeIVA,
                    })
                  )
                }
                name="PrecioVentaIncluyeIVA"
                color="primary"
              />
            }
            label="IVA incluido en precio de venta"
          />
        </Grid>
        <Grid item xs={8} md={6}>
          <Select
            id="codigo-actividad-id"
            label="Seleccione la Actividad Económica"
            value={activityCode}
            onChange={(event) => setActivityCode(event.target.value)}
          >
            {activityItems}
          </Select>
        </Grid>
        <Grid item xs={2}>
          <IconButton
            color="primary"
            disabled={activityCode === ""}
            component="span"
            onClick={() =>
              dispatch(addActivity({ id: parseInt(activityCode) }))
            }
          >
            <AddCircleIcon />
          </IconButton>
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={2} style={{ overflowY: "auto" }}>
            <Grid item xs={12} md={10}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Actividades Económicas Asignadas</TableCell>
                    <TableCell> - </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {company.ActividadEconomicaEmpresa.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>{`${row.CodigoActividad} - ${row.Descripcion}`}</TableCell>
                      <TableCell>
                        <IconButton
                          color="secondary"
                          component="span"
                          onClick={() =>
                            dispatch(
                              removeActivity({ id: row.CodigoActividad })
                            )
                          }
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
        </Grid>
        <Grid item xs={5} sm={3} md={2}>
          <Button
            disabled={disabled}
            label="Guardar"
            onClick={() => dispatch(saveCompany({ certificate }))}
          />
        </Grid>
        <Grid item xs={5} sm={3} md={2}>
          <Button
            label="Regresar"
            onClick={() => dispatch(setActiveSection(0))}
          />
        </Grid>
      </Grid>
    </div>
  );
}
