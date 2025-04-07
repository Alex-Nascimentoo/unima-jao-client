'use client'

import { List } from '@phosphor-icons/react'
import React from 'react'

export default function Header() {
  return (
    <header
      className='
      bg-primary
      py-4 px-12 w-full
      text-white text-2xl font-bold
      flex justify-between items-center
      '
    >
      <h1>Logo</h1>

      {/* <List
        size={32}
        className='
        cursor-pointer
        '
      /> */}
    </header>
  )
}
