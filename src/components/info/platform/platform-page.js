import React from 'react'

import Typography from '@material-ui/core/Typography'
import Link from '@material-ui/core/Link'
import { createStyle } from 'components/info/styles'

function PlatformPage() {
  const classes = createStyle()
  const preventDefault = event => event.preventDefault()
  return (
    <div id='id_platform_page' className={classes.container}>
      <Typography component='h1' variant='h4' align='center' color='textPrimary' gutterBottom>
        Nuestra plataforma de servicios web
      </Typography>
      <Typography className={classes.subTitle} paragraph>
        Alojada en la nube le permite contar con almacenamiento global y resguardo de su información con respaldo periódicos semanales.
      </Typography>
      <Typography className={classes.subTitle} paragraph>
        Adicionalmente le brindamos la opción de recibir sus facturas de gastos mediante el reenvío de su correo de facturas electrónicas a nuestros buzones, nuestro sistema se encarga de realizar el envío de la información al Ministerio de Hacienda automáticamente. En caso de existir algún error en el procesamiento del correo nuestra plataforma de servicios le enviará un correo a la misma dirección de donde se envió el correo indicandole el motivo del rechazo y brindandole la posibilidad de efectuar el envío correcto nuevamente.
      </Typography>
      <Typography className={`${classes.subTitle} ${classes.enumerate}`}>
        Opción 1: Utilice nuestro buzón
        <Link href='#' onClick={preventDefault} className={classes.link}>
          recepcion@jlcsolutionscr.com
        </Link>
        para el registro de sus facturas y notas de crédito de gastos que posean impuesto de valor agregado (IVA) acreditable mensualmente.
      </Typography>
      <Typography className={`${classes.subTitle} ${classes.enumerate}`}>
        Opción 2: Utilice nuestro buzón
        <Link href='#' onClick={preventDefault} className={classes.link}>
          recepciongasto@jlcsolutionscr.com
        </Link>
        para el registro de sus facturas y notas de crédito de gastos que NO poseen impuesto de valor agregado (IVA) acreditable mensualmente, sino que dichos impuestos serán reconocidos como parte de sus gastos fiscales del período en curso.
      </Typography>
      <Typography className={classes.subTitle} paragraph>
        Además desde nuestra plataforma podrá realizar las descargas de nuestra aplicación Windows así como la configuración de los datos de su empresa requeridos para poder realizar su facturación electrónica. Vea nuestra sección 'Descargas'.
      </Typography>
    </div>
  )
}

export default PlatformPage
