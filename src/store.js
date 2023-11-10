import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { db } from '../src/firebase/config'
import { collection, query, where, getDocs } from 'firebase/firestore'

const initialState = {
  sidebarShow: true,
  closeModalAddProduct: false,
  productos: [],
  productosToAdd: {},
  basket: [],
  modalTicket: false,
  modalUpdate: false,
  corteCaja: false,
  ventasDetalladas: [],
  ticketProducts: [],
}

const changeState = (state = initialState, { type, ...rest }) => {
  //console.log(state, rest, 'rest')
  switch (type) {
    case 'set':
      return { ...state, ...rest }
    case 'openModalProduct':
      return { ...state, closeModalAddProduct: rest.openModalProduct }
    case 'closeModalProduct':
      return { ...state, closeModalAddProduct: rest.openModalProduct }
    case 'loadProductos':
      return { ...state, productos: rest.productos }
    case 'getCorteCaja':
      return { ...state, ventasDetalladas: rest.ventasDetalladas }
    case 'addProducto':
      return { ...state, productosToAdd: rest.newProduct }
    case 'limpiarProductosToAdd':
      return { ...state, productosToAdd: { nombre: '', precioPublico: '' } }
    case 'imprimirTicket':
      return { ...state, modalTicket: true, ticketProducts: rest.ticketProducts }
    case 'closeModaTicket':
      return { ...state, modalTicket: false, ticketProducts: [] }
    case 'openModaUpdate':
      return { ...state, modalUpdate: true }
    case 'closeModaUpdate':
      return { ...state, modalUpdate: false }
    case 'openCorteCaja':
      return { ...state, corteCaja: true }
    case 'CloseCorteCaja':
      return { ...state, corteCaja: false }
    case 'limpiarProductosBasket':
      return { ...state, basket: [] }
    case 'addProductoToBasket':
      return {
        ...state,
        basket: [...state.basket, rest.newProduct],
      }
    default:
      return state
  }
}

const loadProductos = () => {
  return (dispatch) => {
    const productosCollection = collection(db, 'productos')

    getDocs(productosCollection)
      .then((snapshot) => {
        const productos = []

        snapshot.forEach((doc) => {
          productos.push(doc.data())
        })

        dispatch({ type: 'loadProductos', productos })
      })
      .catch((error) => {
        console.error('Error al cargar productos:', error)
      })
  }
}

const getIngresos = async () => {
  const ingresosRef = collection(db, 'ingresos')
  const ingresosQuery = query(ingresosRef)

  const ingresosSnapshot = await getDocs(ingresosQuery)
  const ingresosData = []

  ingresosSnapshot.forEach((doc) => {
    const ingreso = doc.data()
    ingresosData.push({
      motivoIngreso: ingreso.MotivoIngreso,
      precio: ingreso.precio,
    })
  })

  return ingresosData
}

const getEgresos = async () => {
  const egresosRef = collection(db, 'egresos')
  const egresosQuery = query(egresosRef)

  const egresosSnapshot = await getDocs(egresosQuery)
  const egresosData = []

  egresosSnapshot.forEach((doc) => {
    const egreso = doc.data()
    egresosData.push({
      motivoEgreso: egreso.MotivoEgreso,
      precio: egreso.precio,
    })
  })

  return egresosData
}

const getCorteCaja = () => {
  return async (dispatch) => {
    try {
      const fechaHoy = new Date()
      const primerDiaDelMes = new Date(fechaHoy.getFullYear(), fechaHoy.getMonth(), 1) // 1er día del mes actual

      const ventasRef = collection(db, 'ventas')
      const q = query(
        ventasRef,
        where('diaVenta', '>=', primerDiaDelMes),
        where('diaVenta', '<=', fechaHoy),
      )
      const querySnapshot = await getDocs(q)

      let totalCaja = 0
      let totalNeto = 0
      const ventasDetalladas = []

      querySnapshot.forEach((doc) => {
        const venta = doc.data()
        const precioNumero = parseInt(venta.precio, 10)

        totalCaja += venta.total
        totalNeto += precioNumero

        // Agregar detalles de la venta al array
        ventasDetalladas.push({
          producto: venta.producto,
          cantidad: venta.cantidad,
          diaVenta: venta.diaVenta,
          precio: venta.precio,
          precioPublico: venta.precioPublico,
        })
      })

      // Adjuntar totalCaja a ventasDetalladas
      ventasDetalladas.totalAntesDeDesgloce = totalCaja
      ventasDetalladas.totalCaja = totalCaja
      ventasDetalladas.totalNeto = totalNeto

      const ingresosData = await getIngresos()
      const egresosData = await getEgresos()
      let totalIngresos = ingresosData.reduce(
        (total, ingreso) => total + parseInt(ingreso.precio),
        0,
      )
      let totalEgresos = egresosData.reduce((total, egreso) => total + parseInt(egreso.precio), 0)

      ventasDetalladas.totalIngresos = totalIngresos
      ventasDetalladas.totalEgresos = totalEgresos

      // Agregar datos de ingresos y egresos a ventasDetalladas
      ventasDetalladas.ingresos = ingresosData
      ventasDetalladas.egresos = egresosData

      // Calcular los totales
      ventasDetalladas.totalCaja += ingresosData.reduce(
        (total, ingreso) => total + parseInt(ingreso.precio),
        0,
      )
      ventasDetalladas.totalCaja -= egresosData.reduce(
        (total, egreso) => total + parseInt(egreso.precio),
        0,
      )
      ventasDetalladas.totalGanancias = ventasDetalladas.totalCaja - totalNeto

      dispatch({ type: 'getCorteCaja', ventasDetalladas })
    } catch (error) {
      console.error('Error al consultar Firestore:', error)
    }
  }
}

const store = createStore(changeState, applyMiddleware(thunk))

export { loadProductos }
export { getCorteCaja }
export default store
