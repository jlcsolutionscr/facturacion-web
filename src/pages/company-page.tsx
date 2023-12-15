import React from "react";
import { connect, useSelector } from "react-redux";
import { bindActionCreators } from "redux";
import { makeStyles } from "tss-react/mui";
import Grid from "@mui/material/Grid";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
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
  getEconomicActivityList,
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

function CompanyPage() {
  const { classes } = useStyles();
  const company = useSelector(getCompany);
  const credentials = useSelector(getCredentials);
  const cantonList = useSelector(getCantonList);
  const distritoList = useSelector(getDistritoList);
  const barrioList = useSelector(getBarrioList);
  const economicActivityList = useSelector(getEconomicActivityList);

  const [certificate, setCertificate] = React.useState("");
  const [activityCode, setActivityCode] = React.useState(
    economicActivityList.length > 0 ? economicActivityList[0].companyId : null
  );
  const inputFile = React.useRef(null);
  let disabled = true;
  if (company === null) return null;
  disabled =
    company.name === "" ||
    company.identifier === "" ||
    company.activityCode === "" ||
    company.address === "" ||
    company.phoneNumber === "" ||
    company.notificationEmail === "" ||
    (!company.simplifyRegimen &&
      (credentials === null ||
        company.economicActivityList.length === 0 ||
        credentials.user === "" ||
        credentials.password === "" ||
        credentials.certificate === "" ||
        credentials.certificatePin === ""));
  const handleChange = (event: { target: { id: any; value: any } }) => {
    setCompanyAttribute({
      attribute: event.target.id,
      value: event.target.value,
    });
  };
  const handleSelectChange = (id: string, value: number) => {
    if (id === "provinceId") {
      updateCantonList({ id: value });
      setCompanyAttribute({ attribute: "provinceId", value: value });
      setCompanyAttribute({ attribute: "cantonId", value: 1 });
      setCompanyAttribute({ attribute: "districtId", value: 1 });
      setCompanyAttribute({ attribute: "neighborhoodId", value: 1 });
    } else if (id === "cantonId") {
      updateDistritoList({ id: company.provinceId, subId: value });
      setCompanyAttribute({ attribute: "cantonId", value: value });
      setCompanyAttribute({ attribute: "districtId", value: 1 });
      setCompanyAttribute({ attribute: "neighborhoodId", value: 1 });
    } else if (id === "districtId") {
      updateBarrioList({
        id: company.provinceId,
        subId: company.cantonId,
        subSubId: value,
      });
      setCompanyAttribute({ attribute: "districtId", value: value });
      setCompanyAttribute({ attribute: "neighborhoodId", value: 1 });
    } else {
      setCompanyAttribute({ attribute: "neighborhoodId", value: value });
    }
  };
  const handleCertificateChange = (event: {
    preventDefault: () => void;
    target: { files: any[] };
  }) => {
    event.preventDefault();
    const reader: FileReader = new FileReader();
    const file = event.target.files[0];
    setCredentialsAttribute({ attribute: "certificate", value: file.name });
    reader.onloadend = () => {
      const certificateBase64 = (reader.result as string).substring(
        (reader.result as string).indexOf(",") + 1
      );
      setCertificate(certificateBase64);
    };
    reader.readAsDataURL(file);
  };
  const cantonItems = cantonList.map((item) => {
    return (
      <MenuItem key={item.id} value={item.Id}>
        {item.description}
      </MenuItem>
    );
  });
  const distritoItems = distritoList.map((item) => {
    return (
      <MenuItem key={item.id} value={item.id}>
        {item.description}
      </MenuItem>
    );
  });
  const barrioItems = barrioList.map((item) => {
    return (
      <MenuItem key={item.id} value={item.id}>
        {item.description}
      </MenuItem>
    );
  });
  const activityItems = economicActivityList.map((item) => {
    return (
      <MenuItem key={item.code} value={item.code}>
        {item.description}
      </MenuItem>
    );
  });
  return (
    <div className={classes.root}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            id="name"
            value={company.name}
            label="Nombre empresa"
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            id="comercialName"
            value={company.comercialName}
            label="Nombre comercial"
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <LabelField
            id="expirationDate"
            value={convertToDateString(company.expirationDate)}
            label="Fecha vencimiento plan"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Provincia</InputLabel>
            <Select
              id="provinceId"
              value={company.provinceId}
              onChange={(event) =>
                handleSelectChange("IdProvincia", event.target.value)
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
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Cantón</InputLabel>
            <Select
              id="IdCanton"
              value={company && cantonItems.length > 0 ? company.IdCanton : ""}
              onChange={(event) =>
                handleSelectChange("IdCanton", event.target.value)
              }
            >
              {cantonItems}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Distrito</InputLabel>
            <Select
              id="IdDistrito"
              value={
                company && distritoItems.length > 0 ? company.IdDistrito : ""
              }
              onChange={(event) =>
                handleSelectChange("IdDistrito", event.target.value)
              }
            >
              {distritoItems}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Barrio</InputLabel>
            <Select
              id="IdBarrio"
              value={company && barrioItems.length > 0 ? company.IdBarrio : ""}
              onChange={(event) =>
                handleSelectChange("IdBarrio", event.target.value)
              }
            >
              {barrioItems}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            id="Direccion"
            value={company ? company.Direccion : ""}
            label="Dirección"
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            id="Telefono1"
            value={company ? company.Telefono1 : ""}
            label="Teléfono 1"
            numericFormat
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            id="Telefono2"
            value={company ? company.Telefono2 : ""}
            label="Teléfono 2"
            numericFormat
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            id="CorreoNotificacion"
            value={company ? company.CorreoNotificacion : ""}
            label="Correo para notificaciones"
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            disabled={company ? company.RegimenSimplificado : true}
            id="UsuarioHacienda"
            value={credentials ? credentials.UsuarioHacienda : ""}
            label="Usuario ATV"
            onChange={(event) =>
              setCredentialsAttribute(event.target.id, event.target.value)
            }
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            disabled={company ? company.RegimenSimplificado : true}
            id="ClaveHacienda"
            value={credentials ? credentials.ClaveHacienda : ""}
            label="Clave ATV"
            onChange={(event) =>
              setCredentialsAttribute(event.target.id, event.target.value)
            }
          />
        </Grid>
        <Grid item xs={8} sm={9} md={10}>
          <TextField
            disabled
            id="NombreCertificado"
            value={credentials ? credentials.NombreCertificado : ""}
            label="Llave criptográfica"
            onChange={(event) =>
              setCredentialsAttribute(event.target.id, event.target.value)
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
            disabled={company ? company.RegimenSimplificado : true}
            label="Cargar"
            onClick={() => inputFile.current.click()}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            disabled={company ? company.RegimenSimplificado : true}
            id="PinCertificado"
            value={credentials ? credentials.PinCertificado : ""}
            label="Pin de llave criptográfica"
            onChange={(event) =>
              setCredentialsAttribute(event.target.id, event.target.value)
            }
          />
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Checkbox
                checked={company ? company.PrecioVentaIncluyeIVA : true}
                onChange={(event) =>
                  setCompanyAttribute(
                    "PrecioVentaIncluyeIVA",
                    !company.PrecioVentaIncluyeIVA
                  )
                }
                name="AplicaTasaDiferenciada"
                color="primary"
              />
            }
            label="IVA incluido en precio de venta"
          />
        </Grid>
        <Grid item xs={8} md={6}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">
              Seleccione la Actividad Económica
            </InputLabel>
            <Select
              id="CodigoActividad"
              value={activityCode ? activityCode : 0}
              onChange={(event) => setActivityCode(event.target.value)}
            >
              {activityItems}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={2}>
          <IconButton
            className={classes.outerButton}
            color="primary"
            disabled={activityCode === null}
            component="span"
            onClick={() => addActivity(activityCode)}
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
                  {company &&
                    company.ActividadEconomicaEmpresa.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell>{`${row.CodigoActividad} - ${row.Descripcion}`}</TableCell>
                        <TableCell>
                          <IconButton
                            className={classes.innerButton}
                            color="secondary"
                            component="span"
                            onClick={() => removeActivity(row.CodigoActividad)}
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
            onClick={() => saveCompany(certificate)}
          />
        </Grid>
        <Grid item xs={5} sm={3} md={2}>
          <Button label="Regresar" onClick={() => setActiveSection(0)} />
        </Grid>
      </Grid>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    company: state.company.company,
    credentials: state.company.credentials,
    cantonList: state.ui.cantonList,
    distritoList: state.ui.distritoList,
    barrioList: state.ui.barrioList,
    economicActivities: state.company.economicActivities,
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      setActiveSection,
      updateCantonList,
      updateDistritoList,
      updateBarrioList,
      setCompanyAttribute,
      setCredentialsAttribute,
      saveCompany,
      addActivity,
      removeActivity,
    },
    dispatch
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(CompanyPage);
