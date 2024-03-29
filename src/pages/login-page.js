import React, { useState } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { login, restoreSession } from "store/session/actions";
import { readFromLocalStorage } from "utils/utilities";

import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Link from "@material-ui/core/Link";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";

import LogoImage from "assets/img/login-logo.webp";
import LoginImage from "assets/img/login-background.webp";
import LoginImageJpg from "assets/img/login-background.webp";

const useStyles = makeStyles(theme => ({
  root: {
    "& .MuiTextField-root": {
      marginTop: theme.spacing(1),
    },
  },
  image: {
    backgroundImage: `url(${LoginImageJpg})`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundPosition: "top",
    "& .webp": {
      backgroundImage: `url(${LoginImage})`,
    },
  },
  paper: {
    height: `${window.innerHeight}px`,
    padding: theme.spacing(0, 5),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    marginTop: theme.spacing(6),
    width: "180px",
    height: "180px",
    backgroundColor: "#00729f",
    "@media (max-height:568px)": {
      marginTop: theme.spacing(2),
    },
  },
  logoImage: {
    width: "80%",
  },
  form: {
    marginTop: theme.spacing(4),
  },
  footer: {
    marginTop: "auto",
    marginBottom: theme.spacing(6),
    "@media (min-height:737px)": {
      marginTop: theme.spacing(6),
    },
    "@media (max-height:568px)": {
      marginBottom: theme.spacing(3),
    },
  },
  logo: {
    position: "relative",
  },
  message: {
    display: "flex",
    alignItems: "center",
  },
}));

function LoginPage({ login, restoreSession, isDarkMode, toggleDarkMode }) {
  React.useEffect(() => {
    const session = readFromLocalStorage();
    if (session) {
      const expiredTime = Date.now();
      if (session.dateTime > expiredTime - 12 * 60 * 60 * 1000) {
        restoreSession(session.userName, session.company);
      }
    }
  }, [restoreSession]);
  const classes = useStyles();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [id, setId] = useState("");
  const handleOnChange = field => event => {
    if (field === "username") setUsername(event.target.value);
    if (field === "password") setPassword(event.target.value);
    if (field === "id") setId(event.target.value);
  };

  const handleLoginClick = () => {
    login(username, password, id);
  };

  const isSubmitButtonDisabled = username === "" || password === "" || id === "";
  const preventDefault = event => event.preventDefault();
  return (
    <Grid container component="main">
      <Grid item xs={12} sm={6} md={4} classes={{ root: classes.root }} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <img className={classes.logoImage} src={LogoImage} alt="not available" />
          </Avatar>
          <form className={classes.form} noValidate>
            <TextField
              required
              fullWidth
              id="username"
              label="Código usuario"
              name="username"
              value={username}
              onChange={handleOnChange("username")}
              autoFocus
            />
            <TextField
              required
              fullWidth
              name="password"
              label="Contraseña"
              type="password"
              id="password"
              value={password}
              onChange={handleOnChange("password")}
            />
            <TextField
              required
              fullWidth
              name="id"
              label="Identificación"
              id="id"
              value={id}
              onChange={handleOnChange("id")}
              onKeyPress={ev => {
                if (ev.key === "Enter") {
                  handleLoginClick();
                  ev.preventDefault();
                }
              }}
            />
          </form>
          <div className={classes.footer}>
            <Box mt={5}>
              <Button
                style={{ marginBottom: "20px" }}
                disabled={isSubmitButtonDisabled}
                variant="contained"
                color="secondary"
                fullWidth
                onClick={handleLoginClick}
              >
                Ingresar
              </Button>
            </Box>
            <Grid container>
              <Grid item xs={12} style={{ textAlign: "center" }}>
                <FormControlLabel
                  control={<Switch checked={isDarkMode} onChange={() => toggleDarkMode(!isDarkMode)} name="checkedA" />}
                  label="Tema oscuro"
                />
              </Grid>
              <Grid item xs={12} style={{ marginTop: "5%", textAlign: "center" }}>
                <Link onClick={preventDefault} variant="body2">
                  Olvido su contraseña?
                </Link>
              </Grid>
            </Grid>
          </div>
        </div>
      </Grid>
      <Grid item xs={false} sm={6} md={8} className={classes.image} />
    </Grid>
  );
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ login, restoreSession }, dispatch);
};

export default connect(null, mapDispatchToProps)(LoginPage);
