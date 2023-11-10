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
import { collection, updateDoc, doc } from 'firebase/firestore'
import { db } from '../../firebase/config'
import { useSelector, useDispatch } from 'react-redux'
import Swal from 'sweetalert2'

function EditModal(product) {
  const dispatch = useDispatch()

  const modal = useSelector((state) => state.modalUpdate)

  const [producto, setProducto] = useState({
    id: '',
    nombre: '',
    precio: '',
    precioPublico: '',
    descripcion: '',
    categoria: '',
    stock: '',
  })
  console.log(producto, 'producto')
  useEffect(() => {
    const productData = product.product

    if (product) {
      setProducto({
        id: productData.id,
        nombre: productData.nombre,
        precio: productData.precio,
        precioPublico: productData.precioPublico,
        descripcion: productData.descripcion,
        stock: productData.stock,
        categoria: productData.categoria,
      })
    }
  }, [product])

  const closeModalAddProduct = () => {
    dispatch({ type: 'closeModaUpdate' })
  }

  const handleProductAdd = () => {
    // Crear un objeto de producto con los datos del formulario
    console.log(producto.id, 'producto.id')
    const newProduct = {
      nombre: producto.nombre,
      precio: producto.precio,
      precioPublico: producto.precioPublico,
      descripcion: producto.descripcion,
      categoria: producto.categoria,
      stock: producto.stock,
    }

    //const productRef = doc(collection(db, 'productos'), producto.id)
    const productRef = doc(db, 'productos', producto.id)

    updateDoc(productRef, newProduct)
      .then(() => {
        Swal.fire({
          icon: 'success',
          title: 'Producto Actualizado',
          showConfirmButton: true,
          showCloseButton: true,
        })
        console.log('Documento actualizado correctamente')
      })
      .catch((error) => {
        console.error('Error al actualizar el documento:', error)
      })
    // Limpiar el formulario después de agregar el producto
    closeModalAddProduct()
  }

  const handleTextDataPropState = (dataPropName) => {
    return (event) => {
      setProducto({
        ...producto,
        [dataPropName]: event.currentTarget.value,
      })
    }
  }

  return (
    <div>
      <CModal visible={modal} onClose={closeModalAddProduct} aria-labelledby="LiveDemoExampleLabel">
        <CModalHeader onClose={closeModalAddProduct}>
          <CModalTitle id="LiveDemoExampleLabel">Actualizar Producto</CModalTitle>
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
                  value={producto.nombre}
                  onChange={handleTextDataPropState('nombre')}
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
                  value={producto.precio}
                  onChange={handleTextDataPropState('precio')}
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
                  value={producto.precioPublico}
                  onChange={handleTextDataPropState('precioPublico')}
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
                  value={producto.descripcion}
                  onChange={handleTextDataPropState('descripcion')}
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
                  value={producto.categoria}
                  onChange={handleTextDataPropState('categoria')}
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
                  value={producto.stock}
                  onChange={handleTextDataPropState('stock')}
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

export default EditModal
