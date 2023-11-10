import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilBell,
  cilCalculator,
  cilChartPie,
  cilCursor,
  cilDescription,
  cilDrop,
  cilNotes,
  cilMoney,
  cilPuzzle,
  cilSpeedometer,
  cilStar,
  cilSortDescending,
  cilSortAscending,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    badge: {
      color: 'info',
      text: 'NEW',
    },
  },
  {
    component: CNavTitle,
    name: 'Ventas',
  },
  {
    component: CNavItem,
    name: 'Registro de ventas',
    to: '/ventas/Venta',
    icon: <CIcon icon={cilMoney} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'Almacen',
  },
  {
    component: CNavItem,
    name: 'Inventario',
    to: '/almacen/inventario',
    icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'Extras',
  },
  {
    component: CNavItem,
    name: 'Ingreso',
    to: '/Extras/Ingreso',
    icon: <CIcon icon={cilSortAscending} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Egresos',
    to: '/Extras/Egreso',
    icon: <CIcon icon={cilSortDescending} customClassName="nav-icon" />,
  },
]
export default _nav
