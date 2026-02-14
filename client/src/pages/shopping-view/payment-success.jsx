import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import React from 'react'
import { useNavigate } from 'react-router-dom'

const PaymentSuccessPage = () => {
  const navigate = useNavigate()
  return (
    <Card className="flex items-center justify-center flex-col gap-3 p-10">
          <CardHeader>
            <CardTitle className="text-4xl">Payment Successfull</CardTitle>
          </CardHeader>
          <Button  onClick={()=>navigate("/shop/account")}>View Orders</Button>
        </Card>
  )
}

export default PaymentSuccessPage
