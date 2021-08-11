import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { makeStyles } from '@material-ui/core/styles'
import UAParser from 'ua-parser-js'

import { setActiveSection } from 'store/ui/actions'
import { generateReport, exportReport } from 'store/company/actions'

import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import Button from '@material-ui/core/Button'
import { MuiPickersUtilsProvider, DatePicker } from '@material-ui/pickers'
import DateFnsUtils from '@date-io/date-fns'

import DetailLayout from './reports/detail-layout'
import SummaryLayout from './reports/summary-layout'

const useStyles = makeStyles(theme => ({
  container: {
    backgroundColor: 'rgba(255,255,255,0.65)'
  },
  firstLayout: {
    padding: '3%'
  },
  secondLayout: {
    padding: '2%',
    overflow: 'auto',
    margin: '0 30% 0 0',
    '@media (max-width:1280px)': {
      margin: '0 16% 0 0',
    },
    '@media (max-width:600px)': {
      margin: '0 6% 0 0'
    }
  },
  errorLabel: {
    fontFamily: '"Exo 2", sans-serif',
    textAlign: 'center',
    fontSize: theme.typography.pxToRem(15),
    color: 'red',
    fontWeight: '700',
    marginBottom: '20px'
  },
  button: {
    padding: '5px 15px',
    backgroundColor: '#239BB5',
    color: 'white',
    boxShadow: '6px 6px 6px rgba(0,0,0,0.55)',
    '&:hover': {
      backgroundColor: '#29A4B4',
      boxShadow: '3px 3px 6px rgba(0,0,0,0.55)'
    }
  }
}))

function ReportsPage({
  errorMessage,
  branchList,
  reportSummary,
  reportResults,
  generateReport,
  exportReport,
  setActiveSection,
  width
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
  const [branchId, setBranchId] = React.useState(1)
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
      generateReport(branchId, reportType, startDateFormatted, endDateFormatted)
    }
    if (type === 2) exportReport(branchId, reportType, startDateFormatted, endDateFormatted)
  }
  const reportName = reportType === 1
    ? 'Reporte de documentos generados'
    : reportType === 2
      ? 'Reporte de documentos recibidos'
      : 'Reporte resumen de documentos del período'
  const branchItems = branchList.map(item => { return <MenuItem key={item.Id} value={item.Id}>{item.Descripcion}</MenuItem> })
  return (
    <div>
      <Grid container className={classes.container}>
        {errorMessage !== '' && <Typography className={classes.errorLabel} style={{fontWeight: '700'}} color='textSecondary' component='p'>
          {errorMessage}
        </Typography>}
        {viewLayout === 1 && <Grid container spacing={3} className={classes.firstLayout}>
          <Grid item xs={12} sm={12}>
            <FormControl className={classes.form}>
              <InputLabel id='demo-simple-select-label'>Seleccione la sucursal:</InputLabel>
              <Select
                id='Sucursal'
                value={branchId}
                onChange={(event) => setBranchId(event.target.value)}
              >
                {branchItems}
              </Select>
            </FormControl>
          </Grid>
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
            <Button variant='contained' className={classes.button} onClick={() => processReport(1)}>
              Generar
            </Button>
          </Grid>
          {!isMobile &&<Grid item xs={4} sm={3}>
            <Button disabled={reportType === 3} variant='contained' className={classes.button} onClick={() => processReport(2)}>
              Exportar
            </Button>
          </Grid>}
          <Grid item xs={isMobile ? 5 : 4} sm={3}>
            <Button variant='contained' className={classes.button} onClick={() => setActiveSection(0)}>
              Regresar
            </Button>
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
    branchList: state.ui.branchList,
    reportResults: state.company.reportResults,
    reportSummary: state.company.reportSummary,
    errorMessage: state.ui.errorMessage
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    setActiveSection,
    generateReport,
    exportReport
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(ReportsPage)
