import { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  classes?: string
  children?: React.ReactNode
}

export function Button({ classes, children, ...rest }: ButtonProps) {
  return (
    <button
      className={`
        block
        h-12 w-full
        rounded
        bg-accent
        font-semibold text-white
        transition-colors duration-300
        cursor-pointer
        hover:bg-primary
        disabled:cursor-not-allowed disabled:bg-dark-gray
        ${classes}
      `}
      {...rest}
    >
      { children }
    </button>
  )
}
