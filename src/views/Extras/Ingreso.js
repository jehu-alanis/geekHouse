import React, { useState } from 'react'
import { CForm, CFormLabel, CFormInput, CFormTextarea, CButton, CCol } from '@coreui/react'
import { collection, addDoc } from 'firebase/firestore'
import { db } from '../../firebase/config'
import { useSelector, useDispatch } from 'react-redux'
import Swal from 'sweetalert2'

function Ingreso() {
  const [product, setProduct] = useState('')
  const [price, setPrice] = useState(0)

  const handleProductChange = (e) => {
    setProduct(e.target.value)
  }

  const handlePriceChange = (e) => {
    setPrice(e.target.value)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const newIngreso = {
      MotivoIngreso: product,
      precio: price,
    }

    const productRef = collection(db, 'ingresos')
    addDoc(productRef, newIngreso).then((response) => {
      console.log(response)
    })
    // Limpiar el formulario después de agregar el producto
    setProduct('')
    setPrice('')
    Swal.fire({
      icon: 'success',
      title: 'Ingreso Agregado',
      showConfirmButton: true,
      showCloseButton: true,
    })
  }

  return (
    <div className="mb-3">
      <h2>Formulario de Ingreso</h2>
      <CForm onSubmit={handleSubmit}>
        <div className="mb-3">
          <CFormLabel htmlFor="product">Motivo:</CFormLabel>
          <div className="input-group">
            <CFormInput type="text" id="product" value={product} onChange={handleProductChange} />
          </div>
        </div>
        <div className="mb-3">
          <CFormLabel htmlFor="price">Precio:</CFormLabel>
          <div className="input-group">
            <CFormInput type="number" id="price" value={price} onChange={handlePriceChange} />
          </div>
        </div>
        <CButton color="primary" type="submit">
          Registrar Ingreso
        </CButton>
      </CForm>
    </div>
  )
}

export default Ingreso
