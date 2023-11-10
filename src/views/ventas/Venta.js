import React, { useState, useEffect } from 'react'
import { CForm, CFormLabel, CFormInput, CFormTextarea, CButton, CCol, CBadge } from '@coreui/react'
import ProductSearchForm from './ProductSearchForm'
import { loadProductos } from '../../store'
import { useDispatch, useSelector } from 'react-redux'
import Swal from 'sweetalert2'
import { cilCart, cilTrash } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { db } from '../../firebase/config'
import { collection, addDoc } from 'firebase/firestore'
import Ticket from '../../components/ticket'
import CorteCajaModal from './corteCaja'

function Venta() {
  const [quantity, setQuantity] = useState(1)

  const dispatch = useDispatch()
  const productos = useSelector((state) => state.productos)
  const productosToAdd = useSelector((state) => state.productosToAdd)
  const basket = useSelector((state) => state.basket)
  const modalTicket = useSelector((state) => state.modalTicket)
  const corteCaja = useSelector((state) => state.corteCaja)

  useEffect(() => {
    dispatch(loadProductos()) // Carga los productos desde Firestore y los almacena en el estado de Redux
  }, [])

  const handleQuantityChange = (e) => {
    setQuantity(e.target.value)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Aquí puedes enviar los datos del formulario a tu sistema de registro de ventas
    // Luego puedes realizar la lógica necesaria para registrar la venta
  }

  const addProductToBasket = () => {
    const newProduct = {
      nombre: productosToAdd && productosToAdd.nombre,
      precio: productosToAdd && productosToAdd.precio,
      precioPublico: productosToAdd && productosToAdd.precioPublico,
      cantidad: quantity,
    }
    dispatch({ type: 'addProductoToBasket', newProduct: newProduct })
    dispatch({ type: 'limpiarProductosToAdd' })
    Swal.fire({
      icon: 'success',
      title: 'Producto Agregado',
      showConfirmButton: true,
      showCloseButton: true,
    })
  }

  const imprimir = () => {
    dispatch({ type: 'openCorteCaja' })
  }

  const registerVenta = () => {
    const productRef = collection(db, 'ventas')

    const diaVenta = new Date()

    if (!basket.length) {
      return Swal.fire({
        icon: 'warning',
        title: 'Agrega el Producto Primero',
        showConfirmButton: true,
        showCloseButton: true,
      })
    }

    // Itera a través de los productos en el basket
    for (const product of basket) {
      const { cantidad, precio, nombre, precioPublico } = product

      // Calcula el total por producto
      const precioNumero = parseInt(precioPublico, 10)
      const total = cantidad * precioNumero

      // Crea un nuevo objeto con la información de la venta
      const newProduct = {
        cantidad: cantidad,
        diaVenta,
        precio: precio,
        producto: nombre,
        precioPublico,
        total,
      }

      // Agrega el nuevo producto a la colección 'ventas' en la base de datos
      addDoc(productRef, newProduct)
        .then((response) => {
          console.log('Producto agregado con éxito:', response)
        })
        .catch((error) => {
          console.error('Error al agregar producto:', error)
        })
    }
    dispatch({ type: 'imprimirTicket', ticketProducts: basket })
    dispatch({ type: 'limpiarProductosToAdd' })
    dispatch({ type: 'limpiarProductosBasket' })
  }

  if (modalTicket) {
    return (
      <>
        <Ticket></Ticket>
      </>
    )
  }

  if (corteCaja) {
    return (
      <>
        <CorteCajaModal></CorteCajaModal>
      </>
    )
  }

  return (
    <div className="mb-3">
      <h2>Formulario de Venta</h2>
      <div
        style={{
          position: 'relative',
          right: '0',
          top: '0',
          marginTop: '1%',
          marginLeft: '100%',
        }}
      >
        {basket.length >= 1 && (
          <CBadge
            color="danger"
            position="top-start"
            shape="rounded-pill"
            badgeContent={basket.length}
          >
            {basket.length} <span className="visually-hidden">Productos</span>
          </CBadge>
        )}
        <CIcon
          icon={cilCart}
          className="text-primary"
          title="Productos"
          style={{ cursor: 'pointer', marginRight: '10px' }}
          size="xxl"
        />
      </div>
      <div
        style={{
          position: 'relative',
          right: '0',
          top: '-50px',
          marginTop: '-3%',
          marginLeft: '80%',
        }}
      >
        <CButton color="primary" onClick={() => imprimir()}>
          Corte Caja
        </CButton>
      </div>
      <div style={{ marginTop: '-20px' }}>
        <CForm onSubmit={handleSubmit}>
          <div className="mb-3">
            <CFormLabel htmlFor="product">Producto:</CFormLabel>
            <div className="input-group">
              <CFormInput type="text" id="product" value={productosToAdd.nombre} disabled />
            </div>
          </div>
          <div className="mb-3">
            <CFormLabel htmlFor="quantity">Cantidad:</CFormLabel>
            <div>
              <CFormInput
                type="number"
                id="quantity"
                value={quantity}
                onChange={handleQuantityChange}
              />
            </div>
          </div>
          <div className="mb-3">
            <CFormLabel htmlFor="price">Precio por unidad:</CFormLabel>
            <div className="input-group">
              <CFormInput type="number" id="price" value={productosToAdd.precioPublico} disabled />
            </div>
          </div>
          <CButton color="primary" onClick={addProductToBasket} type="submit">
            Agregar Producto
          </CButton>
          <CButton
            color="primary"
            type="submit"
            onClick={registerVenta}
            style={{ marginLeft: '10px' }}
          >
            Registrar Venta
          </CButton>
        </CForm>
      </div>
      <div className="mb-3" style={{ marginTop: '20px' }}>
        <h3>Buscar Producto</h3>
        <ProductSearchForm productos={productos} />
      </div>
    </div>
  )
}

export default Venta
