import { parse } from "date-fns";
import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { makeStyles } from "tss-react/mui";
import UAParser from "ua-parser-js";
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";

import Button from "components/button";
import DatePicker from "components/data-picker";
import ReportLayout from "components/report-layout";
import Select from "components/select";
import { exportReport, generateReport, sendReportToEmail } from "state/company/asyncActions";
import { setReportResults } from "state/company/reducer";
import { setActiveSection, setMessage } from "state/ui/reducer";

const useStyles = makeStyles()(theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    overflow: "hidden",
    margin: "20px auto auto auto",
    "@media screen and (max-width:960px)": {
      marginTop: "16px",
    },
    "@media screen and (max-width:600px)": {
      marginTop: "13px",
    },
    "@media screen and (max-width:430px)": {
      marginTop: "10px",
    },
  },
  firstLayout: {
    padding: "20px",
    "@media screen and (max-width:960px)": {
      padding: "16px",
    },
    "@media screen and (max-width:600px)": {
      padding: "13px",
    },
    "@media screen and (max-width:430px)": {
      padding: "10px",
    },
  },
  secondLayout: {
    overflow: "hidden",
    margin: "auto",
    padding: "20px",
    "@media screen and (max-width:960px)": {
      padding: "16px",
    },
    "@media screen and (max-width:600px)": {
      padding: "13px",
    },
    "@media screen and (max-width:430px)": {
      padding: "10px",
    },
  },
}));

function ReportsPage({
  width,
  permissions,
  reportList,
  reportSummary,
  reportResults,
  setReportResults,
  generateReport,
  exportReport,
  sendReportToEmail,
  setMessage,
  setActiveSection,
}) {
  const { classes } = useStyles();
  const result = new UAParser().getResult();
  React.useEffect(() => {
    if (reportResults.length > 0) {
      setViewLayout(2);
    }
  }, [reportResults]);
  const isMobile = !!result.device.type;
  const isAccountingUser = permissions.filter(role => role.IdRole === 2).length > 0;
  const today = new Date();
  const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const [reportId, setReportId] = React.useState(
    reportList.length > 0 ? (!isAccountingUser ? reportList[0].IdReporte : 50) : 0
  );
  const [startDate, setStartDate] = React.useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [endDate, setEndDate] = React.useState(new Date(today.getFullYear(), today.getMonth(), lastDayOfMonth));
  const [viewLayout, setViewLayout] = React.useState(1);
  const processReport = type => {
    const startDay = (startDate.getDate() < 10 ? "0" : "") + startDate.getDate();
    const startMonth = (startDate.getMonth() + 1 < 10 ? "0" : "") + (startDate.getMonth() + 1);
    const startDateFormatted = `${startDay}/${startMonth}/${startDate.getFullYear()}`;
    const endDay = (endDate.getDate() < 10 ? "0" : "") + endDate.getDate();
    const endMonth = (endDate.getMonth() + 1 < 10 ? "0" : "") + (endDate.getMonth() + 1);
    const endDateFormatted = `${endDay}/${endMonth}/${endDate.getFullYear()}`;
    const reportLabel = reportId > 0 ? reportList.filter(item => item.IdReporte === reportId)[0].NombreReporte : "";
    if (type === 1) generateReport(reportLabel, startDateFormatted, endDateFormatted);
    if (type === 2) exportReport(reportLabel, startDateFormatted, endDateFormatted);
    if (type === 3) {
      const reportLabel = reportList.filter(item => item.IdReporte === reportId)[0].NombreReporte;
      if (reportLabel !== "") {
        sendReportToEmail(reportLabel, startDateFormatted, endDateFormatted);
      } else {
        setMessage("Debe seleccionar un reporte del listado disponible", "INFO");
      }
    }
  };
  const handleBackButton = () => {
    setActiveSection(0);
    setReportResults([], null);
  };
  const reportName = reportId > 0 ? reportList.filter(item => item.IdReporte === reportId)[0].NombreReporte : "";
  const reportItems = reportList
    .filter(item => !isAccountingUser || (isAccountingUser && [50, 51, 52].includes(item.IdReporte)))
    .map(rep => {
      return (
        <MenuItem key={rep.IdReporte} value={rep.IdReporte}>
          {rep.NombreReporte}
        </MenuItem>
      );
    });
  return (
    <div className={classes.root}>
      <Grid container>
        {viewLayout === 1 && (
          <Grid container spacing={3} className={classes.firstLayout}>
            <Grid item xs={12} sm={12}>
              <Select
                id="tipo-reporte-select-id"
                label="Seleccione el reporte:"
                value={reportId}
                onChange={event => setReportId(event.target.value)}
              >
                {reportItems}
              </Select>
            </Grid>
            <Grid item xs={5} sm={3}>
              <DatePicker
                label="Fecha inicial"
                value={startDate}
                onChange={value => setStartDate(parse(value.substring(0, 10), "yyyy-MM-dd", new Date()))}
              />
            </Grid>
            <Grid item xs={5} sm={9}>
              <DatePicker
                label="Fecha final"
                value={endDate}
                onChange={value => setEndDate(parse(value.substring(0, 10), "yyyy-MM-dd", new Date()))}
              />
            </Grid>
            <Grid item xs={isMobile ? 6 : 4} sm={3}>
              <Button
                disabled={reportId === 0}
                label={isMobile ? "Enviar correo" : "Generar"}
                onClick={() => (isMobile ? processReport(3) : processReport(1))}
              />
            </Grid>
            {!isMobile && (
              <Grid item xs={4} sm={3}>
                <Button disabled={reportId === 0} label="Exportar" onClick={() => processReport(2)} />
              </Grid>
            )}
            <Grid item xs={isMobile ? 5 : 4} sm={3}>
              <Button label="Regresar" onClick={handleBackButton} />
            </Grid>
          </Grid>
        )}
        {viewLayout === 2 && (
          <Grid container spacing={3} className={classes.secondLayout} style={{ width: `${width}px` }}>
            <ReportLayout
              reportName={reportName}
              summary={reportSummary}
              data={reportResults}
              returnOnClick={() => setViewLayout(1)}
            />
          </Grid>
        )}
      </Grid>
    </div>
  );
}

const mapStateToProps = state => {
  return {
    permissions: state.session.permissions,
    reportList: state.session.reportList,
    reportResults: state.company.reportResults,
    reportSummary: state.company.reportSummary,
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      setActiveSection,
      setMessage,
      setReportResults,
      generateReport,
      exportReport,
      sendReportToEmail,
    },
    dispatch
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(ReportsPage);
