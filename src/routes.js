import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const Ventas = React.lazy(() => import('./views/ventas/Venta'))
//const Typography = React.lazy(() => import('./views/theme/typography/Typography'))

// Almacen
const Inventario = React.lazy(() => import('./views/almacen/Inventario'))
//Extras
//const Ingreso = React.lazy(() => import('./views/almacen/Inventario'))
const Ingreso = React.lazy(() => import('./views/Extras/Ingreso'))
const Egreso = React.lazy(() => import('./views/Extras/Egreso'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/ventas', name: 'Ventas', element: Ventas, exact: true },
  { path: '/ventas/Venta', name: 'Venta', element: Ventas },
  //{ path: '/theme/typography', name: 'Typography', element: Typography },
  { path: '/almacen', name: 'Almacen', element: Inventario, exact: true },
  { path: '/almacen/Inventario', name: 'Inventario', element: Inventario, exact: true },
  { path: '/Extras/Ingreso', name: 'Ingreso', element: Ingreso, exact: true },
  { path: '/Extras/Egreso', name: 'Egreso', element: Egreso },
]

export default routes
