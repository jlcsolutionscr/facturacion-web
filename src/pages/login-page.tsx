import React, { ChangeEvent, useState } from "react";

import { restoreSession, userLogin } from "state/session/asyncActions";
import { readFromLocalStorage } from "utils/utilities";

import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";

import LogoImage from "assets/img/login-logo.webp";
import LoginImage from "assets/img/login-background.webp";
import LoginImageJpg from "assets/img/login-background.webp";
import { useDispatch } from "react-redux";

interface LoginPageProps {
  width: number;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

export default function LoginPage({
  isDarkMode,
  toggleDarkMode,
}: LoginPageProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [id, setId] = useState("");
  const dispatch = useDispatch();

  React.useEffect(() => {
    const session = readFromLocalStorage();
    if (session) {
      const expiredTime = Date.now();
      if (session.dateTime > expiredTime - 12 * 60 * 60 * 1000) {
        dispatch(restoreSession(session.company));
      }
    }
  }, [dispatch]);

  const handleOnChange =
    (field: string) => (event: ChangeEvent<HTMLInputElement>) => {
      if (field === "username") setUsername(event.target.value);
      if (field === "password") setPassword(event.target.value);
      if (field === "id") setId(event.target.value);
    };

  const handleLoginClick = () => {
    userLogin({ username, password, id });
  };

  const isSubmitButtonDisabled =
    username === "" || password === "" || id === "";

  return (
    <Grid
      container
      component="main"
      sx={{
        backgroundColor: "#FFF",
      }}
    >
      <Grid
        item
        xs={12}
        sm={6}
        md={4}
        sx={{
          "& .MuiTextField-root": {
            mt: 1,
          },
        }}
        component={Paper}
        elevation={6}
        square
      >
        <Box
          sx={{
            height: `${window.innerHeight}px`,
            paddingX: 5,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar
            sx={{
              marginTop: 6,
              width: "180px",
              height: "180px",
              backgroundColor: "#00729f",
              "@media screen and (max-height:568px)": {
                marginTop: 2,
              },
            }}
          >
            <img style={{ width: "80%" }} src={LogoImage} alt="not available" />
          </Avatar>
          <Box sx={{ marginTop: 4 }}>
            <form noValidate>
              <TextField
                variant="standard"
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
                variant="standard"
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
                variant="standard"
                required
                fullWidth
                name="id"
                label="Identificación"
                id="id"
                value={id}
                onChange={handleOnChange("id")}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    handleLoginClick();
                    event.preventDefault();
                  }
                }}
              />
            </form>
          </Box>
          <Box
            sx={{
              marginTop: "auto",
              marginBottom: 6,
              "@media screen and (min-height:737px)": {
                marginTop: 6,
              },
              "@media screen and (max-height:568px)": {
                marginBottom: 3,
              },
            }}
          >
            <Box mt={5}>
              <Button
                sx={{ marginBottom: "20px" }}
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
              <Grid item xs={12} sx={{ textAlign: "center" }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={isDarkMode}
                      onChange={() => toggleDarkMode()}
                      name="checkedA"
                    />
                  }
                  label="Tema oscuro"
                />
              </Grid>
              <Grid item xs={12} sx={{ marginTop: "5%", textAlign: "center" }}>
                <Link
                  onClick={(event) => event.preventDefault()}
                  variant="body2"
                >
                  Olvido su contraseña?
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Grid>
      <Grid
        item
        xs={false}
        sm={6}
        md={8}
        sx={{
          backgroundImage: `url(${LoginImageJpg})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "top",
          "& .webp": {
            backgroundImage: `url(${LoginImage})`,
          },
        }}
      />
    </Grid>
  );
}
