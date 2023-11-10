import React from 'react'
import { collection, addDoc } from 'firebase/firestore'
import { useDispatch, useSelector } from 'react-redux'
import { CButton, CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter } from '@coreui/react'
import geekimga from '../assets/images/avatars/geek.jpeg'
import { usePDF } from 'react-to-pdf'

const TicketComponent = () => {
  const modalTicket = useSelector((state) => state.modalTicket)
  const ticketProducts = useSelector((state) => state.ticketProducts)
  console.log(ticketProducts)
  const { toPDF, targetRef } = usePDF({ filename: 'page.pdf' })

  const dispatch = useDispatch()
  const closeModal = () => {
    dispatch({ type: 'closeModaTicket' })
  }

  const formatWithLeadingZero = (value) => {
    return value < 10 ? `0${value}` : value.toString()
  }

  const getFormattedTime = (date) => {
    const hours = date.getHours()
    const minutes = date.getMinutes()
    const ampm = hours >= 12 ? 'pm' : 'am'
    const formattedHours = hours % 12 || 12 // Convert 0 to 12 for 12-hour format
    return `${formattedHours}:${formatWithLeadingZero(minutes)} ${ampm}`
  }

  const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']

  const timeZoneOffset = -60
  const fechaHoy = new Date()
  fechaHoy.setMinutes(fechaHoy.getMinutes() + timeZoneOffset)
  const diaSemana = diasSemana[fechaHoy.getDay()]

  const formattedFechaHoy = `${diaSemana} ${fechaHoy.getFullYear()}-${formatWithLeadingZero(
    fechaHoy.getMonth() + 1,
  )}-${formatWithLeadingZero(fechaHoy.getDate())} ${getFormattedTime(fechaHoy)}`

  const total = ticketProducts.reduce(
    (total, product) => total + parseInt(product.precioPublico),
    0,
  )

  const handlePrint = () => {
    document.body.style.width = '100%'
    document.body.style.height = '100%'

    // Aplicar un estilo de impresión para eliminar el efecto de los hipervínculos
    const style = document.createElement('style')
    style.innerHTML = `
      @media print {
        .tu-modal {
          background: #fff; /* Establece un fondo blanco */
        }
        .no-imprimir {
          display: none; /* Oculta los elementos con la clase .no-imprimir */
        }
      }
    `
    document.head.appendChild(style)

    // Inicia la impresión
    window.print()

    // Restaura el tamaño normal después de imprimir
    document.body.style.width = 'auto'
    document.body.style.height = 'auto'

    // Elimina el estilo de impresión después de imprimir
    document.head.removeChild(style)
  }

  return (
    <div>
      <CModal
        scrollable
        visible={modalTicket}
        onClose={() => closeModal()}
        backdrop="static"
        id="LiveDemoExampleLabel"
        ref={targetRef}
      >
        <CModalHeader>
          <CModalTitle id="LiveDemoExampleLabel">Ticket de Compra</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div id="showScroll" className="container">
            <div className="receipt">
              <div
                className="receipt"
                style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
              >
                <h1 className="logo">
                  <img src={geekimga} style={{ maxWidth: '100px', maxHeight: '150px' }} />
                </h1>
              </div>
              <div
                className="creditDetails"
                style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
              >
                <p> GEEK HOUSE </p>
              </div>
              <div
                className="creditDetails"
                style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
              >
                <p> Calle Francisco I. Madero entre </p>
              </div>
              <div
                className="creditDetails"
                style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
              >
                <p> Matamoros y Juarez #69, </p>
              </div>
              <div
                className="creditDetails"
                style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
              >
                <p> Tonala, Chiapas Cp: 30500</p>
              </div>
              <div
                className="transactionDetails"
                style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
              >
                {formattedFechaHoy}
              </div>
              <div
                className="creditDetails"
                style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
              >
                <p>Telefono &nbsp;&nbsp;&nbsp;&nbsp; 966 122 3310</p>
              </div>
              {ticketProducts.map((product, index) => (
                <div className="transactionDetails" key={index}>
                  <div className="detail">Producto: &nbsp;&nbsp;{product.nombre}</div>
                  <div className="detail">Precio: &nbsp;&nbsp;${product.precioPublico} MXN</div>
                  <div className="detail">Cantidad: &nbsp;&nbsp;{product.cantidad}</div>
                </div>
              ))}
              <div className="paymentDetails bold">
                <div className="break">------------------------------------------------------</div>
                <div className="detail">Total:&nbsp;&nbsp; ${total} MXN</div>
                <div className="detail"></div>
              </div>
              <div className="returnPolicy"></div>
              <div className="returnPolicy bold" style={{ fontSize: '50%' }}>
                Es indispensable presentar este comprobante para hacer valida la garantia del
                producto. <br />
                <br /> La garantía aplica en cambios con una vigencia de 30 días naturales y se
                aplica presentando este comprobante y el producto físico.
                <br /> Quejas o sugerencias en https://www.facebook.com/EGeekHouse1
              </div>
              <div className="feedback">
                <div className="break">***********************************</div>
                <p className="center">
                  Este es únicamente un ticket electrónico y no tiene valor fiscal. No se debe
                  considerar como una factura válida para fines tributarios. Solo se emite a efectos
                  de registro o comprobante de la transacción realizada.
                </p>
                <div className="break">***********************************</div>
                <div
                  className="creditDetails"
                  style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                >
                  <p>Gracias por su preferencia!.</p>
                </div>
              </div>
              <div id="coupons" className="coupons"></div>
            </div>
          </div>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" className="no-imprimir" onClick={() => closeModal()}>
            Close
          </CButton>
          <CButton color="primary" className="no-imprimir" onClick={() => handlePrint()}>
            ImprimirTicket
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  )
}

export default TicketComponent
