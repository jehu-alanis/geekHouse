import React, { useState, useEffect } from 'react'
import { CCard, CCardImage, CCardBody, CCardText, CButton } from '@coreui/react'
import { cilPlus, cilTrash } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { useSelector, useDispatch } from 'react-redux'

function ProductSearchForm(productos) {
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const dispatch = useDispatch()

  const handleSearch = (e) => {
    e.preventDefault()
    const productosArray = Object.values(productos).reduce((accumulator, currentValue) => {
      return accumulator.concat(currentValue)
    }, [])

    const filteredResults = productosArray.filter((producto) => {
      return producto.nombre && producto.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    })

    setSearchResults(filteredResults)
  }

  const addProduct = (producto) => {
    const newProduct = {
      nombre: producto.nombre,
      precio: producto.precio,
      precioPublico: producto.precioPublico,
    }
    dispatch({ type: 'addProducto', newProduct: newProduct })
  }

  return (
    <div>
      <form onSubmit={handleSearch}>
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar producto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" className="btn btn-primary">
            Buscar
          </button>
        </div>
      </form>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {searchResults.map((producto, i) => (
          <>
            <CCard
              style={{
                width: '18rem',
                marginTop: '5px',
                marginRight: '10px',
                marginBottom: '10px',
              }}
            >
              <CCardImage orientation="top" src={producto.image} />
              <CCardBody>
                <CCardText>{producto.nombre}</CCardText>
                <CButton
                  color="light"
                  onClick={() => addProduct(producto)}
                  style={{ marginLeft: '100px' }}
                >
                  <CIcon icon={cilPlus} className="text-success" />
                </CButton>
              </CCardBody>
            </CCard>
          </>
        ))}
      </div>
    </div>
  )
}

export default ProductSearchForm
