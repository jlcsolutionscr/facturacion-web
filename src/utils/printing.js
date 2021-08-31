import { Printer, Style, Align, Model, WebUSB } from 'escpos-buffer'
import { formatCurrency } from 'utils/utilities'

function splitLines(text, lineWidth) {
  const words = text.split(" ")
  const results = []
  let row = ''
  words.forEach(word => {
    if (row.length + word.length > lineWidth - 17) {
      results.push(row)
      row = word
    } else {
      row += row.length > 0 ? " " + word : word
    }
  })
  results.push(row)
  return results
}

function createTicket(userCode, company, invoice, branchName, lineWidth) {
  const lines = []
  lines.push({
    text: invoice.Fecha.padEnd(lineWidth-(userCode.length + 17), " ") + userCode,
    align: Align.Center
  })
  lines.push({
    text: 'TIQUETE DE FACTURA',
    style: Style.DoubleWidth | Style.Bold,
    align: Align.Center
  })
  lines.push({text: ''})
  lines.push({
    text: company.NombreComercial,
    style: Style.Bold,
    align: Align.Center
  })
  const locations = splitLines(company.Direccion, lineWidth)
  locations.forEach(line => {
    lines.push({
      text: line,
      align: Align.Center
    })
  })
  lines.push({
    text: company.Telefono1,
    align: Align.Center
  })
  lines.push({
    text: company.NombreEmpresa,
    style: Style.Bold,
    align: Align.Center
  })
  lines.push({
    text: company.Identificacion,
    style: Style.Bold,
    align: Align.Center
  })
  lines.push({
    text: company.CorreoNotificacion,
    align: Align.Center
  })
  lines.push({text: ''})
  if (invoice.IdDocElectronico) {
    lines.push({
      text: invoice.Cliente.IdCliente === 1 ? 'TIQUETE ELECTRONICO' : 'FACTURA ELECTRONICA',
      style: Style.Bold,
      align: Align.Center
    })
    lines.push({
      text: invoice.IdDocElectronico.substring(0, 25),
      align: Align.Center
    })
    lines.push({
      text: invoice.IdDocElectronico.substring(0, 25),
      align: Align.Center
    })
  }
  lines.push({
    text: branchName,
    style: Style.Bold,
    align: Align.Center
  })
  lines.push({
    text: 'Factura nro.: ' + invoice.ConsecFactura,
    style: Style.Bold,
    align: Align.Center
  })
  lines.push({
    text: 'Fecha: ' + invoice.Fecha,
    align: Align.Center
  })
  lines.push({
    text: 'Cliente: ' + invoice.Cliente.Nombre,
    align: Align.Center
  })
  if (invoice.Cliente.Telefono.length > 0) {
    lines.push({
      text: 'Teléfono: ' + invoice.Cliente.Telefono,
      align: Align.Center
    })
  }
  lines.push({text: ''})
  lines.push({
    text: 'Formas de pago',
    style: Style.Bold,
    align: Align.Center
  })
  let padLength = 0
  invoice.DesglosePagoFactura.forEach(row => {
    const amount = formatCurrency(row.MontoLocal)
    padLength = lineWidth - 17 - (row.FormaPago.Descripcion.length + amount.length)
    lines.push({
      text: row.FormaPago.Descripcion.padEnd(padLength, " ") + amount,
      align: Align.Center
    })
  })
  lines.push({text: ''})
  lines.push({
    text: 'DETALLE DE FACTURA',
    style: Style.Bold,
    align: Align.Center
  })
  lines.push({
    text: 'DESCRIPCION',
    style: Style.Bold,
    align: Align.Left
  })
  padLength = (lineWidth - 28) / 2
  lines.push({
    text: 'CANT'.padEnd(8, " ") + 'PRECIO/U'.padStart(padLength, " ") + 'TOTAL'.padStart(padLength, " ") + ' GR',
    style: Style.Bold,
    align: Align.Left
  })
  invoice.DetalleFactura.forEach(row => {
    lines.push({
      text: row.Descripcion,
      align: Align.Left
    })
    const unitPrice = formatCurrency(row.PrecioVenta)
    const total = formatCurrency(row.Cantidad * row.PrecioVenta)
    padLength = (lineWidth - 28) / 2
    lines.push({
      text: row.Cantidad.toString().padEnd(8, " ") + unitPrice.padStart(padLength, " ") + total.padStart(padLength, " ") + (row.Excento ? '  E' : '  G'),
      align: Align.Left
    })
  })
  lines.push({text: ''})
  let amount = formatCurrency(invoice.Total - invoice.Impuesto)
  lines.push({
    text: 'Sub-total'.padEnd(10, " ") + amount.padStart(20, " "),
    align: Align.Right
  })
  lines.push({
    text: 'Descuento'.padEnd(10, " ") + '0.00'.padStart(20, " "),
    align: Align.Right
  })
  amount = formatCurrency(invoice.Impuesto)
  lines.push({
    text: 'Impuesto'.padEnd(10, " ") + amount.padStart(20, " "),
    align: Align.Right
  })
  amount = formatCurrency(invoice.Total)
  lines.push({
    text: 'Total'.padEnd(10, " ") + amount.padStart(20, " "),
    align: Align.Right
  })
  amount = formatCurrency(invoice.MontoPagado)
  lines.push({
    text: 'Pago con'.padEnd(10, " ") + amount.padStart(20, " "),
    align: Align.Right
  })
  amount = formatCurrency(invoice.MontoPagado - invoice.Total)
  lines.push({
    text: 'Cambio'.padEnd(10, " ") + amount.padStart(20, " "),
    align: Align.Right
  })
  if (invoice.TextoAdicional && invoice.TextoAdicional.length > 0) {
    lines.push({text: ''})
    const otherText = splitLines(invoice.TextoAdicional, lineWidth)
    otherText.forEach(line => {
      lines.push({
        text: line,
        align: Align.Center
      })
    })
  }
  lines.push({text: ''})
  lines.push({
    text: 'AUTORIZADO MEDIANTE RESOLUCION',
    align: Align.Center
  })
  lines.push({
    text: 'DGT-R-033-2019 DEL 20-JUN-2019 V4.3',
    align: Align.Center
  })
  lines.push({text: ''})
  lines.push({
    text: 'GRACIAS POR PREFERIRNOS',
    align: Align.Center
  })
  lines.push({text: ''})
  lines.push({
    text: 'POWERED BY: JLC SOLUTIONS CR',
    align: Align.Center
  })
  return lines
}

export const getDeviceFromUsb = async (printer) => {
  let device = null
  if (printer) {
    const connection = new WebUSB(printer)
    try {
      await connection.open()
      device = printer
    } catch {
      device = null
    }
  }
  if (device === null) {
    try {
      device = await navigator.usb.requestDevice({filters: []})
    } catch (ex) {
      console.error(ex)
      return null
    }
  }
  return device
}

export const printInvoice = async (localPrinter, userCode, company, invoice, branchName, lineWidth) => {
  const lines = createTicket(userCode, company, invoice, branchName, lineWidth)
  const model = new Model('TM-T20')
  let connection = new WebUSB(localPrinter)
  try {
    await connection.open()
    const printer = new Printer(model, connection)
    printer.columns = lineWidth
    lines.forEach(line => {
      printer.writeln(line.text, line.style, line.align)
    })
    printer.feed(4)
    printer.buzzer()
    printer.cutter()
  } catch (ex) {
    console.error(ex)
  }
}
