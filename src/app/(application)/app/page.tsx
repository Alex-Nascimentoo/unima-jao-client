'use client'

import React from 'react'
import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'

export default function AppPage() {
  const router = useRouter()

  const [cats, setCats] = React.useState([])
  const [counter, setCounter] = React.useState(0)

  async function handleLogout() {
    // Logout logic here
    Cookies.remove('jao.token')
    Cookies.remove('jao.refreshToken')
    router.push('/login')
  }

  async function clearCookies() {
    Cookies.remove('jao.refreshToken')
    Cookies.remove('jao.token')
  }

  async function getCategories() {
    const response = await api.get('/categorias')
    console.log('categoires response is: ', response)
    setCats(response.data)
  }

  React.useEffect(() => {
    if (counter === 0) {
      setCounter(1)
    }

    async function getCategories() {

      const response = await api.get('/categorias')
      console.log('categoires response is: ', response)
      setCats(response.data)
    }

    getCategories()
  }, [counter])

  return (
    <div
      className='
      h-screen w-full
      flex flex-col justify-center items-center
      bg-black
      text-white
      '
    >
      <h1
        className='
        text-3xl text-semibold
        '
      >
        This is the app page
      </h1>

      <p
        className='
        mt-10
        text-lg
        cursor-pointer
        '
        onClick={handleLogout}
      >Sair</p>

      <button
        onClick={() => getCategories()}
        className='my-10 cursor-pointer'
      >Pegar categorias</button>

      <button
        onClick={() => router.push('/app/conta-bancaria')}
        className='my-10 cursor-pointer'
      >contas bancarias</button>

      <button
        onClick={() => clearCookies()}
        className='cursor-pointer'
      >Limpar cookies</button>
    </div>
  )
}
