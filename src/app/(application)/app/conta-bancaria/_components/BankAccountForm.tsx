'use client'

import { Button } from '@/_components/Button'
import { Input } from '@/_components/form/Input'
import { BankAccount } from '@/_types/bankAccount'
import { api } from '@/lib/api'
import { useRouter } from 'next/navigation'
import React from 'react'
import { CurrencyInput } from 'react-currency-mask'
import { toast } from 'react-toastify'

type Props = {
  onClose: () => void
  bankAccount?: BankAccount | null
  fetchBankAccounts: () => Promise<void>
}

export default function BankAccountForm(props: Props) {
  const router = useRouter()

  const [bankAccount, setBankAccount] = React.useState<BankAccount | null>(props.bankAccount ?? null)

  async function handleSubmit() {
    // Update bank account if passed as prop
    // Otherwise create a new one
    if (props.bankAccount) {
      const response = await api.put(`/contabancaria/atualizaconta/${props.bankAccount.id}`, {
        nome: bankAccount?.nome,
        saldo_conta: bankAccount?.saldo_conta ? bankAccount.saldo_conta * 100 : 0,
      })

      if (response.status !== 401 && response.status !== 200) {
        toast.error('Erro ao atualizar conta bancária')
        return
      }

      toast.success('Conta bancária atualizada com sucesso')
    } else {
      const response = await api.post('/contabancaria/criaconta', {
        nome: bankAccount?.nome,
        saldo: bankAccount?.saldo_conta ? bankAccount.saldo_conta * 100 : 0,
      })

      if (response.status !== 401 && response.status !== 200) {
        toast.error('Erro ao criar conta bancária')
        return
      }

      toast.success('Conta bancária criada com sucesso')
    }

    props.onClose()
    await props.fetchBankAccounts()
  }

  React.useEffect(() => {
    if (!props.bankAccount) {
      setBankAccount(null)
      return
    }

    setBankAccount({
      ...props.bankAccount,
      saldo_conta: props.bankAccount.saldo_conta / 100,
    })
  }, [props.bankAccount])

  return (
    <div
      className='
      bg-white rounded-lg
      p-6
      '
    >
      <h2
        className='
        text-3xl font-semibold text-accent
        border-b-2 border-accent
        '
      >
      Nova Conta Bancária
      </h2>

      <form
        className='
        mt-6
        flex gap-6
        '
      >
        <Input
          title='Nome da conta'
          placeholder='Ex: Investimentos'
          value={bankAccount?.nome ?? ''}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setBankAccount({
              ...bankAccount ?? {} as BankAccount,
              nome: e.target.value,
            })
          }}
        />

        <CurrencyInput
          onChangeValue={(e: React.ChangeEvent<HTMLInputElement>, originalValue) => {
            const value = Number(originalValue)
            setBankAccount({
              ...bankAccount ?? {} as BankAccount,
              saldo_conta: value,
            })
          }}
          value={bankAccount?.saldo_conta || 0}
          InputElement={
            <Input
              title='Saldo em conta'
              placeholder='R$ 0,00'
            />
          }
        />
      </form>

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

          hover:!bg-red
          hover:!text-white
          '
          onClick={() => {
            setBankAccount(null)
            props.onClose()
          }}
        >Cancelar</Button>
        <Button
          onClick={() => handleSubmit()}
        >Salvar</Button>
      </div>
    </div>
  )
}
