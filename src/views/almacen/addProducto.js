import React, { useState, useEffect } from 'react'
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
} from '@coreui/react'
import { collection, addDoc } from 'firebase/firestore'
import { db } from '../../firebase/config'
import { useSelector, useDispatch } from 'react-redux'
import Swal from 'sweetalert2'

function ProductAddForm() {
  const [productName, setProductName] = useState('')
  const [productPrice, setProductPrice] = useState('')
  const [publicPrice, setPublicPrice] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [categoria, setCategoria] = useState('')
  const [stock, setStock] = useState('')
  const [urlImage, setUrlImagen] = useState('')
  const [visible, setVisible] = useState(true)
  const dispatch = useDispatch()
  const modal = useSelector((state) => state.closeModalAddProduct)

  const handleProductAdd = () => {
    // Crear un objeto de producto con los datos del formulario
    const newProduct = {
      nombre: productName,
      precio: productPrice,
      precioPublico: publicPrice,
      descripcion: descripcion,
      categoria: categoria,
      stock: stock,
      image: urlImage,
    }

    // Llamar a la función de agregar producto y pasar el objeto del producto
    //onProductAdd(newProduct)
    const productRef = collection(db, 'productos')
    addDoc(productRef, newProduct).then((response) => {
      console.log(response)
    })
    // Limpiar el formulario después de agregar el producto
    setProductName('')
    setUrlImagen('')
    setProductPrice('')
    setPublicPrice('')
    setDescripcion('')
    setCategoria('')
    setStock('')
    Swal.fire({
      icon: 'success',
      title: 'Producto Agregado',
      showConfirmButton: true,
      showCloseButton: true,
    })
    closeModalAddProduct()
  }

  const closeModalAddProduct = () => {
    dispatch({ type: 'closeModalProduct', openModalProduct: !modal })
    setVisible(false)
  }

  return (
    <div>
      <CModal
        visible={modal}
        onClose={closeModalAddProduct}
        aria-labelledby="LiveDemoExampleLabel"
        scrollable
        backdrop="static"
      >
        <CModalHeader onClose={closeModalAddProduct}>
          <CModalTitle id="LiveDemoExampleLabel">Agregar Producto</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <div className="mb-3">
              <CFormLabel htmlFor="productName">Nombre del Producto:</CFormLabel>
              <div className="input-group">
                <CFormInput
                  type="text"
                  id="productName"
                  placeholder="Nombre del producto"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                />
              </div>
            </div>
            <div className="mb-3">
              <CFormLabel htmlFor="productName">Url imagen:</CFormLabel>
              <div className="input-group">
                <CFormInput
                  type="text"
                  id="urlImage"
                  placeholder="Url imagen"
                  value={urlImage}
                  onChange={(e) => setUrlImagen(e.target.value)}
                />
              </div>
            </div>
            <div className="mb-3">
              <CFormLabel htmlFor="productPrice">Precio del Producto:</CFormLabel>
              <div className="input-group">
                <CFormInput
                  type="number"
                  id="productPrice"
                  placeholder="Precio del producto"
                  value={productPrice}
                  onChange={(e) => setProductPrice(e.target.value)}
                />
              </div>
            </div>
            <div className="mb-3">
              <CFormLabel htmlFor="productPrice">Precio al Publico:</CFormLabel>
              <div className="input-group">
                <CFormInput
                  type="number"
                  id="productPublicPrice"
                  placeholder="Precio del publico"
                  value={publicPrice}
                  onChange={(e) => setPublicPrice(e.target.value)}
                />
              </div>
            </div>
            <div className="mb-3">
              <CFormLabel htmlFor="Descripcion">Descripcion:</CFormLabel>
              <div className="input-group">
                <CFormInput
                  type="text"
                  id="productDescripcion"
                  placeholder="Descripcion"
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                />
              </div>
            </div>
            <div className="mb-3">
              <CFormLabel htmlFor="Categoria">Categoria:</CFormLabel>
              <div className="input-group">
                <CFormInput
                  type="text"
                  id="productCategoria"
                  placeholder="Categoria"
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                />
              </div>
            </div>
            <div className="mb-3">
              <CFormLabel htmlFor="productStock">En Stock:</CFormLabel>
              <div className="input-group">
                <CFormInput
                  type="number"
                  id="productStock"
                  placeholder="Almacen"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                />
              </div>
            </div>
            {/* <CButton color="primary" onClick={handleProductAdd}>
            Agregar Producto
          </CButton> */}
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={closeModalAddProduct}>
            Close
          </CButton>
          <CButton color="primary" onClick={handleProductAdd}>
            Save
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  )
}

export default ProductAddForm
