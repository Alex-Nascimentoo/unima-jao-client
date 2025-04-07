import { HTMLProps, ReactNode } from 'react'

interface InputProp extends HTMLProps<HTMLSelectElement> {
  icon?: ReactNode
  iconEnd?: ReactNode
  title: string
  labelClasses?: string
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void
  classes?: string
  wrapperClasses?: string
  postTitleChildren?: ReactNode
  children?: ReactNode
}

export function InputSelect({
  icon,
  iconEnd,
  title,
  labelClasses,
  classes,
  wrapperClasses,
  postTitleChildren,
  children,
  ...rest
}: InputProp) {
  return (
    <label
      data-is-disabled={rest.disabled}
      className={`
      text-lg

      data-[is-disabled=true]:!text-dark-gray
      ${labelClasses}
      `}
    >
      <span className="font-medium leading-6 flex justify-between items-center">
        <p className="capsize">{title}</p>

        { postTitleChildren }
      </span>
      <div
        data-is-disabled={rest.disabled}
        className={`
          mt-0 px-[10px] h-10 w-full
          flex items-center gap-2
          rounded-lg bg-[#fff] shadow-sm

          data-[is-disabled=true]:!bg-white
          ${wrapperClasses}
          `}
      >
        <div
          className={`
          h-10 w-10
          flex justify-start items-center
          ${icon === undefined ? 'hidden' : 'visible'}
          `}
        >
          {icon}
        </div>
        <select
          className={`
          capsize font-normal text-base
          w-full
          bg-transparent
          placeholder:text-dark-gray
          focus:outline-none

          ${rest.disabled ? 'text-light-gray' : ''}
          ${classes}
          `}
          {...rest}
        >
          { children }
        </select>

        {/* <input
          className={`
          capsize font-normal text-base
          w-full
          bg-transparent
          placeholder:text-dark-gray
          focus:outline-none

          ${rest.disabled ? 'text-light-gray' : ''}
          ${classes}
          `}
          {...rest}
        /> */}

        <div
          className={`
          h-10 w-10
          flex justify-center items-center
          ${iconEnd === undefined ? 'hidden' : 'visible'}
          `}
        >
          {iconEnd}
        </div>
      </div>
    </label>
  )
}

interface InputSelectOptionProp extends HTMLProps<HTMLOptionElement> {
  children: ReactNode
}

export function InputSelectOption({
  children,
  ...rest
}: InputSelectOptionProp) {
  return (
    <option
      value={rest.value}
      className={`
      w-full
      `}
    >
      {children}
    </option>
  )
}
