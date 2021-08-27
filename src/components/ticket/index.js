import React from 'react'
import './styles.css'
import { formatCurrency } from 'utils/utilities'

export default function Ticket({ data }) {
  if (data === null) return null
  const { header, payments, details, footer } = data
  const payRows = payments.map(row => (
    <div key={row.id} class='row'>
      <span class='left'>{row.description}</span>
      <span class='right'>{formatCurrency(row.amount)}</span>
    </div>
  ))
  const rows = details.map(row => (
    <div>
      <div key={row.id} class='row'>
        <span key='1' class='quantity'>{row.quantity}</span>
        <span key='2' class='price'>{formatCurrency(row.amount)}</span>
        <span key='3' class='price'>{formatCurrency(row.quantity * row.amount)}</span>
        <span key='4' class='exempt'>{row.exempt}</span>
      </div>
      <div class='row'>
        <span class='description'>{row.description}</span>
      </div>
    </div>
  ))
  return (
    <div class='ticket'>
      <div class='row centered'>
        <button id='btnPrint' class='button hidden-print' onClick={() => window.print()}>Print</button>
      </div>
      <div class='row'>
        <span class='left'>{header.date}</span>
        <span class='right'>{header.user}</span>
      </div>
      <div class='row' />
      <div class='row'>
        <span class='center'>{header.title}</span>
      </div>
      <div class='row' />
      <div class='row'>
        <span class='center'>{header.companyTitle}</span>
      </div>
      <div class='row'>
        <span class='center'>{header.location}</span>
      </div>
      <div class='row'>
        <span class='center'>{`Telefono: ${header.telephone1}`}</span>
      </div>
      <div class='row'>
        <span class='center'>{header.email}</span>
      </div>
      <div class='row' />
      <div class='row'>
        <span class='center'>{header.companyName}</span>
      </div>
      <div class='row'>
        <span class='center'>{`Identificación: ${header.identifier}`}</span>
      </div>
      <div class='row' />
      {header.consec1 && <div>
        <div class='row'>
          <span class='center'>{header.docType}</span>
        </div>
        <div class='row'>
          <span class='center'>{header.consec1}</span>
        </div>
        <div class='row'>
          <span class='center'>{header.consec2}</span>
        </div>
        <div class='row' />
      </div>}
      <div class='row'>
        <span class='center'>{`Factura Nro: ${header.invoiceId}`}</span>
      </div>
      <div class='row'>
        <span class='center'>{`Fecha: ${header.invoiceDate}`}</span>
      </div>
      <div class='row'>
        <span class='center'>{`Vendedor: ${header.vendorName}`}</span>
      </div>
      <div class='row'>
        <span class='center'>{`Cliente: ${header.customerName}`}</span>
      </div>
      <div class='row'>
        <span class='center'>{`Teléfono: ${header.customerPhone}`}</span>
      </div>
      {header.aditional && <div class='row'>
        <span class='center'>{`Observación: ${header.aditional}`}</span>
      </div>}
      <div class='row' />
      <div class='row borderBottom'>
        <span class='center'>Desglose de pago</span>
      </div>
      <div>
        {payRows}
      </div>
      <div class='row' />
      <div class='row'>
        <span class='center'>Detalle de factura</span>
      </div>
      <div class='row borderTop'>
        <span class='description'>Descripción</span>
      </div>
      <div class='row borderBottom'>
        <span key='1' class='quantity'>Cant</span>
        <span key='2' class='price'>Precio/U</span>
        <span key='3' class='price'>Total</span>
        <span key='4' class='exempt'>E</span>
      </div>
      
      <div>
        {rows}
      </div>
      <div class='row borderTop'>
        <span class='leftPad'>Sub-total:</span>
        <span class='right'>{formatCurrency(footer.subTotal)}</span>
      </div>
      <div class='row'>
        <span class='leftPad'>Descuento:</span>
        <span class='right'>{formatCurrency(footer.discount)}</span>
      </div>
      <div class='row'>
        <span class='leftPad'>Impuesto:</span>
        <span class='right'>{formatCurrency(footer.taxes)}</span>
      </div>
      <div class='row'>
        <span class='leftPad'>Total:</span>
        <span class='right'>{formatCurrency(footer.total)}</span>
      </div>
      <div class='row'>
        <span class='leftPad'>Pago efectivo:</span>
        <span class='right'>{formatCurrency(footer.payment)}</span>
      </div>
      <div class='row'>
        <span class='leftPad'>Cambio:</span>
        <span class='right'>{formatCurrency(footer.change)}</span>
      </div>
      <div class='row' />
      {header.observations !== '' && <div>
        <div class='row'>
          <span class='center'>{footer.observations}</span>
        </div>
        <div class='row' />
      </div>}
      <div class='row'>
        <span class='center'>AUTORIZADO MEDIANTE RESOLUCION</span>
      </div>
      <div class='row'>
        <span class='center'>DGT-R-48-2016 DEL 07-OCT-2016</span>
      </div>
      <div class='row' />
      <div class='row'>
        <span class='center'>GRACIAS POR PREFERIRNOS</span>
      </div>
      <div class='row' />
    </div>
  )
}
