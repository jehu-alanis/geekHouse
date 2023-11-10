import React, { useState, useEffect, useRef } from 'react'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import {
  CForm,
  CFormLabel,
  CFormInput,
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CTable,
} from '@coreui/react'
import { getCorteCaja } from '../../store'
import { useDispatch, useSelector } from 'react-redux'
//import Pdf from 'react-to-pdf'
import { usePDF } from 'react-to-pdf'

const CorteCaja = () => {
  const dispatch = useDispatch()
  const ventasDetalladas = useSelector((state) => state.ventasDetalladas)
  const corteCaja = useSelector((state) => state.corteCaja)
  //const ref = useRef()
  const { toPDF, targetRef } = usePDF({ filename: 'page.pdf' })

  useEffect(() => {
    dispatch(getCorteCaja()) // Carga los productos desde Firestore y los almacena en el estado de Redux
  }, [])

  const closeModal = () => {
    dispatch({ type: 'CloseCorteCaja' })
  }
  console.log(ventasDetalladas, 'ventasDetalladas')
  const column = [
    {
      key: 'nombre',
      label: 'Nombre',
      _props: { scope: 'col' },
    },
    {
      key: 'precio',
      label: 'Precio',
      _props: { scope: 'col' },
    },
    {
      key: 'precioPublico',
      label: 'PrecioPublico',
      _props: { scope: 'col' },
    },
    {
      key: 'cantidad',
      label: 'Cantidad',
      _props: { scope: 'col' },
    },
    {
      key: 'diaVenta',
      label: 'Fecha',
      _props: { scope: 'col' },
    },
  ]

  const columnEgreso = [
    {
      key: 'nombre',
      label: 'Motivo Egreso',
      _props: { scope: 'col' },
    },
    {
      key: 'precio',
      label: 'Precio',
      _props: { scope: 'col' },
    },
  ]

  const columnIngreso = [
    {
      key: 'nombre',
      label: 'Motivo Ingreso',
      _props: { scope: 'col' },
    },
    {
      key: 'precio',
      label: 'Precio',
      _props: { scope: 'col' },
    },
  ]

  const items = ventasDetalladas.map((product) => {
    const diaVenta = new Date(
      product.diaVenta.seconds * 1000 + product.diaVenta.nanoseconds / 1000000,
    )
    const diaVentaString = diaVenta.toLocaleDateString()
    return {
      nombre: product.producto,
      precio: `$${product.precio} MXN`,
      precioPublico: `$${product.precioPublico} MXN`,
      cantidad: product.cantidad,
      diaVenta: diaVentaString,
      _cellProps: { id: { scope: 'row' } },
    }
  })

  const itemsEgreso =
    (ventasDetalladas.length &&
      ventasDetalladas.egresos.map((product) => {
        return {
          nombre: product.motivoEgreso,
          precio: `$${product.precio} MXN`,
          _cellProps: { id: { scope: 'row' } },
        }
      })) ||
    []

  const itemsIngreso =
    (ventasDetalladas.length &&
      ventasDetalladas.ingresos.map((product) => {
        return {
          nombre: product.motivoIngreso,
          precio: `$${product.precio} MXN`,
          _cellProps: { id: { scope: 'row' } },
        }
      })) ||
    []

  const formatWithLeadingZero = (value) => {
    return value < 10 ? `0${value}` : value.toString()
  }

  const fechaHoy = new Date()
  const primerDiaDelMes = new Date(fechaHoy.getFullYear(), fechaHoy.getMonth(), 1) // 1er día del mes actual

  const formattedPrimerDiaDelMes = `${fechaHoy.getFullYear()}-${formatWithLeadingZero(
    fechaHoy.getMonth() + 1,
  )}-${formatWithLeadingZero(primerDiaDelMes.getDate())}`

  const formattedFechaHoy = `${fechaHoy.getFullYear()}-${formatWithLeadingZero(
    fechaHoy.getMonth() + 1,
  )}-${formatWithLeadingZero(fechaHoy.getDate())}`

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
    <div className="tu-modal">
      <CModal
        scrollable
        size="lg"
        backdrop="static"
        visible={corteCaja}
        onClose={() => closeModal()}
        aria-labelledby="StaticBackdropExampleLabel"
        ref={targetRef}
      >
        <CModalHeader>
          <CModalTitle>
            Corte del {''}
            {formattedPrimerDiaDelMes} al {formattedFechaHoy}
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CTable columns={column} items={items} />
          <CTable columns={columnIngreso} items={itemsIngreso} />
          <CTable columns={columnEgreso} items={itemsEgreso} />
          <p>Total Bruto: ${ventasDetalladas && ventasDetalladas.totalAntesDeDesgloce} MXN</p>
          <p>Total Ingresos: + ${ventasDetalladas && ventasDetalladas.totalIngresos} MXN</p>
          <p>Total Egresos: - ${ventasDetalladas && ventasDetalladas.totalEgresos} MXN</p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p>Total Bruto: ${ventasDetalladas && ventasDetalladas.totalCaja} MXN</p>
            <p>Total Neto: ${ventasDetalladas && ventasDetalladas.totalNeto} MXN</p>
            <p>Ganancias: ${ventasDetalladas && ventasDetalladas.totalGanancias} MXN</p>
          </div>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" className="no-imprimir" onClick={() => closeModal()}>
            Close
          </CButton>
          <CButton color="primary" className="no-imprimir" onClick={() => handlePrint()}>
            Imprimir
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  )
}

export default CorteCaja
