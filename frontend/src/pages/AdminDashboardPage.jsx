import React from 'react'
// import { Navbar } from '../features/navigation/components/Navbar'
import { AdminBreadcrumbs } from '../features/admin/components/AdminBreadcrumbs'
import { AdminNavbar } from '../features/admin/components/AdminNavbar'
import { AdminDashBoard } from '../features/admin/components/AdminDashBoard'

export const AdminDashboardPage = () => {
  return (
    <>
    <AdminNavbar />
    {/* <Navbar isProductList={true}/> */}
    <AdminBreadcrumbs />
    <AdminDashBoard/>
    </>
  )
}
