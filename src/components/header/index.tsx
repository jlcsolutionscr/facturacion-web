import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { useDispatch, useSelector } from "react-redux";

import { getCompany } from "state/session/reducer";
import { userLogout } from "state/session/asyncActions";
import { DarkModeIcon, LightModeIcon, LogOutIcon } from "utils/iconsHelper";
import { useStyles } from "./styles";

interface HeaderProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

export default function Header({ isDarkMode, toggleDarkMode }: HeaderProps) {
  const { classes } = useStyles();
  const dispatch = useDispatch();
  const company = useSelector(getCompany);
  const title = company?.name ?? "";
  const companyIdentifier = company?.identifier ?? "";
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
      <div className={classes.banner} />
      <Tooltip title="Cambiar tema" aria-label="cambiar tema">
        <IconButton
          className={classes.toogle}
          aria-label="upload picture"
          component="span"
          onClick={() => toggleDarkMode()}
        >
          {isDarkMode ? (
            <DarkModeIcon className={classes.icon} />
          ) : (
            <LightModeIcon className={classes.icon} />
          )}
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
      <div className={classes.text}>
        <Typography classes={{ h2: classes.h2 }} variant="h2" component="h2">
          JLC Solutions
        </Typography>
        <Typography classes={{ h4: classes.h4 }} variant="h4" component="h4">
          Facturación Electrónica
        </Typography>
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
