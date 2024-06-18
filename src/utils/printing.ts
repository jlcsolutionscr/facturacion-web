import { Align, Model, Printer, Style, WebUSB } from "escpos-buffer-web";
import { CompanyType, InvoiceType, WorkingOrderType } from "types/domain";

import { formatCurrency } from "utils/utilities";

type LineType = {
  text: string;
  style?: Style;
  align?: Align;
};

function splitLines(text: string, lineWidth: number) {
  const words = text.split(" ");
  const results = [];
  let row = "";
  words.forEach(word => {
    if (row.length + word.length > lineWidth - 17) {
      results.push(row);
      row = word;
    } else {
      row += row.length > 0 ? " " + word : word;
    }
  });
  results.push(row);
  return results;
}

function createHeader(date: string, userCode: string, branchName: string, company: CompanyType, lineWidth: number) {
  const lines = [];
  lines.push({
    text: date.padEnd(lineWidth - (userCode.length + 17), " ") + userCode,
    align: Align.Center,
  });
  lines.push({
    text: "TIQUETE DE FACTURA",
    style: Style.DoubleWidth | Style.Bold,
    align: Align.Center,
  });
  lines.push({ text: "" });
  lines.push({
    text: company.NombreComercial,
    style: Style.Bold,
    align: Align.Center,
  });
  const locations = splitLines(company.Direccion, lineWidth);
  locations.forEach(line => {
    lines.push({
      text: line,
      align: Align.Center,
    });
  });
  lines.push({
    text: company.Telefono1,
    align: Align.Center,
  });
  lines.push({
    text: company.NombreEmpresa,
    style: Style.Bold,
    align: Align.Center,
  });
  lines.push({
    text: company.Identificacion,
    style: Style.Bold,
    align: Align.Center,
  });
  lines.push({
    text: company.CorreoNotificacion,
    align: Align.Center,
  });
  lines.push({ text: "" });
  lines.push({
    text: branchName,
    style: Style.Bold,
    align: Align.Center,
  });
  lines.push({ text: "" });
  return lines;
}

function createFooter(total: number, taxes: number, payment: number, otherText: string, lineWidth: number) {
  const lines: LineType[] = [];
  lines.push({ text: "" });
  let amount = formatCurrency(total - taxes);
  lines.push({
    text: "Sub-total".padEnd(10, " ") + amount.padStart(20, " "),
    align: Align.Right,
  });
  lines.push({
    text: "Descuento".padEnd(10, " ") + "0.00".padStart(20, " "),
    align: Align.Right,
  });
  amount = formatCurrency(taxes);
  lines.push({
    text: "Impuesto".padEnd(10, " ") + amount.padStart(20, " "),
    align: Align.Right,
  });
  amount = formatCurrency(total);
  lines.push({
    text: "Total".padEnd(10, " ") + amount.padStart(20, " "),
    align: Align.Right,
  });
  if (payment) {
    amount = formatCurrency(payment);
    lines.push({
      text: "Pago con".padEnd(10, " ") + amount.padStart(20, " "),
      align: Align.Right,
    });
    amount = formatCurrency(payment - total);
    lines.push({
      text: "Cambio".padEnd(10, " ") + amount.padStart(20, " "),
      align: Align.Right,
    });
  }
  if (otherText && otherText.length > 0) {
    lines.push({ text: "" });
    const text = splitLines(otherText, lineWidth);
    text.forEach(line => {
      lines.push({
        text: line,
        align: Align.Center,
      });
    });
  }
  lines.push({ text: "" });
  lines.push({
    text: "AUTORIZADO MEDIANTE RESOLUCION",
    align: Align.Center,
  });
  lines.push({
    text: "DGT-R-033-2019 DEL 20-JUN-2019 V4.3",
    align: Align.Center,
  });
  lines.push({ text: "" });
  lines.push({
    text: "GRACIAS POR PREFERIRNOS",
    align: Align.Center,
  });
  lines.push({ text: "" });
  lines.push({
    text: "POWERED BY: JLC SOLUTIONS CR",
    align: Align.Center,
  });
  return lines;
}

