import React from 'react'
import { CCard, CCardImage, CCardBody, CCardText } from '@coreui/react'
import { cilPlus, cilTrash } from '@coreui/icons'
import CIcon from '@coreui/icons-react'

const ProductCard = (producto) => {
  //console.log(producto.nombre, 'card')
  return (
    <div>
      <CCard style={{ width: '18rem' }}>
        <CCardImage orientation="top" src={producto.image} />
        <CCardBody>
          <CCardText>{producto.nombre}</CCardText>
        </CCardBody>
      </CCard>
      {
        <CIcon
          icon={cilPlus}
          className="text-success"
          title="Agregar"
          style={{ cursor: 'pointer', marginRight: '10px' }}
        />
      }
    </div>
  )
}

export default ProductCard
