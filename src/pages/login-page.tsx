import { ChangeEvent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "tss-react/mui";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";

import LoginImage from "assets/img/login-background.webp";
import LoginImageJpg from "assets/img/login-background.webp";
import LogoImage from "assets/img/login-logo.webp";
import {
  authorizeUserEmail,
  requestUserPasswordResetLink,
  resetUserPassword,
  restoreSession,
  userLogin,
  validateProcessingToken,
} from "state/session/asyncActions";
import { getProcessingToken, getProcessingTokenMessage } from "state/session/reducer";
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
  dialogActions: {
    margin: "0 20px 10px 20px",
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
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [dialogStatus, setDialogStatus] = useState({ type: "request", open: false });

  const dispatch = useDispatch();
  const processingToken = useSelector(getProcessingToken);
  const processingTokenMessage = useSelector(getProcessingTokenMessage);

  useEffect(() => {
    const session = readFromLocalStorage();
    if (session) {
      const expiredTime = Date.now();
      if (session.dateTime > expiredTime - 12 * 60 * 60 * 1000) {
        dispatch(restoreSession(session.company));
      }
    } else {
      if (["/reset", "/authorize"].includes(window.location.pathname)) {
        const params = new URLSearchParams(window.location.search);
        for (const [key, value] of params.entries()) {
          if (key === "id")
            dispatch(validateProcessingToken({ type: window.location.pathname.substring(1), id: value }));
        }
      }
    }
  }, [dispatch]);

  useEffect(() => {
    if (processingToken.id !== "") setDialogStatus({ type: processingToken.type, open: true });
  }, [processingToken.id, processingToken.type]);

  useEffect(() => {
    if (processingTokenMessage !== "") setDialogStatus({ type: "alert", open: true });
  }, [processingTokenMessage]);

  const handleOnChange = (field: string) => (event: ChangeEvent<HTMLInputElement>) => {
    if (field === "username") setUsername(event.target.value);
    if (field === "password") setPassword(event.target.value);
    if (field === "id") setId(event.target.value);
    if (field === "email") setEmail(event.target.value);
    if (field === "newPassword") setNewPassword(event.target.value);
    if (field === "confirmNewPassword") setConfirmNewPassword(event.target.value);
  };

  const handleLoginClick = () => {
    dispatch(userLogin({ username, password, id }));
  };

  const handleDialogClose = () => {
    setEmail("");
    setDialogStatus(prev => ({ ...prev, open: false }));
    window.location.href = window.location.origin;
  };

  const handleDialogConfirm = () => {
    if (dialogStatus.type === "request") {
      dispatch(requestUserPasswordResetLink({ email }));
      setEmail("");
    } else if (dialogStatus.type === "reset") {
      dispatch(resetUserPassword({ id: processingToken.id, password: newPassword }));
    } else if (dialogStatus.type === "authorize") {
      dispatch(authorizeUserEmail({ id: processingToken.id }));
    } else {
      window.location.href = window.location.origin;
    }
    setDialogStatus(prev => ({ ...prev, open: false }));
  };

  const isSubmitButtonDisabled = username === "" || password === "" || id === "";

  const dialogContent = (
    <div>
      <DialogTitle>
        {dialogStatus.type === "request"
          ? "Enviar solicitud para reestablecer contraseña"
          : dialogStatus.type === "authorize"
            ? "Autorización de dirección electrónica"
            : dialogStatus.type === "reset"
              ? "Reestablecer contraseña"
              : "Proceso completado"}
      </DialogTitle>
      <DialogContent>
        {dialogStatus.type === "request" ? (
          <>
            <TextField
              variant="standard"
              required
              fullWidth
              name="email"
              label="Correo electrónico"
              id="email"
              autoComplete="on"
              value={email}
              onChange={handleOnChange("email")}
            />
          </>
        ) : dialogStatus.type === "reset" ? (
          <>
            <TextField
              variant="standard"
              required
              fullWidth
              type="password"
              name="newPassword"
              label="Nueva contraseña"
              id="newPassword"
              autoComplete="on"
              value={newPassword}
              onChange={handleOnChange("newPassword")}
            />
            <TextField
              variant="standard"
              required
              fullWidth
              type="password"
              name="confirmNewPassword"
              label="Confirme su contraseña"
              id="confirmNewPassword"
              autoComplete="on"
              value={confirmNewPassword}
              onChange={handleOnChange("confirmNewPassword")}
            />
          </>
        ) : dialogStatus.type === "authorize" ? (
          <DialogContentText>
            Desea proceder con la autorización para la dirección de correo electrónico ingresado?
          </DialogContentText>
        ) : (
          <DialogContentText>{processingTokenMessage}</DialogContentText>
        )}
      </DialogContent>
      <DialogActions className={classes.dialogActions}>
        {dialogStatus.type !== "alert" && <Button onClick={handleDialogClose}>Cancelar</Button>}
        <Button
          autoFocus
          onClick={handleDialogConfirm}
          disabled={
            dialogStatus.type === "request"
              ? email === ""
              : dialogStatus.type === "reset"
                ? newPassword === "" || confirmNewPassword === "" || newPassword !== confirmNewPassword
                : dialogStatus.type === "authorize"
                  ? false
                  : false
          }
        >
          {dialogStatus.type === "request"
            ? "Enviar"
            : dialogStatus.type === "reset"
              ? "Guardar"
              : dialogStatus.type === "authorize"
                ? "Autorizar"
                : "Cerrar"}
        </Button>
      </DialogActions>
    </div>
  );

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
                  <Link onClick={() => setDialogStatus({ type: "request", open: true })} variant="body2">
                    Olvidó su contraseña?
                  </Link>
                </Grid>
              </Grid>
            </div>
          </form>
        </div>
      </Grid>
      <Grid item xs={false} sm={6} md={8} className={classes.image} />
      <Dialog onClose={handleDialogClose} open={dialogStatus.open}>
        {dialogContent}
      </Dialog>
    </Grid>
  );
}