export const printInvoice = async (
  userCode: string,
  company: CompanyType,
  invoice: InvoiceType,
  branchName: string,
  lineWidth: number
) => {
  const lines: LineType[] = [];
  lines.concat(createHeader(invoice.date, userCode, branchName, company, lineWidth));
  if (invoice.comment) {
    lines.push({
      text: invoice.customerDetails.id === 1 ? "TIQUETE ELECTRONICO" : "FACTURA ELECTRONICA",
      style: Style.Bold,
      align: Align.Center,
    });
    lines.push({
      text: invoice.comment.substring(0, 25),
      align: Align.Center,
    });
    lines.push({
      text: invoice.comment.substring(0, 25),
      align: Align.Center,
    });
  }
  lines.push({
    text: "Factura nro.: " + invoice.consecutive,
    style: Style.Bold,
    align: Align.Center,
  });
  lines.push({
    text: "Fecha: " + invoice.date,
    align: Align.Center,
  });
  lines.push({
    text: "Cliente: " + invoice.customerDetails.name,
    align: Align.Center,
  });
  if (invoice.customerDetails.phoneNumber.length > 0) {
    lines.push({
      text: "Teléfono: " + invoice.customerDetails.phoneNumber,
      align: Align.Center,
    });
  }
  lines.push({ text: "" });
  lines.push({
    text: "Formas de pago",
    style: Style.Bold,
    align: Align.Center,
  });
  let padLength = 0;
  invoice.paymentDetailsList.forEach(row => {
    const amount = formatCurrency(row.amount);
    padLength = lineWidth - 17 - (row.description.length + amount.length);
    lines.push({
      text: row.description.padEnd(padLength, " ") + amount,
      align: Align.Center,
    });
  });
  lines.push({ text: "" });
  lines.push({
    text: "DETALLE DE FACTURA",
    style: Style.Bold,
    align: Align.Center,
  });
  lines.push({
    text: "DESCRIPCION",
    style: Style.Bold,
    align: Align.Left,
  });
  padLength = (lineWidth - 28) / 2;
  lines.push({
    text: "CANT".padEnd(8, " ") + "PRECIO/U".padStart(padLength, " ") + "TOTAL".padStart(padLength, " ") + " GR",
    style: Style.Bold,
    align: Align.Left,
  });
  invoice.productDetailsList.forEach(row => {
    lines.push({
      text: row.description,
      align: Align.Left,
    });
    const unitPrice = formatCurrency(row.price);
    const total = formatCurrency(row.quantity * row.price);
    padLength = (lineWidth - 28) / 2;
    lines.push({
      text:
        row.quantity.toString().padEnd(8, " ") +
        unitPrice.padStart(padLength, " ") +
        total.padStart(padLength, " ") +
        (row.taxRate === 0 ? "  E" : "  G"),
      align: Align.Left,
    });
  });
  lines.concat(
    createFooter(invoice.summary.total, invoice.summary.taxes, invoice.summary.cashAmount, invoice.comment, lineWidth)
  );
  printLines(lines, lineWidth);
};

export const printWorkingOrder = async (
  userCode: string,
  company: CompanyType,
  workingOrder: WorkingOrderType,
  branchName: string,
  lineWidth: number
) => {
  const lines: LineType[] = [];
  lines.concat(createHeader(workingOrder.date, userCode, branchName, company, lineWidth));
  lines.push({
    text: "Factura nro.: " + workingOrder.consecutive,
    style: Style.Bold,
    align: Align.Center,
  });
  lines.push({
    text: "Fecha: " + workingOrder.date,
    align: Align.Center,
  });
  lines.push({
    text: "Cliente: " + workingOrder.customerDetails.name,
    align: Align.Center,
  });
  if (workingOrder.customerDetails.phoneNumber.length > 0) {
    lines.push({
      text: "Teléfono: " + workingOrder.customerDetails.phoneNumber,
      align: Align.Center,
    });
  }
  lines.push({ text: "" });
  let padLength = 0;
  if (workingOrder.paymentDetailsList.length > 0) {
    lines.push({
      text: "Formas de pago",
      style: Style.Bold,
      align: Align.Center,
    });
    workingOrder.paymentDetailsList.forEach(row => {
      const amount = formatCurrency(row.amount);
      padLength = lineWidth - 17 - (row.description.length + amount.length);
      lines.push({
        text: row.description.padEnd(padLength, " ") + amount,
        align: Align.Center,
      });
    });
    lines.push({ text: "" });
  }
  lines.push({
    text: "DETALLE ORDEN SERVICIO",
    style: Style.Bold,
    align: Align.Center,
  });
  lines.push({
    text: "DESCRIPCION",
    style: Style.Bold,
    align: Align.Left,
  });
  padLength = (lineWidth - 28) / 2;
  lines.push({
    text: "CANT".padEnd(8, " ") + "PRECIO/U".padStart(padLength, " ") + "TOTAL".padStart(padLength, " ") + " GR",
    style: Style.Bold,
    align: Align.Left,
  });
  workingOrder.productDetailsList.forEach(row => {
    lines.push({
      text: row.description,
      align: Align.Left,
    });
    const unitPrice = formatCurrency(row.price);
    const total = formatCurrency(row.quantity * row.price);
    padLength = (lineWidth - 28) / 2;
    lines.push({
      text:
        row.quantity.toString().padEnd(8, " ") +
        unitPrice.padStart(padLength, " ") +
        total.padStart(padLength, " ") +
        (row.taxRate === 0 ? "  E" : "  G"),
      align: Align.Left,
    });
  });
  lines.concat(
    createFooter(
      workingOrder.summary.total,
      workingOrder.summary.taxes,
      0,
      workingOrder.delivery.description,
      lineWidth
    )
  );
  printLines(lines, lineWidth);
};

async function printLines(lines: LineType[], lineWidth: number) {
  const device = await navigator.usb.requestDevice({
    filters: [],
  });
  const connection = new WebUSB(device);
  await connection.open();
  const model = new Model("TM-T20");
  const printer = new Printer(model, connection);
  printer.columns = lineWidth;
  lines.forEach(line => {
    printer.writeln(line.text, line.style, line.align);
  });
  printer.feed(4);
  printer.buzzer();
  printer.cutter();
}
