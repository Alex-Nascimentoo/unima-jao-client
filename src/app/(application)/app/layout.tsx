import Header from '@/_components/Header'
import Sidebar from '@/_components/Sidebar'
import React from 'react'

type Props = {
  children: React.ReactNode
}

export default function AppLayout(props: Props) {
  return (
    <div
      className='
      flex
      '
    >
      <Sidebar />

      <main
        className='
        w-full
        '
      >
        <Header />

        <div
          className='
          bg-white
          m-4 h-[90vh]
          rounded-lg shadow-default
          overflow-x-hidden overflow-y-scroll
          '
        >
          { props.children }
        </div>
      </main>
    </div>
  )
}
