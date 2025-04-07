'use client'

import { Button } from '@/_components/Button'
import Modal from '@/_components/Modal'
import { BankAccount } from '@/_types/bankAccount'
import { api } from '@/lib/api'
import { maskCurrency } from '@/utils/functions'
import { DotsThreeOutlineVertical, PencilSimple, Trash } from '@phosphor-icons/react'
import { useRouter } from 'next/navigation'
import React from 'react'
import { toast } from 'react-toastify'

type Props = {
  account: BankAccount
  fetchBankAccounts: () => Promise<void>
  handleEdit: () => void
}

export default function BankAccountCard(props: Props) {
  const router = useRouter()

  const [isMenuOpen, setIsMenuOpen] = React.useState<boolean>(false)
  const [isExcludeOpen, setIsExcludeOpen] = React.useState<boolean>(false)

  async function handleSubmit() {
    const response = await api.delete(`/contabancaria?id=${props.account.id}`)

    if (response.status !== 200) {
      toast.error('Erro ao excluir conta bancária')
      return
    }

    toast.success('Conta bancária excluída com sucesso')
    setIsExcludeOpen(false)
    await props.fetchBankAccounts()
  }

  return (
    <div
      className={`
      shadow-default
      rounded-lg
      p-4 py-3
      flex items-center
      `}
    >
      <p
        className='
        w-[70%]
        '
      >{ props.account.nome }</p>

      <p
        className='
        w-[25%]
        '
      >{ maskCurrency(props.account.saldo_conta / 100) }</p>

      <div
        className='
          relative
          w-[5%]
          flex justify-center
        '
      >
        <div
          data-is-visible={isMenuOpen}
          className='
          absolute top-0 right-[70%]
          shadow-default
          rounded-lg
          pt-1
          hidden flex-col gap-2
          bg-white
          font-normal
          overflow-hidden

          data-[is-visible=true]:flex
          '
          onMouseLeave={() => setIsMenuOpen(false)}
        >
          <p
            className='
            border-b border-light-gray
            pb-2 px-4
            font-semibold
            '
          >Ações</p>

          <p
            className='
            px-4 py-1
            cursor-pointer
            hover:bg-light-gray
            flex items-center gap-2
            '
            onClick={() => props.handleEdit()}
          >
            <PencilSimple size={20} />
            Editar
          </p>

          <p
            className='
            px-4 pr-6 py-1
            cursor-pointer
            text-red
            hover:bg-red
            hover:text-white
            flex items-center gap-2
            '
            onClick={() => setIsExcludeOpen(!isExcludeOpen)}
          >
            <Trash
              size={20}
            />
            Excluir
          </p>

        </div>

        <DotsThreeOutlineVertical
          size={20}
          weight="fill"
          className='
          cursor-pointer
          duration-200
          hover:text-accent
          '
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        />
      </div>

      <Modal
        isOpen={isExcludeOpen}
        setIsOpen={setIsExcludeOpen}
      >
        <div
          className='
          bg-white shadow-default
          p-4
          rounded-lg
          '
        >
          <p
            className='
            border-b border-light-gray
            '
          >Tem certeza?</p>

          <p
            className='
            font-normal
            mt-5
            '
          >Você está prestes a deletar a conta: <b>{ props.account.nome }</b></p>

          <div
            className='
            mt-6
            flex gap-6
            '
          >
            <Button
              classes='
              !bg-[#fff]
              !text-red

              hover:!bg-primary
              hover:!text-white
              '
              onClick={() => setIsExcludeOpen(false)}
            >Cancelar</Button>
            <Button
              onClick={() => handleSubmit()}
              classes='
              !bg-red
              !text-white

              hover:!bg-red-700
              '
            >Excluir</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
