'use client'

import { Input } from '@/_components/form/Input'
import React from 'react'

import bgImage from '../../../../public/bg-logo.png'
import bgPeople from '../../../../public/img-fundo.jpeg'
import Image from 'next/image'
import { LockOpen, User } from '@phosphor-icons/react'
import { Button } from '@/_components/Button'
import VerifyLogin from './VerifyLogin'
import { api } from '@/lib/api'
import { Credentials } from '@/_types/user'
import { toast } from 'react-toastify'

export default function LoginPage() {
  // const [qrcode, setQrcode] = React.useState('iVBORw0KGgoAAAANSUhEUgAAADEAAAAxAQAAAABb53yxAAABQ0lEQVR42mP4DwYNDLjoD5J3WH3YGxi+X8i9U/q9geFLxDGbo+JAOvzNBVYQHdduXwqkv1+PmFQLlP8gGhoaAlT//1+Y6XOQfuegT7PWNzD8+CNwNKW8geGTVLON0Xug+q8LRf8tb2D4OOf4DXH/BoZ/rzMXlgHlvzY/3iQ/v4Hh9+f85af1gTS79oV+oDmfDK/kJwLl/7q+vbUPaN7nXffN84D6fzLmnE6TB4r/P7w0COiO//Pk5WLrgfoyrs05s72B4ZvLxYv/gfQHJSNuUXugOwSbtxTub2D489Oy5SFQ/K/08ZDH/ED35Gokh6QDaenHNvuB6r4tzV/vDbT3W7C3xwKg/P+v37LFzYHmCKdGPc0Hqrvprl9uDgqHnIsf4oF0YJv+PKB5X0IsbWKB+r9fujb1NdD9H4RuX1i5H3f4QmkAckjWI1goHDgAAAAASUVORK5CYII=')
  const [qrcode, setQrcode] = React.useState('')
  const [userId, setUserId] = React.useState('')
  const [credentials, setCredentials] = React.useState<Credentials>({
    username: '',
    password: ''
  })
  const [isRegistered, setIsRegistered] = React.useState(false)

  async function handleLogin() {
    toast.info('Fazendo login...')

    const formData = new FormData()
    formData.append('username', credentials.username)
    formData.append('password', credentials.password)

    try {
      const response = await api.post('/auth/login', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      if (response.status !== 200) {
        toast.error('Erro ao fazer login')
        return
      }

      setUserId(response.data.id)

      if (response.data.primeiro_login !== undefined) {
        setIsRegistered(true)
        setQrcode('a')
        return
      }

      setQrcode(response.data.qrcode)
    } catch (err) {
      console.log(err)
      toast.error('Erro ao fazer login')
      return
    }
  }

  return (
    <main
      className='
      relative
      h-screen
      flex justify-center items-center
      '
    >
      {/* Bg img */}
      <Image
        alt='imagem de fundo'
        src={bgPeople}
        width={1000}
        height={1000}
        className='
          absolute left-0 top-0
          h-full w-full
        '
      />

      {/* Bg layer */}
      <div
        className='
        absolute inset-0
        bg-[#000000] opacity-40
        '
      ></div>

      {/* Content */}
      <div
        className='
        relative z-20 overflow-hidden
        bg-white/20 rounded-2xl
        backdrop-blur-xs
        border-3 border-dark-gray
        flex

        *:h-[30rem] *:w-[24rem]
        '
      >
        {/* Img */}
        <div
          className='
          bg-[#000000]
          relative
          flex justify-center items-center
          '
        >
          <Image
            src={bgImage}
            alt='Imagem de fundo'
            width={1000}
            height={1000}
            className='
            opacity-35
            absolute left-0 top-0
            min-h-full
            '
          />

          <h1
            className='
            relative z-20
            text-center text-4xl text-white font-semibold
            '
          >Jão Finanças</h1>
        </div>

        {/* Form */}
        <div
          className='
          w-full
          flex flex-col items-center justify-center
          '
        >
          {
            qrcode !== '' ? (
              <VerifyLogin
                qrcode={qrcode}
                userId={userId}
                isRegistered={isRegistered}
              />
            ) : (
              <>
                <h1
                  className='
                  text-4xl font-semibold text-primary
                  '
                >Bem-vindo!</h1>

                <form
                  className='
                  mt-6
                  flex flex-col gap-2
                  '
                >
                  <Input
                    title=''
                    placeholder='Digite seu email'
                    value={credentials.username}
                    onChange={e => setCredentials({ ...credentials, username: e.target.value })}
                    icon={
                      <User
                        size={24}
                        weight='bold'
                        className='text-accent'
                      />
                    }
                  />

                  <Input
                    title=''
                    type='password'
                    placeholder='Digite sua senha'
                    value={credentials.password}
                    onChange={e => setCredentials({ ...credentials, password: e.target.value })}
                    icon={
                      <LockOpen
                        size={24}
                        weight='bold'
                        className='text-accent'
                      />
                    }
                  />

                  <div
                    className=''
                  >
                    <Button
                      type='button'
                      onClick={handleLogin}
                      classes='
                      mt-3
                      '
                    >Login</Button>

                    <a
                      href="#"
                      className='
                      text-light-gray font-medium text-sm text-right
                      duration-200
                      hover:text-accent
                      '
                    >
                    Esqueci minha senha
                    </a>

                    <p
                      className='
                      mt-2
                      text-sm text-white
                      '
                    >
                    Não possui conta? {' '}

                    <a
                      href="/logon"
                      className='
                      text-accent font-medium
                      '
                    >
                    Registrar
                    </a>
                    </p>
                  </div>
                </form>
              </>
            )
          }
        </div>
      </div>
    </main>
  )
}
