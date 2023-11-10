import React, { useState, useEffect } from 'react'
import { CTable, CModal, CButton, CPagination, CPaginationItem } from '@coreui/react'
import ProductAddTable from './addProducto'
import { cilPlus, cilTrash } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { collection, getDocs, deleteDoc, getDoc, doc } from 'firebase/firestore'
import { db } from '../../firebase/config'
import { useSelector, useDispatch } from 'react-redux'
import EditModal from './editModal'
import Swal from 'sweetalert2'

function Inventario() {
  const [product, setProduct] = useState([])
  const [productToUpdate, setProductUpdate] = useState(false)
  const dispatch = useDispatch()
  const modal = useSelector((state) => state.closeModalAddProduct)
  const modalUpdate = useSelector((state) => state.modalUpdate)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6

  const openModalEdit = (productId) => {
    const productRef = doc(db, 'productos', productId)
    getDoc(productRef)
      .then((docSnapshot) => {
        if (docSnapshot.exists()) {
          // El documento existe, puedes acceder a sus datos
          const productData = docSnapshot.data()
          const productWithId = { ...productData, id: productId }
          setProductUpdate(productWithId)
          console.log('Datos del documento:', productWithId)
        } else {
          console.log('El documento no existe.')
        }
      })
      .catch((error) => {
        console.error('Error al obtener el documento:', error)
      })
    dispatch({ type: 'openModaUpdate' })
  }

  const deleteProduct = (productId) => {
    Swal.fire({
      icon: 'warning',
      title: '¿Seguro que deseas eliminar este producto?',
      showConfirmButton: true,
      showCloseButton: true,
    }).then((result) => {
      if (result.isConfirmed) {
        const productRef = doc(collection(db, 'productos'), productId)
        // Utiliza el método deleteDoc para eliminar el documento
        deleteDoc(productRef)
          .then(() => {
            console.log('Documento eliminado correctamente')
            dispatch({ type: 'closeModaUpdate' })
          })
          .catch((error) => {
            console.error('Error al eliminar el documento:', error)
          })
      }
    })
  }

  const columns = [
    {
      key: 'nombre',
      label: 'Nombre',
      _props: { scope: 'col' },
    },
    {
      key: 'descripcion',
      label: 'Descripción',
      _props: { scope: 'col' },
    },
    {
      key: 'precioPublico',
      label: 'PrecioPublico',
      _props: { scope: 'col' },
    },
    {
      key: 'stock',
      label: 'Stock',
      _props: { scope: 'col' },
    },
    {
      key: 'Opciones',
      label: 'Opciones',
      _props: { scope: 'col' },
    },
  ]

  const items = product.map((product) => {
        return {
          id: product.id,
          nombre: product.nombre,
          descripcion: product.descripcion,
          precioPublico: `$${product.precioPublico} MXN`,
          stock: product.stock,
          Opciones: (
            <>
              <div>
                <CButton color="light" onClick={() => openModalEdit(product.id)}>
                  <CIcon
                    icon={cilPlus}
                    className="text-success"
                    title="Editar"
                    style={{ cursor: 'pointer', marginRight: '10px' }}
                  />
                </CButton>
                <CButton color="light" onClick={() => deleteProduct(product.id)}>
                  <CIcon
                    icon={cilTrash}
                    className="text-danger"
                    title="Eliminar"
                    style={{ cursor: 'pointer' }}
                  />
                </CButton>
              </div>
            </>
          ),
          _cellProps: { id: { scope: 'row' } },
        }
      })

  useEffect(() => {
    const productRef = collection(db, 'productos')
    getDocs(productRef).then((response) => {
      setProduct(
        response.docs.map((doc) => {
          return { ...doc.data(), id: doc.id }
        }),
      )
    })
  }, [!modal, !modalUpdate])

  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const itemsToShow = items.slice(startIndex, endIndex)

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage)
  }

  const totalPages = Math.ceil(items.length / itemsPerPage)

  if (modal) {
    return (
      <>
        <ProductAddTable modal={modal} />
      </>
    )
  }

  if (modalUpdate) {
    console.log(productToUpdate, 'productToUpdate')
    return (
      <>
        <EditModal product={productToUpdate} />
      </>
    )
  }

  return (
    <div>
      <CButton onClick={() => dispatch({ type: 'openModalProduct', openModalProduct: !modal })}>
        Agregar Producto Nuevo
      </CButton>
      <div className="mb-3" style={{ marginTop: '20px' }}>
        <CTable columns={columns} items={itemsToShow} />
        <CPagination aria-label="Page navigation example">
          <CPaginationItem
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            Previous
          </CPaginationItem>
          {[...Array(totalPages)].map((_, index) => (
            <CPaginationItem
              key={index}
              active={currentPage === index + 1}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </CPaginationItem>
          ))}
          <CPaginationItem
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            Next
          </CPaginationItem>
        </CPagination>
      </div>
    </div>
  )
}

export default Inventario
