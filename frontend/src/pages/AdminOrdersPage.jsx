import React from 'react'
import { AdminOrders } from '../features/admin/components/AdminOrders'
//import {Navbar} from '../features/navigation/components/Navbar'
import { AdminNavbar } from '../features/admin/components/AdminNavbar'
import { AdminBreadcrumbs } from '../features/admin/components/AdminBreadcrumbs'

export const AdminOrdersPage = () => {
  return (
    <>
    {/* <Navbar/> */}
    <AdminNavbar />
    <AdminBreadcrumbs />
    <AdminOrders/>
    </>
  )
}
