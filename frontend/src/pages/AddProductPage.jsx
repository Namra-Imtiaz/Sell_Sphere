import React from 'react'
//import { Navbar } from '../features/navigation/components/Navbar'
import { AdminNavbar } from '../features/admin/components/AdminNavbar'
import { AddProduct } from '../features/admin/components/AddProduct'
import { AdminBreadcrumbs } from '../features/admin/components/AdminBreadcrumbs'
export const AddProductPage = () => {
  return (
    <>
    <AdminNavbar />
    <AdminBreadcrumbs />
    {/* <Navbar/> */}
    <AddProduct/>
    </>
  )
}
