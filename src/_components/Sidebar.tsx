'use client'

import { SignOut, SquaresFour, Wallet } from '@phosphor-icons/react'
import Link from 'next/link'
import React from 'react'
import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation'

export default function Sidebar() {
  const router = useRouter()

  async function signOut() {
    // Logout logic here
    Cookies.remove('jao.token')
    Cookies.remove('jao.refreshToken')
    router.push('/login')
  }

  return (
    <aside
      className='
      pt-4 pb-8 h-screen
      shadow-md
      flex flex-col justify-between items-center
      '
    >
      {/* <SquaresFour
        size={32}
        className='
        mx-6
        '
      /> */}
      <div>
        <h1
          className='
          w-full
          text-center text-2xl font-bold
          '
        >Jão</h1>

        <nav
          className='
          mt-4 pt-10 px-6
          border-t border-light-gray
          '
        >

          <Link
            href={'/app/conta-bancaria'}
          >
            <Wallet
              size={32}
              className='
              duration-200
              hover:text-accent
              '
            />
          </Link>
        </nav>
      </div>

      <SignOut
        size={32}
        className='
        cursor-pointer
        duration-200
        hover:text-accent
        '
        onClick={signOut}
      />
    </aside>
  )
}
