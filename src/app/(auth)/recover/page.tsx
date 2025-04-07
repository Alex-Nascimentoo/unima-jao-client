'use client'

import React, { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import bgImage from '../../../../public/bg-logo.png'
import { Input } from '@/_components/form/Input'
import { Button } from '@/_components/Button'
import { LockOpen } from '@phosphor-icons/react'
import { toast } from 'react-toastify'
import { api } from '@/lib/api'

export default function RecoverPassword() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [newPass, setNewPass] = React.useState<string>('')

  const token = searchParams.get('token')

  async function handleSubmit() {
    if (!newPass || newPass === '') {
      toast.error('Senha é obrigatória')
      return
    }

    try {
      await api.post(`/auth/recuperasenha/${token}?nova_senha=${newPass}`)

      router.push('/login')
      toast.success('Senha salva com sucesso')
    } catch (err: any) {
      toast.error('Erro ao salvar nova senha')
      return
    }
  }

  return (
    <main
      className='
      relative
      h-screen
      bg-[url("/img-fundo.jpeg")] bg-center bg-cover bg-no-repeat
      flex justify-center items-center
      '
    >
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
          <h1
            className='
            text-4xl font-semibold text-primary
            '
          >Sua nova senha</h1>

          <form
            className='
            mt-6 w-[85%]
            flex flex-col gap-2
            '
          >
            <Input
              title=''
              type='password'
              placeholder='Digite sua nova senha'
              value={newPass}
              onChange={e => setNewPass(e.target.value)}
              icon={
                <LockOpen
                  size={24}
                  weight='bold'
                  className='text-accent'
                />
              }
            />

            <div
              className='
              flex gap-4
              '
            >
              <Button
                type='button'
                onClick={() => router.push('/login')}
                classes='
                mt-3
                bg-white
                text-accent!

                hover:text-white!
                hover:bg-accent!
                '
              >Voltar ao login</Button>

              <Button
                type='button'
                classes='
                mt-3
                '
                onClick={handleSubmit}
              >Salvar senha</Button>
            </div>

          </form>
        </div>
      </div>
    </main>
  )
}
