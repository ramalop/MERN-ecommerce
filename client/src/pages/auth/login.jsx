import CommonForm from '@/components/common/form'
import { loginFormControls } from '@/config'
import { loginUser } from '@/store/auth-slice'
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
const initialState = {
  email:"",
  password:""
}

const AuthLogin = () => {
  const [formData , setFormData] = useState(initialState)
  const dispatch = useDispatch()
  function onSubmit(e){
    e.preventDefault()
    dispatch(loginUser(formData)).then((data)=>{
      if(data?.payload?.success){
        toast.success(data.payload.message)
      }else{
        toast.error(data.payload.message)
      }
    })
  }
  return (
    <div className='mx-auto w-full max-w-md space-y-6' >
      <div className="text-center">
        <h1 className='text-3xl font-bold tracking-tight text-foreground'>Sign in to your Account</h1>
        <p className='mt-2'>Don't have an account?
          <Link to = "/auth/register" className='font-medium text-primary hover:underline ml-2'>Sign up</Link>
        </p>
      </div>
      <CommonForm
      formControls={loginFormControls}
      buttonText={"Sign in"}
      formData={formData}
      setFormData={setFormData}
      onSubmit={onSubmit}
      />
    </div>
  )
}

export default AuthLogin

