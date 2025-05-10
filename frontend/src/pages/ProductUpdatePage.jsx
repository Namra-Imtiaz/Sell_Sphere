import React from 'react'
import { ProductUpdate } from '../features/admin/components/ProductUpdate'
import { AdminNavbar } from '../features/admin/components/AdminNavbar'
//import {Navbar} from '../features/navigation/components/Navbar'
import { AdminBreadcrumbs } from '../features/admin/components/AdminBreadcrumbs'
export const ProductUpdatePage = () => {
  return (
    <>
    <AdminBreadcrumbs />
    <AdminNavbar />
    {/* <Navbar/> */}
    <ProductUpdate/>
    </>
  )
}
