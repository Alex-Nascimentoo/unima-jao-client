import React from 'react'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { api } from '@/lib/api'
import { Button } from '@/_components/Button'
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'

type Props = {
  userId: string
}

export default function VerifyOtp(props: Props) {
  const router = useRouter()

  const [otp, setOtp] = React.useState('')

  async function handleSubmit() {
    try {

      const response = await api.post(`/auth/m2f/${props.userId}?otp=${otp}`)

      if (response.status !== 200) {
        toast.error('Erro ao verificar OTP')
        return
      }
      // One hour
      const expireTime = 60 * 60 * 1000

      Cookies.set('jao.token', response.data.tokens[0].access_token, {
        expires: expireTime,
      })

      toast.success('OTP verificado com sucesso')
      router.push('/app')
    } catch (err) {
      console.log(err)
      toast.error('Erro ao verificar OTP')
      return
    }
  }

  return (
    <div
      className='
        w-[70%]
        flex flex-col items-center
      '
    >
      <InputOTP
        maxLength={6}
        value={otp}
        onChange={(value) => setOtp(value)}
      >
        <InputOTPGroup
          className='
          *:w-12 *:h-10
          *:bg-dark-gray
          '
        >
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
        </InputOTPGroup>
        <InputOTPSeparator />
        <InputOTPGroup
          className='
          *:w-12 *:h-10
          *:bg-dark-gray
          '
        >
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP>

      <Button
        type='button'
        classes='mt-6'
        onClick={handleSubmit}
      >Enviar</Button>
    </div>
  )
}
