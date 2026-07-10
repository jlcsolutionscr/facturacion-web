import { Button, LabelField, TextField } from "jlc-component-library";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "tss-react/mui";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";

import SplitButton from "components/options-button";
import { getCreditNoteById } from "state/invoice/asyncActions";
import { getCreditNote } from "state/invoice/reducer";
import { setActiveSection, setMessage } from "state/ui/reducer";
import { TRANSITION_ANIMATION } from "utils/constants";
import { AddCircleIcon, RemoveCircleIcon, SearchIcon } from "utils/iconsHelper";
import { formatCurrency } from "utils/utilities";

const useStyles = makeStyles()(theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    overflow: "auto",
    maxWidth: "900px",
    margin: "10px auto",
    transition: `background-color ${TRANSITION_ANIMATION}`,
    "@media screen and (max-width:959px)": {
      margin: "10px",
    },
    "@media screen and (max-width:599px)": {
      margin: "0",
    },
    "@media screen and (max-width:429px)": {
      margin: "0",
    },
  },
  header: {
    height: "45px",
    alignContent: "center",
  },
  content: {
    overflowY: "scroll",
    height: "calc(100% - 105px)",
    padding: "5px",
    scrollbarWidth: "thin",
  },
  footer: {
    display: "flex",
    height: "50px",
    alignItems: "center",
  },
  container: {
    padding: "20px",
    "@media screen and (max-width:959px)": {
      padding: "15px",
    },
    "@media screen and (max-width:599px)": {
      padding: "10px",
    },
    "@media screen and (max-width:429px)": {
      padding: "5px",
    },
  },
  summaryTitle: {
    marginTop: "0",
    fontWeight: "700",
    textAlign: "center",
    color: theme.palette.text.primary,
  },
  bottom: {
    display: "flex",
    overflow: "auto",
    width: "100%",
  },
  outerButton: {
    padding: "8px",
  },
  innerButton: {
    padding: "0px",
  },
  icon: {
    padding: "7px",
  },
}));

type DetailItem = {
  creditNoteId: number;
  type: number;
  amount: number;
};

const options = ["Efectivo", "Transferencia"];

export default function CustomerCreditNote() {
  const { classes } = useStyles();
  const [creditNoteId, setCreditNoteId] = useState("");
  const [type, setType] = useState(0);
  const [detailList, setDetailList] = useState<DetailItem[]>([]);
  const [amount, setAmount] = useState("");
  const [total, setTotal] = useState(0);
  const dispatch = useDispatch();

  const creditNote = useSelector(getCreditNote);

  useEffect(() => {
    setAmount(creditNote.balance.toString());
    setTotal(0);
  }, [creditNote]);

  const addDetails = () => {
    const decAmount = parseFloat(amount);
    if (decAmount > creditNote.balance - total) {
      dispatch(
        setMessage({ message: "El monto ingresado es superior al saldo pendiente por liquidar!", messageType: "INFO" })
      );
    } else {
      const newDetailList = [
        ...detailList,
        { creditNoteId: creditNote.creditNoteId, type, amount: parseFloat(amount) },
      ];
      setDetailList(newDetailList);
      setType(0);
      setAmount("");
      setTotal(total + decAmount);
    }
  };

  const removeDetails = (pos: number) => {
    const index = detailList.findIndex((_item, index) => index === pos);
    const newDetailList = [...detailList.slice(0, index), ...detailList.slice(index + 1)];
    setTotal(total - detailList[index].amount);
    setDetailList(newDetailList);
  };

  return (
    <div className={classes.root}>
      <Box className={classes.header}>
        <Typography variant="h6" textAlign="center" fontWeight="700" color="textPrimary">
          Liquidación de Nota de crédito
        </Typography>
      </Box>
      <Box className={classes.content}>
        <Grid container spacing={2} justifyContent="center">
          <Grid item container xs={12}>
            <Grid item xs={2}>
              <TextField
                label="Nota crédito"
                value={creditNoteId}
                numericFormat
                onChange={event => setCreditNoteId(event.target.value)}
              />
            </Grid>
            <Grid item xs={2} md={1}>
              <button
                type="submit"
                onClick={() => dispatch(getCreditNoteById({ id: parseInt(creditNoteId) }))}
                style={{
                  backgroundColor: "transparent",
                  border: "none",
                  margin: "0",
                  padding: "0",
                  width: "auto",
                  height: "auto",
                }}
              >
                <IconButton
                  className={classes.outerButton}
                  color="primary"
                  disabled={creditNoteId === ""}
                  component="span"
                >
                  <SearchIcon />
                </IconButton>
              </button>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Typography className={classes.summaryTitle} textAlign="center">
              <span>DETALLES DE LA NOTA DE CREDITO</span>
            </Typography>
          </Grid>
          <Grid item xs={12} md={8}>
            <LabelField label="Detalles" value={creditNote.details} />
          </Grid>
          <Grid item xs={6} md={2}>
            <LabelField label="Monto Original" value={formatCurrency(creditNote.totalAmount, 2)} />
          </Grid>
          <Grid item xs={6} md={2}>
            <LabelField label="Saldo" value={formatCurrency(creditNote.balance, 2)} />
          </Grid>
          <Grid item xs={12} sm={10} container spacing={2} alignItems="center">
            <Grid item xs={12} md={5}>
              <Typography>Seleccione el medio de liquidación:</Typography>
            </Grid>
            <Grid item xs={6} md={4}>
              <SplitButton selected={type} options={options} setOption={index => setType(index)} />
            </Grid>
            <Grid item xs={4} md={2}>
              <TextField label="Monto" value={amount} numericFormat onChange={event => setAmount(event.target.value)} />
            </Grid>
            <Grid item xs={2} md={1}>
              <button
                type="submit"
                style={{
                  backgroundColor: "transparent",
                  border: "none",
                  margin: "0",
                  padding: "0",
                  width: "auto",
                  height: "auto",
                }}
              >
                <IconButton
                  className={classes.outerButton}
                  color="primary"
                  disabled={amount === "" || detailList.some(det => det.type === type) || total === creditNote.balance}
                  onClick={addDetails}
                  component="span"
                >
                  <AddCircleIcon />
                </IconButton>
              </button>
            </Grid>
          </Grid>
          <Grid item container style={{ overflowY: "auto" }}>
            <Grid item xs={12}>
              <Typography className={classes.summaryTitle} textAlign="center">
                <span>DETALLE DE LA LIQUIDACION</span>
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell align="right">Tipo</TableCell>
                    <TableCell align="right">Total</TableCell>
                    <TableCell align="right"> - </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {detailList.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>{row.type === 0 ? "Efectivo" : "Transferencia"}</TableCell>
                      <TableCell align="right">{formatCurrency(row.amount, 2)}</TableCell>
                      <TableCell align="right">
                        <IconButton
                          className={classes.innerButton}
                          color="secondary"
                          component="span"
                          onClick={() => removeDetails(index)}
                        >
                          <RemoveCircleIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Grid>
          </Grid>
        </Grid>
      </Box>
      <Box className={classes.footer}>
        <Grid container justifyContent="center" gap={1}>
          <Button disabled={detailList.length === 0} label="Guardar" onClick={() => alert("Trying to save")} />
          <Button label="Regresar" onClick={() => dispatch(setActiveSection(0))} />
        </Grid>
      </Box>
    </div>
  );
}
