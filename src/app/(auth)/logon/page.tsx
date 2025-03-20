'use client'

import { Input } from '@/_components/form/Input'
import React from 'react'

import bgImage from '../../../../public/bg-logo.png'
import Image from 'next/image'
import { EnvelopeSimple, LockOpen, User } from '@phosphor-icons/react'
import { Button } from '@/_components/Button'
import { api } from '@/lib/api'
import { User as UserType } from '@/_types/user'
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'

export default function LogonPage() {
  const router = useRouter()

  const [user, setUser] = React.useState<UserType>({
    name: '',
    email: '',
    password: ''
  })

  async function handleSubmit() {
    if (!user.name || user.name === '') {
      toast.error('Nome do usuário é obrigatório')
      return
    } else if (!user.email || user.email === '') {
      toast.error('Email do usuário é obrigatório')
      return
    } else if (!user.password || user.password === '') {
      toast.error('Senha é obrigatório')
      return
    }

    try {
      const response = await api.post('/auth/signup', {
        nome: user.name,
        email: user.email,
        password: user.password,
      })

      if (response.status === 409) {
        toast.error('Email já cadastrado')
        return
      } else if (response.status === 422) {
        toast.error('Email inválido')
        return
      } else {
        toast.error('Erro ao cadastrar usuário')
        return
      }

      toast.success('Usuário cadastrado com sucesso')
      router.push('/login')
    } catch (err) {
      console.log(err)
      toast.error('Erro ao cadstrar usuário')
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
          >Cadastro</h1>

          <form
            className='
            mt-6 w-[85%]
            flex flex-col gap-2
            '
          >
            <Input
              title=''
              placeholder='Nome do usuário'
              value={user.name}
              onChange={e => setUser({ ...user, name: e.target.value })}
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
              type='email'
              placeholder='Digite seu email'
              value={user.email}
              onChange={e => setUser({ ...user, email: e.target.value })}
              icon={
                <EnvelopeSimple
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
              value={user.password}
              onChange={e => setUser({ ...user, password: e.target.value })}
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
              >Cancelar</Button>

              <Button
                type='button'
                classes='
                mt-3
                '
                onClick={handleSubmit}
              >Registrar</Button>
            </div>

          </form>
        </div>
      </div>
    </main>
  )
}
