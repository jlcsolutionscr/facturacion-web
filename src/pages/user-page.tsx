import { Button, TextField } from "jlc-component-library";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "tss-react/mui";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

import { saveUserEmail } from "state/session/asyncActions";
import { getUserCode, getUserId } from "state/session/reducer";
import { setActiveSection } from "state/ui/reducer";
import { TRANSITION_ANIMATION } from "utils/constants";
import { validateEmail } from "utils/utilities";

const useStyles = makeStyles()(theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    maxWidth: "600px",
    width: "100%",
    margin: "15px auto auto",
    padding: "15px",
    transition: `background-color ${TRANSITION_ANIMATION}`,
    "@media screen and (max-width:959px)": {
      padding: "10px",
    },
    "@media screen and (max-width:599px)": {
      width: "calc(100% - 10px)",
      margin: "5px",
      padding: "0",
    },
  },
  header: {
    height: "45px",
    alignContent: "center",
  },
  content: {
    height: "auto",
    padding: "5px",
    scrollbarWidth: "thin",
  },
}));

export default function CompanyPage() {
  const { classes } = useStyles();
  const [userEmail, setUserEmail] = useState("");

  const dispatch = useDispatch();
  const userId = useSelector(getUserId);
  const userCode = useSelector(getUserCode);

  if (userId === 0) return null;

  return (
    <Box className={classes.root}>
      <Box className={classes.header}>
        <Typography variant="h6" textAlign="center" fontWeight="700" color="textPrimary">
          Usuario del sistema
        </Typography>
      </Box>
      <Box className={classes.content}>
        <Grid container spacing={{ xs: 1, sm: 2 }}>
          <Grid item xs={12}>
            <TextField id="userCode" value={userCode} label="Codigo usuario" readOnly autoComplete="off" />
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="userEmail"
              value={userEmail}
              label="Correo notificación"
              onChange={event => setUserEmail(event.target.value)}
              autoComplete="off"
            />
          </Grid>
          <Grid item xs={12}>
            <Grid container justifyContent="center" gap={1}>
              <Button
                disabled={!validateEmail(userEmail)}
                label="Actualizar"
                onClick={() => dispatch(saveUserEmail({ email: userEmail }))}
              />
              <Button label="Regresar" onClick={() => dispatch(setActiveSection(0))} />
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
