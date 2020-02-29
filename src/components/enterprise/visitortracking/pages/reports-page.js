import React from 'react'
import Grid from '@material-ui/core/Grid'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import Button from '@material-ui/core/Button'
import { MuiPickersUtilsProvider, DatePicker } from '@material-ui/pickers'
import DateFnsUtils from '@date-io/date-fns'
import DetailLayout from './reports/detail-layout'
import SummaryLayout from './reports/summary-layout'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  container: {
    flexGrow: 1,
    borderRadius: '8px',
    overflowY: 'auto',
    marginLeft: '150px',
    marginRight: '150px',
    padding: '25px',
    maxHeight: `${window.innerHeight - 302}px`,
    backgroundColor: 'rgba(255,255,255,0.65)'
  },
  form: {
    width: '40%',
    minWidth: '350px',
    marginTop: theme.spacing(1)
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

function ReportsPage(props) {
  const classes = useStyles()
  const today = new Date()
  const [branchId, setBranchId] = React.useState(1)
  const [reportType, setReportType] = React.useState(1)
  const [startDate, setStartDate] = React.useState(today)
  const [endDate, setEndDate] = React.useState(today)
  const [viewLayout, setViewLayout] = React.useState(1)
  const processReport = () => {
    const startDay = (startDate.getDate() < 10 ? '0' : '') + startDate.getDate()
    const startMonth = ((startDate.getMonth() + 1) < 10 ? '0' : '') + (startDate.getMonth() + 1)
    const startDateFormatted = `${startDay}/${startMonth}/${startDate.getFullYear()}`
    const endDay = (endDate.getDate() < 10 ? '0' : '') + endDate.getDate()
    const endMonth = ((endDate.getMonth() + 1) < 10 ? '0' : '') + (endDate.getMonth() + 1)
    const endDateFormatted = `${endDay}/${endMonth}/${endDate.getFullYear()}`
    props.generateReport(branchId, reportType, startDateFormatted, endDateFormatted)
    setViewLayout(2)
  }
  const reportName = reportType === 1
    ? 'Registro de visitas recibidas'
    : 'Resumen de visitas por empleado'
  const branchList = props.branchList.map(item => { return <MenuItem key={item.Id} value={item.Id}>{item.Description}</MenuItem> })
  return (
    <div className={classes.container}>
      {viewLayout === 1 && <Grid container spacing={3}>
        <Grid item xs={12} sm={12}>
          <FormControl className={classes.form}>
            <InputLabel id='demo-simple-select-label'>Seleccione la sucursal:</InputLabel>
            <Select
              id='Sucursal'
              value={branchId}
              onChange={(event) => setBranchId(event.target.value)}
            >
              {branchList}
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
              <MenuItem value={1}>DETALLE DE VISITAS RECIBIDAS</MenuItem>
              <MenuItem value={2}>RESUMEN DE VISITAS POR EMPLEADO</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <Grid item xs={3} sm={3}>
            <DatePicker
              label='Fecha inicial'
              format='dd/MM/yyyy'
              value={startDate}
              onChange={setStartDate}
              animateYearScrolling
            />
          </Grid>
          <Grid item xs={9} sm={9}>
          <DatePicker
              label='Fecha final'
              format='dd/MM/yyyy'
              value={endDate}
              onChange={setEndDate}
              animateYearScrolling
            />
          </Grid>
        </MuiPickersUtilsProvider>
        <Grid item xs={2}>
          <Button variant='contained' className={classes.button} onClick={() => processReport()}>
            Generar
          </Button>
        </Grid>
        <Grid item xs={2}>
          <Button variant='contained' className={classes.button} onClick={() => props.setActiveSection(0)}>
            Regresar
          </Button>
        </Grid>
      </Grid>}
      {viewLayout === 2 && reportType === 1 &&<DetailLayout
        reportName={reportName}
        summary={props.reportSummary}
        data={props.reportResults}
        returnOnClick={() => setViewLayout(1)}
      />}
      {viewLayout === 2 && reportType === 2 && <SummaryLayout
        reportName={reportName}
        summary={props.reportSummary}
        data={props.reportResults}
        returnOnClick={() => setViewLayout(1)}
      />}
    </div>
  )
}

export default ReportsPage
