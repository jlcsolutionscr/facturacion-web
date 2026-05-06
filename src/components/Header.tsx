import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "tss-react/mui";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

import LogoDarkImage from "assets/img/company-logo-dark.webp";
import { userLogout } from "state/session/asyncActions";
import { getCompany, getPermissions, getUserId } from "state/session/reducer";
import { setActiveSection } from "state/ui/reducer";
import { TRANSITION_ANIMATION } from "utils/constants";
import { CashCloseIcon, DarkModeIcon, LightModeIcon, LogOutIcon, PrinterIcon } from "utils/iconsHelper";

const useStyles = makeStyles()(theme => ({
  header: {
    backgroundImage: "linear-gradient(to bottom, rgba(8, 65, 92, 0.6), rgba(8, 65, 92, 0.9), rgba(8, 65, 92, 1))",
    height: "100px",
  },
  printerConfig: {
    position: "absolute",
    top: "10px",
    right: "8px",
    zIndex: 2,
  },
  cashClose: {
    position: "absolute",
    top: "59px",
    right: "96px",
    zIndex: 2,
  },
  printerIcon: {
    color: "#fff",
  },
  toogle: {
    position: "absolute",
    top: "59px",
    right: "52px",
    zIndex: 2,
  },
  logout: {
    position: "absolute",
    top: "59px",
    right: "8px",
    zIndex: 2,
  },
  poweredBy: {
    display: "none",
    justifyContent: "space-between",
    alignItems: "center",
    position: "fixed",
    marginLeft: "10px",
    width: "240px",
    height: "100px",
    "@media screen and (min-width:900px)": {
      display: "flex",
    },
  },
  banner: {
    display: "none",
    backgroundImage: `url(${LogoDarkImage})`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "75px 75px",
    left: "10px",
    height: "75px",
    top: "5px",
    width: "75px",
    "@media screen and (min-width:900px)": {
      display: "flex",
    },
  },
  poweredByText: {
    display: "flex",
    flexDirection: "column",
  },
  h2: {
    color: theme.palette.mode === "dark" ? "#333" : "#08415c",
    fontFamily: "Russo One",
    fontStyle: "italic",
    fontSize: theme.typography.pxToRem(20),
    textShadow: "1px 1px 3px #FFF",
    transition: `color ${TRANSITION_ANIMATION}`,
  },
  h4: {
    marginTop: "8px",
    color: "#E2EBF1",
    fontFamily: "Russo One",
    fontStyle: "italic",
    fontSize: theme.typography.pxToRem(13),
    textShadow: "2px 2px 3px rgba(0,0,0,0.85)",
  },
  title: {
    display: "flex",
    flexDirection: "column",
    height: "100px",
    margin: "0 auto",
    justifyContent: "center",
    alignContent: "end",
    "@media screen and (min-width:900px)": {
      maxWidth: "450px",
    },
    "@media screen and (min-width:1040px)": {
      maxWidth: "600px",
    },
  },
  companyText: {
    color: "rgba(255,255,255,0.85)",
    fontFamily: "'Exo 2', sans-serif",
    fontSize: theme.typography.pxToRem(20),
    fontStyle: "italic",
    fontWeight: 600,
    textShadow: "4px 4px 6px rgba(0,0,0,0.45)",
    marginBottom: 0,
    "@media screen and (min-width:600px)": {
      fontSize: theme.typography.pxToRem(23),
    },
  },
  icon: {
    color: "#FFF",
  },
}));

interface HeaderProps {
  setIsCashCloseDialogOpen: (value: boolean) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

export default function Header({ setIsCashCloseDialogOpen, isDarkMode, toggleDarkMode }: HeaderProps) {
  const { classes } = useStyles();
  const dispatch = useDispatch();
  const company = useSelector(getCompany);
  const userId = useSelector(getUserId);
  const permissions = useSelector(getPermissions);

  const isCashCloseEnabled = permissions.filter(role => role.IdRole === 53).length > 0;

  const title = company?.NombreComercial ?? "";
  const companyIdentifier = company?.Identificacion ?? "";
  const identification =
    companyIdentifier.length === 9
      ? companyIdentifier.substring(0, 1) +
        "-" +
        companyIdentifier.substring(1, 5) +
        "-" +
        companyIdentifier.substring(5)
      : companyIdentifier.length === 10
        ? companyIdentifier.substring(0, 1) +
          "-" +
          companyIdentifier.substring(1, 4) +
          "-" +
          companyIdentifier.substring(4)
        : companyIdentifier;

  return (
    <div className={classes.header}>
      {userId === 1 && (
        <Tooltip title="Configuración de servidor de impresión" aria-label="configuración del servidor de impresión">
          <IconButton
            className={classes.printerConfig}
            aria-label="upload picture"
            component="span"
            onClick={() => dispatch(setActiveSection(21))}
          >
            <PrinterIcon className={classes.printerIcon} />
          </IconButton>
        </Tooltip>
      )}
      {isCashCloseEnabled && (
        <Tooltip title="Procesar el cierre de efectivo" aria-label="Procesar el cierre de efectivo">
          <IconButton
            className={classes.cashClose}
            aria-label="Procesar el cierre de efectivo"
            component="span"
            onClick={() => setIsCashCloseDialogOpen(true)}
          >
            <CashCloseIcon className={classes.icon} />
          </IconButton>
        </Tooltip>
      )}
      <Tooltip title="Cambiar tema" aria-label="cambiar tema">
        <IconButton
          className={classes.toogle}
          aria-label="upload picture"
          component="span"
          onClick={() => toggleDarkMode()}
        >
          {isDarkMode ? <DarkModeIcon className={classes.icon} /> : <LightModeIcon className={classes.icon} />}
        </IconButton>
      </Tooltip>
      <Tooltip title="Cerrar sessión" aria-label="cerrar sessión">
        <IconButton
          className={classes.logout}
          aria-label="upload picture"
          component="span"
          onClick={() => dispatch(userLogout())}
        >
          <LogOutIcon className={classes.icon} />
        </IconButton>
      </Tooltip>
      <div className={classes.poweredBy}>
        <div className={classes.banner} />
        <div className={classes.poweredByText}>
          <Typography classes={{ h2: classes.h2 }} variant="h2" component="h2">
            JLC Solutions
          </Typography>
          <Typography classes={{ h4: classes.h4 }} variant="h4" component="h4">
            Facturación Electrónica
          </Typography>
        </div>
      </div>
      <div className={classes.title}>
        <Typography className={classes.companyText} align="center" paragraph>
          {title}
        </Typography>
        <Typography className={classes.companyText} align="center" paragraph>
          {identification}
        </Typography>
      </div>
    </div>
  );
}
