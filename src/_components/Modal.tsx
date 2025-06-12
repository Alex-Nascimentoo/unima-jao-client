import { X } from '@phosphor-icons/react'
import React from 'react'

type Props = {
  children: React.ReactNode
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  clear?: () => void
}

export default function Modal(props: Props) {
  return (
    <div
      data-is-open={props.isOpen}
      className='
      absolute top-0 left-0
      w-full h-full
      bg-black/90
      hidden justify-center items-center

      data-[is-open=true]:flex
      '
    >
      <X
        size={32}
        className='
        text-white
        absolute top-30 right-40
        cursor-pointer
        '
        onClick={() => {
          props.clear ? props.clear() : () => {}
          props.setIsOpen(false)
        }}
      />

      {props.children}
    </div>
  )
}
