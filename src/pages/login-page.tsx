import { ChangeEvent, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { makeStyles } from "tss-react/mui";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";

import LoginImage from "assets/img/login-background.webp";
import LoginImageJpg from "assets/img/login-background.webp";
import LogoImage from "assets/img/login-logo.webp";
import { restoreSession, userLogin } from "state/session/asyncActions";
import { readFromLocalStorage } from "utils/utilities";

const useStyles = makeStyles()(theme => ({
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
    "@media screen and (max-height:568px)": {
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
    "@media screen and (min-height:737px)": {
      marginTop: theme.spacing(6),
    },
    "@media screen and (max-height:568px)": {
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

interface LoginPageProps {
  width: number;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

export default function LoginPage({ isDarkMode, toggleDarkMode }: LoginPageProps) {
  const { classes } = useStyles();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [id, setId] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    const session = readFromLocalStorage();
    if (session) {
      const expiredTime = Date.now();
      if (session.dateTime > expiredTime - 12 * 60 * 60 * 1000) {
        dispatch(restoreSession(session.company));
      }
    }
  }, [dispatch]);

  const handleOnChange = (field: string) => (event: ChangeEvent<HTMLInputElement>) => {
    if (field === "username") setUsername(event.target.value);
    if (field === "password") setPassword(event.target.value);
    if (field === "id") setId(event.target.value);
  };

  const handleLoginClick = () => {
    dispatch(userLogin({ username, password, id }));
  };

  const isSubmitButtonDisabled = username === "" || password === "" || id === "";

  return (
    <Grid container component="main">
      <Grid item xs={12} sm={6} md={4} classes={{ root: classes.root }} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <img className={classes.logoImage} src={LogoImage} alt="not available" />
          </Avatar>
          <form
            className={classes.form}
            noValidate
            onSubmit={ev => {
              handleLoginClick();
              ev.preventDefault();
            }}
          >
            <TextField
              variant="standard"
              required
              fullWidth
              id="username"
              label="Código usuario"
              name="username"
              value={username}
              autoComplete="username"
              onChange={handleOnChange("username")}
              autoFocus
            />
            <TextField
              variant="standard"
              required
              fullWidth
              name="password"
              label="Contraseña"
              type="password"
              id="password"
              value={password}
              autoComplete="current-password"
              onChange={handleOnChange("password")}
            />
            <TextField
              variant="standard"
              required
              fullWidth
              name="id"
              label="Identificación"
              id="id"
              autoComplete="on"
              value={id}
              onChange={handleOnChange("id")}
            />
            <div className={classes.footer}>
              <Box mt={5}>
                <Button
                  type="submit"
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
                    control={<Switch checked={isDarkMode} onChange={() => toggleDarkMode()} name="checkedA" />}
                    label="Tema oscuro"
                  />
                </Grid>
                <Grid item xs={12} style={{ marginTop: "5%", textAlign: "center" }}>
                  <Link onClick={e => e.preventDefault()} variant="body2">
                    Olvido su contraseña?
                  </Link>
                </Grid>
              </Grid>
            </div>
          </form>
        </div>
      </Grid>
      <Grid item xs={false} sm={6} md={8} className={classes.image} />
    </Grid>
  );
}
