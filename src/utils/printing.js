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

function createHeader(date, userCode, branchName, company, lineWidth) {
  const lines = []
  lines.push({
    text: date.padEnd(lineWidth-(userCode.length + 17), " ") + userCode,
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
  lines.push({
    text: branchName,
    style: Style.Bold,
    align: Align.Center
  })
  lines.push({text: ''})
  return lines
}

function createFooter(total, taxes, payment, otherText, lineWidth) {
  const lines = []
  lines.push({text: ''})
  let amount = formatCurrency(total - taxes)
  lines.push({
    text: 'Sub-total'.padEnd(10, " ") + amount.padStart(20, " "),
    align: Align.Right
  })
  lines.push({
    text: 'Descuento'.padEnd(10, " ") + '0.00'.padStart(20, " "),
    align: Align.Right
  })
  amount = formatCurrency(taxes)
  lines.push({
    text: 'Impuesto'.padEnd(10, " ") + amount.padStart(20, " "),
    align: Align.Right
  })
  amount = formatCurrency(total)
  lines.push({
    text: 'Total'.padEnd(10, " ") + amount.padStart(20, " "),
    align: Align.Right
  })
  if (payment) {
    amount = formatCurrency(payment)
    lines.push({
      text: 'Pago con'.padEnd(10, " ") + amount.padStart(20, " "),
      align: Align.Right
    })
    amount = formatCurrency(payment - total)
    lines.push({
      text: 'Cambio'.padEnd(10, " ") + amount.padStart(20, " "),
      align: Align.Right
    })
  }
  if (otherText && otherText.length > 0) {
    lines.push({text: ''})
    const text = splitLines(otherText, lineWidth)
    text.forEach(line => {
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
  const lines = createHeader(invoice.Fecha, userCode, branchName, company, lineWidth)
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
  lines.push(createFooter(invoice.Total, invoice.Impuesto, invoice.MontoPagado, invoice.TextoAdicional, lineWidth))
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

export const printWorkingOrder = async (localPrinter, userCode, company, workingOrder, branchName, lineWidth) => {
  const lines = createHeader(workingOrder.Fecha, userCode, branchName, company, lineWidth)
  lines.push({
    text: 'Factura nro.: ' + workingOrder.ConsecOrdenServicio,
    style: Style.Bold,
    align: Align.Center
  })
  lines.push({
    text: 'Fecha: ' + workingOrder.Fecha,
    align: Align.Center
  })
  lines.push({
    text: 'Cliente: ' + workingOrder.Cliente.Nombre,
    align: Align.Center
  })
  if (workingOrder.Cliente.Telefono.length > 0) {
    lines.push({
      text: 'Teléfono: ' + workingOrder.Cliente.Telefono,
      align: Align.Center
    })
  }
  lines.push({text: ''})
  let padLength = 0
  if (workingOrder.DesglosePagoOrdenServicio.length > 0) {
    lines.push({
      text: 'Formas de pago',
      style: Style.Bold,
      align: Align.Center
    })
    workingOrder.DesglosePagoOrdenServicio.forEach(row => {
      const amount = formatCurrency(row.MontoLocal)
      padLength = lineWidth - 17 - (row.FormaPago.Descripcion.length + amount.length)
      lines.push({
        text: row.FormaPago.Descripcion.padEnd(padLength, " ") + amount,
        align: Align.Center
      })
    })
    lines.push({text: ''})
  }
  lines.push({
    text: 'DETALLE ORDEN SERVICIO',
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
  workingOrder.DetalleOrdenServicio.forEach(row => {
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
  lines.push(createFooter(workingOrder.Total, workingOrder.Impuesto, null, workingOrder.TextoAdicional, lineWidth))
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
