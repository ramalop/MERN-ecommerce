import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import AdminSidebar from './sidebar'
import AdminHeader from './header'

const AdminLayout = () => {
  const [openSidebar , setOpenSidebar] = useState(false)
  return (
    <div className='flex min-h-screen w-full overflow-x-hidden'>
      {/* admin sidebar */}
      <AdminSidebar open={openSidebar} setOpen={setOpenSidebar}/>
      <div className="flex flex-1 flex-col min-w-0">
        {/* admin header */}
        <AdminHeader setOpen={setOpenSidebar}/>
        <main className='flex flex-1 flex-col bg-muted/40 p-4 md:p-6'>
            <Outlet/>
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
