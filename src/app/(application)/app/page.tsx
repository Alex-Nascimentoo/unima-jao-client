'use client'

import React from 'react'
import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation'

export default function AppPage() {
  const router = useRouter()

  async function handleLogout() {
    // Logout logic here
    Cookies.remove('jao.token')
    router.push('/login')
  }

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
    </div>
  )
}
