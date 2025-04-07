'use client'

import Modal from '@/_components/Modal'
import { api } from '@/lib/api'
import React from 'react'
import BankAccountForm from './_components/BankAccountForm'
import { BankAccount } from '@/_types/bankAccount'
import BankAccountCard from './_components/BankAccountCard'

export default function ContaBancariaPage() {
  const [accountList, setAccountList] = React.useState<BankAccount[]>()
  const [isOpen, setIsOpen] = React.useState<boolean>(false)
  const [bankAccount, setBankAccount] = React.useState<BankAccount | null>(null)

  async function fetchBankAccounts() {
    const response = await api.get('/contabancaria')

    setAccountList(response.data)
  }

  React.useEffect(() => {
    fetchBankAccounts()
  }, [])

  return (
    <div
      className='
      p-4 px-6 h-[85%]
      '
    >
      <div
        className='
        flex justify-between items-center
        '
      >
        <h1
          className='
          text-3xl font-semibold text-accent
          '
        >Contas Bancárias</h1>

        <button
          className='
          cursor-pointer
          bg-accent rounded-lg
          p-2 px-5
          text-white font-semibold
          '
          onClick={() => {
            setBankAccount(null)
            setIsOpen(true)
          }}
        >
          Nova Conta
        </button>
      </div>

      <Modal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      >
        <BankAccountForm
          onClose={() => {
            setBankAccount(null)
            setIsOpen(false)
          }}
          fetchBankAccounts={fetchBankAccounts}
          bankAccount={bankAccount ?? null}
        />
      </Modal>

      <div
        className='
        bg-primary rounded-lg
        text-white text-lg font-semibold
        flex
        p-2 px-4 mt-8
        '
      >
        <p
          className='
          w-[70%]
          '
        >Nome</p>
        <p
          className='
          w-[25%]
          '
        >Saldo</p>
        <p
          className='
          w-[5%]
          text-center
          '
        >Ações</p>
      </div>

      <div
        className='
        pt-2 min-h-full
        flex flex-col gap-3
        '
      >
        {
          accountList?.length && accountList.map((account, index) => (
            <>
            <BankAccountCard
              key={index}
              account={account}
              fetchBankAccounts={fetchBankAccounts}
              handleEdit={() => {
                console.log('account is: ', account)
                setBankAccount(account)
                setIsOpen(true)
              }}
            />
            </>
          ))
        }
      </div>
    </div>
  )
}
