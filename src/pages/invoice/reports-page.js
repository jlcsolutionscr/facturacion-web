import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { makeStyles } from '@material-ui/core/styles'
import UAParser from 'ua-parser-js'

import { setActiveSection } from 'store/ui/actions'
import { setReportResults, generateReport, exportReport } from 'store/company/actions'

import Grid from '@material-ui/core/Grid'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import { MuiPickersUtilsProvider, DatePicker } from '@material-ui/pickers'
import DateFnsUtils from '@date-io/date-fns'

import Button from 'components/button'
import DetailLayout from './reports/detail-layout'
import SummaryLayout from './reports/summary-layout'

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    margin: '0 auto auto auto',
    overflow: 'hidden'
  },
  firstLayout: {
    padding: '20px',
    '@media (max-width:960px)': {
      padding: '15px'
    },
    '@media (max-width:600px)': {
      padding: '10px'
    },
    '@media (max-width:414px)': {
      padding: '5px'
    }
  },
  secondLayout: {
    overflow: 'hidden',
    margin: 'auto',
    padding: '20px',
    '@media (max-width:960px)': {
      padding: '15px'
    },
    '@media (max-width:600px)': {
      padding: '10px'
    },
    '@media (max-width:414px)': {
      padding: '5px'
    }
  }
}))

function ReportsPage({
  width,
  reportSummary,
  reportResults,
  setReportResults,
  generateReport,
  exportReport,
  setActiveSection
}) {
  const classes = useStyles()
  const result = new UAParser().getResult()
  React.useEffect(() => {
    if (reportResults.length > 0) {
      setViewLayout(2)
    }
  }, [reportResults])
  const isMobile = !!result.device.type
  const today = new Date()
  const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate()
  const [reportType, setReportType] = React.useState(1)
  const [startDate, setStartDate] = React.useState(new Date(today.getFullYear(), today.getMonth(), 1))
  const [endDate, setEndDate] = React.useState(new Date(today.getFullYear(), today.getMonth(), lastDayOfMonth))
  const [viewLayout, setViewLayout] = React.useState(1)
  const processReport = (type) => {
    const startDay = (startDate.getDate() < 10 ? '0' : '') + startDate.getDate()
    const startMonth = ((startDate.getMonth() + 1) < 10 ? '0' : '') + (startDate.getMonth() + 1)
    const startDateFormatted = `${startDay}/${startMonth}/${startDate.getFullYear()}`
    const endDay = (endDate.getDate() < 10 ? '0' : '') + endDate.getDate()
    const endMonth = ((endDate.getMonth() + 1) < 10 ? '0' : '') + (endDate.getMonth() + 1)
    const endDateFormatted = `${endDay}/${endMonth}/${endDate.getFullYear()}`
    if (type === 1) {
      generateReport(reportType, startDateFormatted, endDateFormatted)
    }
    if (type === 2) exportReport(reportType, startDateFormatted, endDateFormatted)
  }
  const handleBackButton = () => {
    setActiveSection(0)
    setReportResults([], null)
  }
  const reportName = reportType === 1
    ? 'Reporte de documentos generados'
    : reportType === 2
      ? 'Reporte de documentos recibidos'
      : 'Reporte resumen de documentos del período'
  return (
    <div className={classes.root}>
      <Grid container>
        {viewLayout === 1 && <Grid container spacing={3} className={classes.firstLayout}>
          <Grid item xs={12} sm={12}>
            <FormControl className={classes.form}>
              <InputLabel id='demo-simple-select-label'>Seleccione el reporte:</InputLabel>
              <Select
                id='TipoReporte'
                value={reportType}
                onChange={(event) => setReportType(event.target.value)}
              >
                <MenuItem value={1}>DOCUMENTOS ELECTRONICOS EMITIDOS</MenuItem>
                <MenuItem value={2}>DOCUMENTOS ELECTRONICOS RECIBIDOS</MenuItem>
                <MenuItem value={3}>RESUMEN DE MOVIMIENTOS</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <Grid item xs={5} sm={3}>
              <DatePicker
                label='Fecha inicial'
                format='dd/MM/yyyy'
                value={startDate}
                onChange={setStartDate}
                animateYearScrolling
              />
            </Grid>
            <Grid item xs={5} sm={9}>
            <DatePicker
                label='Fecha final'
                format='dd/MM/yyyy'
                value={endDate}
                onChange={setEndDate}
                animateYearScrolling
              />
            </Grid>
          </MuiPickersUtilsProvider>
          <Grid item xs={isMobile ? 5 : 4} sm={3}>
            <Button label='Generar' onClick={() => processReport(1)} />
          </Grid>
          {!isMobile &&<Grid item xs={4} sm={3}>
            <Button disabled={reportType === 3} label='Exportar' onClick={() => processReport(2)} />
          </Grid>}
          <Grid item xs={isMobile ? 5 : 4} sm={3}>
            <Button label='Regresar' onClick={handleBackButton} />
          </Grid>
        </Grid>}
        {viewLayout === 2 && <Grid container spacing={3} className={classes.secondLayout} style={{width: `${width}px`}}>
          {reportType !== 3 && <DetailLayout
            reportName={reportName}
            summary={reportSummary}
            data={reportResults}
            returnOnClick={() => setViewLayout(1)}
          />}
          {reportType === 3 && <SummaryLayout
            reportName='Resumen de movimientos electrónicos'
            summary={reportSummary}
            data={reportResults}
            returnOnClick={() => setViewLayout(1)}
          />}
        </Grid>}
      </Grid>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    reportResults: state.company.reportResults,
    reportSummary: state.company.reportSummary
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    setActiveSection,
    setReportResults,
    generateReport,
    exportReport
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(ReportsPage)
