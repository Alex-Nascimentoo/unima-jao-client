import Image from 'next/image'
import React from 'react'

type Props = {
  qrcode: string
}

export default function VerifyLogin(props: Props) {
  return (
    <>
      <h1
        className='
        text-4xl font-semibold text-primary text-center
        px-4
        '
      >Use o seu aplicativo de autenticação</h1>

      <Image
        src={`data:image/png;base64, ${props.qrcode}`}
        alt="qrcode"
        width={200}
        height={200}
        className='
        mt-10 w-[50%]
        '
      />
    </>
  )
}
