import { ReactNode } from "react";
import { useDispatch, useSelector } from "react-redux";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Box from "@mui/material/Box";

import LogoDarkImage from "assets/img/company-logo-dark.webp";
import { userLogout } from "state/session/asyncActions";
import { getCompany } from "state/session/reducer";
import { DarkModeIcon, LightModeIcon, LogOutIcon } from "utils/iconsHelper";

const GRADIENT_MIN = "rgba(51, 51, 51, 0.6)";
const GRADIENT_MID = "rgba(51, 51, 51, 0.9)";
const GRADIENT_MAX = "rgba(51, 51, 51, 1)";

interface HeaderProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const TextLabel = ({ children }: { children: ReactNode }) => (
  <Typography
    sx={{
      color: "rgba(255,255,255,0.85)",
      fontFamily: "'Exo 2', sans-serif",
      fontSize: "25px",
      fontStyle: "italic",
      fontWeight: 600,
      textShadow: "4px 4px 6px rgba(0,0,0,0.45)",
      marginBottom: 0,
      "@media screen and (max-width:600px)": {
        fontSize: "23px",
      },
      "@media screen and (max-width:414px)": {
        fontSize: "20px",
      },
    }}
    align="center"
    paragraph
  >
    {children}
  </Typography>
);

function Header({ isDarkMode, toggleDarkMode }: HeaderProps) {
  const dispatch = useDispatch();
  const company = useSelector(getCompany);

  const title = company?.name;
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
    <Box
      sx={{
        backgroundImage: `linear-gradient(to bottom, ${GRADIENT_MIN}, ${GRADIENT_MID}, ${GRADIENT_MAX})`,
        flex: "0 1 auto",
        paddingTop: "0",
        paddingBottom: "10px",
        "@media screen and (max-width:960px)": {
          paddingBottom: "0",
        },
        "@media screen and (max-width:600px)": {
          paddingBottom: "10px",
        },
      }}
    >
      <Box
        sx={{
          backgroundImage: `url(${LogoDarkImage})`,
          backgroundRepeat: "no-repeat",
          position: "absolute",
          backgroundSize: "105px 105px",
          backgroundPosition: "10px 0",
          top: "10px",
          left: "0",
          height: "105px",
          width: "100%",
          "@media screen and (max-width: 600px)": {
            backgroundSize: "95px 95px",
            height: "95px",
          },
          "@media screen and (max-width: 414px)": {
            backgroundSize: "75px 75px",
            height: "75px",
          },
        }}
      />
      <Tooltip title="Cambiar tema" aria-label="cambiar tema">
        <IconButton
          sx={{
            position: "absolute",
            top: "78px",
            right: "52px",
            zIndex: 2,
            "@media screen and (max-width: 960px)": {
              top: "120px",
            },
            "@media screen and (max-width: 600px)": {
              top: "101px",
            },
            "@media screen and (max-width: 414px)": {
              top: "89px",
            },
          }}
          aria-label="upload picture"
          component="span"
          onClick={() => toggleDarkMode()}
        >
          {isDarkMode ? (
            <DarkModeIcon sx={{ color: "#FFF" }} />
          ) : (
            <LightModeIcon sx={{ color: "#FFF" }} />
          )}
        </IconButton>
      </Tooltip>
      <Tooltip title="Cerrar sessión" aria-label="cerrar sessión">
        <IconButton
          sx={{
            position: "absolute",
            top: "78px",
            right: "8px",
            zIndex: 2,
            "@media screen and (max-width:960px)": {
              top: "120px",
            },
            "@media screen and (max-width:600px)": {
              top: "101px",
            },
            "@media screen and (max-width:414px)": {
              top: "89px",
            },
          }}
          aria-label="upload picture"
          component="span"
          onClick={() => dispatch(userLogout())}
        >
          <LogOutIcon sx={{ color: "#FFF" }} />
        </IconButton>
      </Tooltip>
      <Box
        sx={{
          textAlign: "left",
          margin: "30px 0 40px 120px",
          "@media screen and (max-width:960px)": {
            margin: "30px 0 0 120px",
          },
          "@media screen and (max-width:600px)": {
            margin: "30px 0 0 110px",
          },
          "@media screen and (max-width:414px)": {
            margin: "20px 0 10px 90px",
          },
        }}
      >
        <Typography
          sx={{
            color: "#333",
            fontFamily: "RussoOne",
            fontStyle: "italic",
            fontSize: "25px",
            textShadow: "1px 1px 3px #FFF",
            "@media screen and (max-width:600px)": {
              fontSize: "22px",
            },
            "@media screen and (max-width:414px)": {
              fontSize: "20px",
            },
          }}
          variant="h2"
          component="h2"
        >
          JLC Solutions
        </Typography>
        <Typography
          sx={{
            marginTop: "8px",
            color: "#E2EBF1",
            fontFamily: "RussoOne",
            fontStyle: "italic",
            fontSize: "17px",
            textShadow: "2px 2px 3px rgba(0,0,0,0.85)",
            "@media screen and (max-width:600px)": {
              fontSize: "15px",
            },
            "@media screen and (max-width:414px)": {
              fontSize: "13px",
            },
          }}
          variant="h4"
          component="h4"
        >
          Facturación Electrónica
        </Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          position: "absolute",
          textAlign: "center",
          width: "100%",
          top: "40px",
          "@media screen and (max-width:960px)": {
            position: "relative",
            top: "0px",
          },
        }}
      >
        <TextLabel>{title}</TextLabel>
        <TextLabel>{identification}</TextLabel>
      </Box>
    </Box>
  );
}

export default Header;
