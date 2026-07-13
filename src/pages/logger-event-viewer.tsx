import { Button } from "jlc-component-library";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "tss-react/mui";
import Grid from "@mui/material/Grid";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";

import { getUserId } from "state/session/reducer";
import { setActiveSection } from "state/ui/reducer";
import { LOGGER_ENTRIES, TRANSITION_ANIMATION } from "utils/constants";
import { readyKeyFromStorage, writeKeyToStorage } from "utils/utilities";

("@mui/material/TableHead");

const useStyles = makeStyles()(theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    display: "flex",
    flexDirection: "column",
    maxWidth: "900px",
    width: "100%",
    height: "calc(100% - 20px)",
    margin: "10px auto",
    transition: `background-color ${TRANSITION_ANIMATION}`,
    "@media screen and (max-width:959px)": {
      width: "calc(100% - 20px)",
      margin: "10px",
    },
    "@media screen and (max-width:599px)": {
      width: "100%",
      margin: "0",
      height: "100%",
    },
  },
  dataContainer: {
    display: "flex",
    overflow: "hidden",
    padding: "7px 15px 15px 15px",
    "@media screen and (max-width:599px)": {
      padding: "5px 10px 10px 10px",
    },
    "@media screen and (max-width:429px)": {
      padding: "0 5px 5px 5px",
    },
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "center",
    gap: "10px",
    paddingBottom: "10px",
  },
}));

export default function LogEventViewer() {
  const { classes } = useStyles();
  const [logEntries, setLogEntries] = useState<string[]>([]);
  const userId = useSelector(getUserId);
  const dispatch = useDispatch();

  useEffect(() => {
    const logEntries: string[] = readyKeyFromStorage(LOGGER_ENTRIES) || [];
    setLogEntries(logEntries.reverse());
  }, []);

  const handleClearEntries = () => {
    writeKeyToStorage(LOGGER_ENTRIES, []);
    setLogEntries([]);
  };

  return (
    <div className={classes.root}>
      <div className={classes.dataContainer}>
        <Grid container style={{ overflowY: "auto" }}>
          <Grid item xs={12}>
            <Table size="small">
              <TableBody>
                {logEntries.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{row}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Grid>
        </Grid>
      </div>
      <div className={classes.buttonContainer}>
        <Button label="Limpiar" disabled={userId > 1} onClick={handleClearEntries} />
        <Button label="Regresar" onClick={() => dispatch(setActiveSection(0))} />
      </div>
    </div>
  );
}
