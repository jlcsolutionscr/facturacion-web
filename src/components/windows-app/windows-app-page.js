import React from 'react'

import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import Typography from '@material-ui/core/Typography'
import { createStyle } from '../styles'

import { ExpandMoreIcon } from '../../icons/icon'
import LoginImage from '../../assets/img/windows-login.png'
import FirstSignInStepImage from '../../assets/img/windows-signin-1.png'
import SecondSignInStepImage from '../../assets/img/windows-signin-2.png'
import InvoiceImage from '../../assets/img/windows-invoice.png'
import DocumentImage from '../../assets/img/windows-documents.png'
import ReportGenerationImage from '../../assets/img/windows-reports.png'

function WindowsAppPage() {
  const classes = createStyle()
  const [expanded, setExpanded] = React.useState(false)
  const handleChange = panel => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false)
  }
  return (
    <div id='id_mobile_app_page' className={classes.root}>
      <Typography style={{textAlign: 'center', marginBottom: '2%'}} className={classes.title} color="textSecondary" component="p">
        Aplicación de escritorio para Windows
      </Typography>
      <Typography className={classes.subTitle} paragraph>
        Con nuestra aplicación disponible en nuestra sección de de Descargas podrá realizar todas sus operaciones desde la comodidad de su oficina u hogar con esta práctica y sofisticada herramienta.
      </Typography>
      <ExpansionPanel classes={{root: classes.expantionPanel}} expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
        <ExpansionPanelSummary
          classes={{expandIcon: classes.expantionIcon}}
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography className={classes.subTitle}>Registre su ordenador</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails style={{display: 'block'}}>
          <Typography className={classes.paragraph}>
            Al registrar su ordenador garantiza la seguridad de sus transacciones ya que únicamente se podrá  utilizar dicho ordenador. El registro se realiza una única vez al inicio de la instalación de la aplicación. En caso de ser requerido se puede registrar un dispositivo nuevo mediante la pantalla de registro.
          </Typography>
          <Typography className={classes.paragraph}>
            Para registrar su ordenador realice los siguientes pasos:
          </Typography>
          <Typography className={classes.paragraphList}>
            Paso 1: Ingrese el usuario y contraseña brindados por su proveedor del servicio en conjunto con el número de identificación registrado en el Ministerio de Hacienda y de click en el botón "Consultar terminales disponibles".
          </Typography>
          <Typography className={classes.paragraphList}>
            Paso 2: Seleccione la terminal de la lista y de click en el botón "Registrar".
          </Typography>
          <div style={{marginTop: '2%', width: '100%'}}>
            <img src={FirstSignInStepImage} style={{marginLeft: '10%', width: '35%'}} />
            <img src={SecondSignInStepImage} style={{marginLeft: '5%', width: '35%'}} />
          </div>
        </ExpansionPanelDetails>
      </ExpansionPanel>
      <ExpansionPanel classes={{root: classes.expantionPanel}} expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
        <ExpansionPanelSummary
          classes={{expandIcon: classes.expantionIcon}}
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography className={classes.subTitle}>Ingrese a la aplicación</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails style={{display: 'block'}}>
          <Typography className={classes.paragraph}>
            Nuestra plataforma cuenta con las mas actuales medidas de seguridad al incluir comunicación encriptada mediante protocolo HTTPS asi como certificado de confianza. Adicionalmente cuenta con un sistema de sesión mediante usuario y contraseña con expiración para garantizar que usted es quien ingresa a nuestro sistema. Una vez que proporciona los credenciales válidos podrá tener acceso al menu principal.
          </Typography>
          <div style={{marginTop: '2%', textAlign: 'center', width: '100%'}}>
            <img src={LoginImage} style={{width: '25%'}} />
          </div>
        </ExpansionPanelDetails>
      </ExpansionPanel>
      <ExpansionPanel classes={{root: classes.expantionPanel}} expanded={expanded === 'panel3'} onChange={handleChange('panel3')}>
        <ExpansionPanelSummary
          classes={{expandIcon: classes.expantionIcon}}
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography className={classes.subTitle}>Genere su factura</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails style={{display: 'block'}}>
          <Typography className={classes.paragraph}>
            Con tres sencillos pasos puede generar su factura electrónica:
          </Typography>
          <Typography className={classes.paragraphList}>
            Paso 1: Selección del cliente receptor dando click en el botón a la par del nombre del cliente.
          </Typography>
          <Typography className={classes.paragraphList}>
            Paso 2: Agregue el producto ingresando el código o mediante busqueda en el botón "Buscar" ubicado debajo del detalle de productos. Puede modificar la cantidad, descripción y precio si así lo desea y presione el botón "Insertar" debajo del detalle de productos.
          </Typography>
          <Typography className={classes.paragraphList}>
            Paso 3: Verifique los totales de la factura e ingrese la forma de pago seleccionando de la lista "Forma de pago", luego el botón "Insertar" debajo de la lista de formas de pago y proceda a guardar el documento con el botón "Guardar" en la parte superior izquierda de la pnatalla.
          </Typography>
          <div style={{marginTop: '2%', textAlign: 'center', width: '100%'}}>
            <img src={InvoiceImage} style={{width: '60%'}} />
          </div>
        </ExpansionPanelDetails>
      </ExpansionPanel>
      <ExpansionPanel classes={{root: classes.expantionPanel}} expanded={expanded === 'panel4'} onChange={handleChange('panel4')}>
        <ExpansionPanelSummary
          classes={{expandIcon: classes.expantionIcon}}
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography className={classes.subTitle}>Administre sus facturas</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails style={{display: 'block'}}>
          <Typography>
            Para visualizar su factura deberá primero buscar el registro con el botón "Buscar" ubicado en la parte superior de la pantalla, despues con doble click en la lista traerá a la pantalla principal la información de la factura. Una vez la factura en pantalla tendrá las siguientes opciones:
          </Typography>
          <Typography className={classes.paragraphList}>
            Impresión de tiquete: Presione el botón "Imprimir" ubicado en la parte superior de la pantalla, deberá tener configurada la impresora de punto de venta para que la operación se lleve a cabo con éxito.
          </Typography>
          <Typography className={classes.paragraphList}>
            Anulación: Presione el botón "Anular" ubicado en la parte superior de la pantalla, seguidamente aparecerá un dialogo de confirmación en el cual deberá dar click en "Si" si desea proceder con la anulación.
          </Typography>
          <Typography className={classes.paragraphList}>
            Generación de PDF: Presione el botón "Abrir PDF" ubicado en la parte superior de la pantalla, este proceso guardará el documento PDF de la factura electrónica en su escritorio.
          </Typography>
          <Typography className={classes.paragraphList}>
            Nueva factura: Presione el botón "Nuevo" ubicado en la parte superior de la pantalla para limpiar la información actual del formulario y poder generar un nuevo registro de facturación.
          </Typography>
          <div style={{marginTop: '2%', textAlign: 'center', width: '100%'}}>
            <img src={InvoiceImage} style={{width: '60%'}} />
          </div>
        </ExpansionPanelDetails>
      </ExpansionPanel>
      <ExpansionPanel classes={{root: classes.expantionPanel}} expanded={expanded === 'panel5'} onChange={handleChange('panel5')}>
        <ExpansionPanelSummary
          classes={{expandIcon: classes.expantionIcon}}
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography className={classes.subTitle}>Gestione sus documentos electrónicos</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails style={{display: 'block'}}>
          <Typography>
            En el menú de documentos electrónicos encontrará la opcion para visualizar la "Consulta de documentos electrónicos procesados". Una vez en la pantalla de listado de documentos procesados usted podrá:
          </Typography>
          <Typography className={classes.paragraphList}>
            Reenviar la notificación: Presione el botón "Reenviar notificación" ubicado en la parte inferior de la pantalla, Acá se le consultará si desea utilizar la dirección de correo del cliente o ingresar alguna otra dirección de correo para el reenvío del comprobante (Include PDF y archivos XML).
          </Typography>
          <Typography className={classes.paragraphList}>
            Mostrar datos XML: Presione el botón "Mostrar XML" para visualizar los datos en formato XML del documento electrónico seleccionado en la lista.
          </Typography>
          <Typography className={classes.paragraphList}>
            Mostrar respuesta de Hacienda: Presione el botón "Mostrar respuesta" para visualizar los datos en formato XML de la respuesta del Ministerio de Hacienda con respecto al envío del documento electrónico, muy útil para conocer los motivos de rechazo en caso de haber sido rechazado.
          </Typography>
          <div style={{marginTop: '2%', textAlign: 'center', width: '100%'}}>
            <img src={DocumentImage} style={{width: '60%'}} />
          </div>
        </ExpansionPanelDetails>
      </ExpansionPanel>
      <ExpansionPanel classes={{root: classes.expantionPanel}} expanded={expanded === 'panel6'} onChange={handleChange('panel6')}>
        <ExpansionPanelSummary
          classes={{expandIcon: classes.expantionIcon}}
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography className={classes.subTitle}>Envíe sus reportes a su correo</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails style={{display: 'block'}}>
          <Typography>
            En el menú "Archivo" del menu principal encontrará la opción "Reportes", al dar click en la opción del menu podrá visualizar el formulario para generar reportes del sistema.
          </Typography>
          <Typography className={classes.paragraph}>
            Para solicitar un reporte siga los siguientes pasos:
          </Typography>
          <Typography className={classes.paragraphList}>
            Paso 1: Seleccione un reporte de la lista disponible.
          </Typography>
          <Typography className={classes.paragraphList}>
            Paso 2: Seleccione el rango de fechas deseado.
          </Typography>
          <Typography className={classes.paragraphList}>
            Paso 3: Solicite la generación de su reporte con un click en el botón con etiqueta "ENVIAR REPORTE".
          </Typography>
          <Typography className={classes.paragraph}>
            Nota: Adicionalmente puede seleccionar un cliente o un proveedor para filtrar los datos basado en su selección.
          </Typography>
          <div style={{marginTop: '2%', textAlign: 'center', width: '100%'}}>
            <img src={ReportGenerationImage} style={{width: '30%'}} />
          </div>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    </div>
  )
}

export default WindowsAppPage
