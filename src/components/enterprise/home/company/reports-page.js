import React from 'react'
import Typography from '@material-ui/core/Typography'
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
    backgroundColor: 'rgba(255,255,255,0.55)'
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

function ReportsPage(props) {
  const classes = useStyles()
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
      props.generateReport(branchId, reportType, startDateFormatted, endDateFormatted)
      setViewLayout(2)
    }
    if (type === 2) props.exportReport(reportType, startDateFormatted, endDateFormatted)
  }
  const reportName = reportType === 1
    ? 'Reporte de facturas generadas'
    : reportType === 2
      ? 'Reporte de notas de crédito generadas'
      : reportType === 3
        ? 'Reporte de facturas recibidas'
        : reportType === 4
          ? 'Reporte de notas de crédito Recibidas'
          : 'Reporte resumen de movimientos del período'
  const branchList = props.branchList.map(item => { return <MenuItem key={item.Id} value={item.Id}>{item.Descripcion}</MenuItem> })
  return (
    <div className={classes.container}>
      {props.reportsPageError !== '' && <Typography className={classes.title} color='textSecondary' component='p'>
        {props.reportsPageError}
      </Typography>}
      {viewLayout === 1 && <Grid container spacing={3}>
        <Grid item xs={12} sm={12}>
          <FormControl className={classes.formControl}>
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
          <FormControl className={classes.formControl}>
            <InputLabel id='demo-simple-select-label'>Seleccione el reporte:</InputLabel>
            <Select
              id='TipoReporte'
              value={reportType}
              onChange={(event) => setReportType(event.target.value)}
            >
              <MenuItem value={1}>FACTURAS EMITIDAS</MenuItem>
              <MenuItem value={2}>NOTAS DE CREDITO EMITIDAS</MenuItem>
              <MenuItem value={3}>FACTURAS RECIBIDAS</MenuItem>
              <MenuItem value={4}>NOTAS DE CREDITO RECIBIDAS</MenuItem>
              <MenuItem value={5}>RESUMEN DE MOVIMIENTOS</MenuItem>
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
          <Button variant='contained' className={classes.button} onClick={() => processReport(1)}>
            Generar
          </Button>
        </Grid>
        <Grid item xs={2}>
          <Button disabled={reportType === 5} variant='contained' className={classes.button} onClick={() => processReport(2)}>
            Exportar
          </Button>
        </Grid>
        <Grid item xs={2}>
          <Button variant='contained' className={classes.button} onClick={() => props.setActiveHomeSection(0)}>
            Regresar
          </Button>
        </Grid>
      </Grid>}
      {viewLayout === 2 && reportType !== 5 &&<DetailLayout
        reportName={reportName}
        summary={props.reportSummary}
        data={props.reportResults}
        returnOnClick={() => setViewLayout(1)}
      />}
      {viewLayout === 2 && reportType === 5 && <SummaryLayout
        reportName='Resumen de movimientos electrónicos'
        summary={props.reportSummary}
        data={props.reportResults}
        returnOnClick={() => setViewLayout(1)}
      />}
    </div>
  )
}

export default ReportsPage
