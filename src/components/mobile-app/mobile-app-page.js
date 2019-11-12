import React from 'react'

import Typography from '@material-ui/core/Typography'
import { createStyle } from '../styles'

import PrimerPaso from '../../assets/img/paso1.png'
import SegundoPaso from '../../assets/img/paso2.png'
import TercerPaso from '../../assets/img/paso3.png'

function MobileAppPage() {
    const classes = createStyle('black')
  return (
    <div id='id_app_content' className={classes.root}>
      <Typography style={{textAlign: 'center', marginBottom: '2%'}} className={classes.title} color="textSecondary" component="p">
        Aplicación para móbiles Android
      </Typography>
      <Typography className={classes.subTitle} paragraph>
        Con nuestra aplicación disponible en el Android App Store usted podrá gestionar su facturación desde cualquier sitio donde se encuentre. Esta aplicación le permite actualizar su portafolio de clientes y productos totalmente en tiempo real, revisar sus facturas y documentos electrónicos emitidos y la generación de reportes con solo unos clicks usted podrá mantener actualizada su empresa y generar sus facturas en el momento en que materializa su transacción con su cliente.
      </Typography>
      <Typography className={classes.subTitle} paragraph>
        Con tres sencillos pasos puede generar su factura electrónica:
      </Typography>
      <Typography className={classes.subTitle} paragraph>
        Primer paso: Selección del cliente receptor dando click en el campo "Seleccione un cliente"
      </Typography>
      <Typography className={classes.subTitle} paragraph>
        Segundo paso: Agregue las líneas de factura dando click en el campo "Seleccione un producto", ajuste la cantidad, precio y descripción (si es requerido) y de click en el icono celeste a la par del precio que posee un signo de "+"
      </Typography>
      <Typography className={classes.subTitle} paragraph>
        Tercer paso: Verifique el resumen y genere su factura mediante un click en el botón con etiqueta "GENERAR"
      </Typography>
      <div style={{width: '100%'}}>
        <img src={PrimerPaso} style={{marginLeft: '5%', width: '25%'}} />
        <img src={SegundoPaso} style={{marginLeft: '5%', width: '25%'}} />
        <img src={TercerPaso} style={{marginLeft: '5%', width: '25%'}} />
      </div>
      <Typography style={{textAlign: 'center', marginTop: '2%'}} className={classes.subTitle} paragraph>
        En nuestra sección de "Descargas" en el menú principal encontrará manuales en formato PDF para la utilización de nuestras herramientas de facturación
      </Typography>
    </div>
  )
}

export default MobileAppPage
