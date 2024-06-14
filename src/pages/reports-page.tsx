import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "tss-react/mui";
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";
import { lastDayOfMonth, parse } from "date-fns";
import UAParser from "ua-parser-js";

import Button from "components/button";
import DatePicker from "components/data-picker";
import ReportLayout from "components/report-layout";
import Select from "components/select";
import { exportReport, generateReport, sendReportToEmail } from "state/company/asyncActions";
import { getReportResults, getReportSummary, setReportResults } from "state/company/reducer";
import { getPermissions, getReportList } from "state/session/reducer";
import { setActiveSection, setMessage } from "state/ui/reducer";
import { TRANSITION_ANIMATION } from "utils/constants";

const useStyles = makeStyles()(theme => ({
  root: {
    overflow: "auto",
    width: "100%",
  },
  filterSection: {
    backgroundColor: theme.palette.background.paper,
    transition: `background-color ${TRANSITION_ANIMATION}`,
    overflow: "hidden",
    width: "400px",
    margin: "15px auto",
    padding: "20px 20px 20px 20px",
    "@media screen and (max-width:959px)": {
      margin: "10px auto",
      padding: "15px 15px 15px 15px",
    },
    "@media screen and (max-width:429px)": {
      width: "calc(100% - 30px)",
      margin: "0 auto",
    },
  },
  layoutSection: {
    backgroundColor: theme.palette.background.paper,
    transition: `background-color ${TRANSITION_ANIMATION}`,
    display: "flex",
    flexDirection: "column",
    maxWidth: "960px",
    width: "calc(100% - 40px)",
    margin: "15px auto 0 auto",
    padding: "20px 20px 7px 20px",
    "@media screen and (max-width:959px)": {
      width: "calc(100% - 50px)",
      margin: "10px 10px 0 10px",
      padding: "10px 15px 7px 15px",
    },
    "@media screen and (max-width:599px)": {
      width: "calc(100% - 20px)",
      margin: "0",
      padding: "10px 10px 7px 10px",
    },
    "@media screen and (max-width:429px)": {
      width: "calc(100% - 10px)",
      padding: "5px 5px 7px 5px",
    },
  },
}));

export default function ReportsPage() {
  const { classes } = useStyles();
  const dispatch = useDispatch();

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [reportId, setReportId] = useState(1);
  const [viewLayout, setViewLayout] = useState(1);

  const permissions = useSelector(getPermissions);
  const reportList = useSelector(getReportList);
  const reportResults = useSelector(getReportResults);
  const reportSummary = useSelector(getReportSummary);
  const isAccountingUser = permissions.filter(role => role.IdRole === 2).length > 0;

  useEffect(() => {
    const today = new Date();
    setStartDate(today);
    setEndDate(lastDayOfMonth(today));
    return () => {
      setViewLayout(1);
    };
  }, []);

  useEffect(() => {
    if (reportResults.length > 0) {
      setViewLayout(2);
    }
  }, [reportResults]);

  const processReport = (type: number) => {
    const startDay = (startDate.getDate() < 10 ? "0" : "") + startDate.getDate();
    const startMonth = (startDate.getMonth() + 1 < 10 ? "0" : "") + (startDate.getMonth() + 1);
    const startDateFormatted = `${startDay}/${startMonth}/${startDate.getFullYear()}`;
    const endDay = (endDate.getDate() < 10 ? "0" : "") + endDate.getDate();
    const endMonth = (endDate.getMonth() + 1 < 10 ? "0" : "") + (endDate.getMonth() + 1);
    const endDateFormatted = `${endDay}/${endMonth}/${endDate.getFullYear()}`;
    const reportLabel = reportId > 0 ? reportList.filter(item => item.IdReporte === reportId)[0].NombreReporte : "";
    if (type === 1)
      dispatch(generateReport({ reportName: reportLabel, startDate: startDateFormatted, endDate: endDateFormatted }));
    if (type === 2)
      dispatch(exportReport({ reportName: reportLabel, startDate: startDateFormatted, endDate: endDateFormatted }));
    if (type === 3) {
      const reportLabel = reportList.filter(item => item.IdReporte === reportId)[0].NombreReporte;
      if (reportLabel !== "") {
        dispatch(
          sendReportToEmail({ reportName: reportLabel, startDate: startDateFormatted, endDate: endDateFormatted })
        );
      } else {
        dispatch(setMessage({ message: "Debe seleccionar un reporte del listado disponible", messageType: "INFO" }));
      }
    }
  };

  const handleStartDateChange = (value: string) => {
    const startDate = parse(value.substring(0, 10), "yyyy-MM-dd", new Date());
    const endDate = lastDayOfMonth(startDate);
    setStartDate(startDate);
    setEndDate(endDate);
  };

  const handleBackButton = () => {
    dispatch(setActiveSection(0));
    dispatch(setReportResults({ list: [], summary: null }));
  };

  const reportItems = reportList
    .filter(item => !isAccountingUser || (isAccountingUser && [50, 51, 52].includes(item.IdReporte)))
    .map(rep => {
      return (
        <MenuItem key={rep.IdReporte} value={rep.IdReporte}>
          {rep.NombreReporte}
        </MenuItem>
      );
    });

  const result = new UAParser().getResult();
  const isMobile = !!result.device.type;
  const reportName = reportId > 0 ? reportList.filter(item => item.IdReporte === reportId)[0].NombreReporte : "";

  return (
    <div className={classes.root}>
      {viewLayout === 1 && (
        <div className={classes.filterSection}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Select
                id="tipo-reporte-select-id"
                label="Seleccione el reporte:"
                value={reportId.toString()}
                onChange={event => setReportId(parseInt(event.target.value))}
              >
                {reportItems}
              </Select>
            </Grid>
            <Grid item xs={6}>
              <DatePicker label="Fecha inicial" value={startDate} onChange={value => handleStartDateChange(value)} />
            </Grid>
            <Grid item xs={6}>
              <DatePicker
                label="Fecha final"
                value={endDate}
                onChange={value => setEndDate(parse(value.substring(0, 10), "yyyy-MM-dd", new Date()))}
              />
            </Grid>
            <Grid item xs={12} display="flex" gap={2} flexDirection="row">
              <Button
                disabled={reportId === 0}
                label={isMobile ? "Enviar correo" : "Generar"}
                onClick={() => (isMobile ? processReport(3) : processReport(1))}
              />
              {!isMobile && <Button disabled={reportId === 0} label="Exportar" onClick={() => processReport(2)} />}
              <Button label="Regresar" onClick={handleBackButton} />
            </Grid>
          </Grid>
        </div>
      )}
      {viewLayout === 2 && (
        <div className={classes.layoutSection}>
          <ReportLayout
            reportName={reportName}
            summary={reportSummary}
            data={reportResults}
            returnOnClick={() => setViewLayout(1)}
          />
        </div>
      )}
    </div>
  );
}
