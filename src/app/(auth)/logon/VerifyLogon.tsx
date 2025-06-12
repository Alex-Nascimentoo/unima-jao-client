import { Button } from '@/_components/Button'
import React from 'react'
import VerifyOtp from './VerifyOtp'

type Props = {
  qrcode: string
  userId: string
  isRegistered?: boolean
}

export default function VerifyLogon(props: Props) {
  const [isRegistered, setIsRegistered] = React.useState(props.isRegistered ?? false)

  return (
    <>
      {
        isRegistered ? (
          <VerifyOtp
            userId={props.userId}
          />
        ) : (
          <>
            <h1
              className='
              text-4xl font-semibold text-primary text-center
              px-4
              '
            >Use o seu aplicativo de autenticação</h1>

            <img
              src={`data:image/png;base64, ${props.qrcode}`}
              alt="qrcode"
              width={200}
              height={200}
              className='
              mt-10
              '
            />

            <Button
              type='button'
              onClick={() => setIsRegistered(true)}
              classes='
              mt-3 max-w-[70%]
              '
            >Prosseguir</Button>
          </>
        )
      }

    </>
  )
}
