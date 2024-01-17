import React from "react";
import { useDispatch } from "react-redux";
import { makeStyles } from "tss-react/mui";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";

import Button from "components/button";
import { saveLogo } from "state/company/asyncActions";
import { setActiveSection } from "state/ui/reducer";

const useStyles = makeStyles()(theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    overflowY: "hidden",
    margin: "20px 15% auto 15%",
    padding: "20px",
    "@media screen and (max-width:960px)": {
      margin: "16px 10% auto 10%",
      padding: "16px",
    },
    "@media screen and (max-width:600px)": {
      margin: "13px 5% auto 5%",
      padding: "13px",
    },
    "@media screen and (max-width:414px)": {
      margin: "10px 10px auto 10px",
      padding: "10px",
    },
  },
  errorLabel: {
    fontFamily: '"Exo 2", sans-serif',
    textAlign: "center",
    fontSize: theme.typography.pxToRem(15),
    color: "red",
    fontWeight: "700",
    marginBottom: "20px",
  },
  imagePreview: {
    borderRadius: theme.shape.borderRadius,
    border: "1px solid rgba(0, 0, 0, 0.23)",
    height: "160px",
    width: "350px",
  },
}));

export default function LogoPage() {
  const dispatch = useDispatch();
  const { classes } = useStyles();
  const [logo, setLogo] = React.useState("");
  const [filename, setFilename] = React.useState("");
  const inputFile = React.useRef<HTMLInputElement>(null);
  const handleImageChange = (event: React.SyntheticEvent) => {
    event.preventDefault();
    const reader = new FileReader();
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      reader.onloadend = () => {
        if (reader.result) {
          setLogo(reader.result.toString());
          setFilename(file.name);
        }
      };
      reader.readAsDataURL(file);
    }
  };
  const handleSaveButton = () => {
    const logoBase64 = logo.substring(logo.indexOf(",") + 1);
    dispatch(saveLogo({ logo: logoBase64 }));
  };
  const imagePreview =
    logo !== "" ? (
      <img style={{ height: "100%", width: "100%", border: "none" }} src={logo} alt="Seleccione un archivo" />
    ) : (
      <div style={{ height: "100%", width: "100%", border: "none" }} />
    );
  return (
    <div className={classes.root}>
      <Grid container spacing={2}>
        <Grid item xs={6} sm={8}>
          <TextField fullWidth disabled={true} value={filename} id="Logotipo" />
        </Grid>
        <Grid item xs={2} sm={2}>
          <input
            accept="png/*"
            style={{ display: "none" }}
            id="contained-button-file"
            ref={inputFile}
            multiple
            type="file"
            onChange={handleImageChange}
          />
          <Button style={{ marginTop: "11px" }} label="Seleccionar" onClick={() => inputFile.current?.click()} />
        </Grid>
        <Grid item xs={12} sm={12}>
          <div className={classes.imagePreview}>{imagePreview}</div>
        </Grid>
        <Grid item xs={5} sm={3}>
          <Button disabled={logo === ""} label="Actualizar" onClick={() => handleSaveButton()} />
        </Grid>
        <Grid item xs={5} sm={3}>
          <Button label="Regresar" onClick={() => dispatch(setActiveSection(0))} />
        </Grid>
      </Grid>
    </div>
  );
}
