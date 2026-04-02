import { Button } from '@/components/ui/button'
import React from 'react'
import { useNavigate } from 'react-router-dom'

const UnauthPage = () => {
  const navigate = useNavigate()
  return (
    <div className='w-full flex flex-col gap-4 justify-center items-center p-4'>
      <h1>You dont have access to this page</h1>
      <Button onClick = {()=>navigate("/")}>Home</Button>
    </div>
  )
}

export default UnauthPage
