'use client'

import { Button } from '@/_components/Button'
import { Input } from '@/_components/form/Input'
import { InputSelect, InputSelectOption } from '@/_components/form/InputSelect'
import { BankAccount } from '@/_types/bankAccount'
import { Category } from '@/_types/category'
import { api } from '@/lib/api'
import { useRouter } from 'next/navigation'
import React from 'react'
import { CurrencyInput } from 'react-currency-mask'
import { toast } from 'react-toastify'

type Props = {
  onClose: () => void
  category?: Category | null
  fetchCategories: () => Promise<void>
}

export default function CategoryForm(props: Props) {
  const router = useRouter()

  const [category, setCategory] = React.useState<Category | null>(null)

  async function handleSubmit() {
    // Update object if passed as prop
    // Otherwise create a new one
    if (props.category) {
      const response = await api.put(`/contabancaria/atualizaconta/${props.category.id}`, category)

      if (response.status !== 401 && response.status !== 200) {
        toast.error('Erro ao atualizar categoria')
        return
      }

      toast.success('Categoria atualizada com sucesso')
    } else {
      toast.info('Methodo não implementado')

      // const response = await api.post('/contabancaria/criaconta', {
      //   categoria: category?.categoria,
      //   saldo: category?.saldo_conta ? category.saldo_conta * 100 : 0,
      // })

      // if (response.status !== 401 && response.status !== 200) {
      //   toast.error('Erro ao criar conta bancária')
      //   return
      // }

      // toast.success('Conta bancária criada com sucesso')
    }

    props.onClose()
    await props.fetchCategories()
  }

  React.useEffect(() => {
    if (!props.category) {
      setCategory(null)
      return
    }

    setCategory(props.category)
  }, [props.category])

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
        { props.category ? 'Editar Categoria' : 'Nova Categoria' }
      </h2>

      <form
        className='
        mt-6
        flex gap-6
        '
      >
        <Input
          title='Nome da categoria'
          placeholder='Ex: Alimentação'
          labelClasses='w-full'
          value={category?.categoria ?? ''}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setCategory({
              ...category ?? {} as Category,
              categoria: e.target.value,
            })
          }}
        />

        <InputSelect
          title='Tipo'
          labelClasses='w-full'
          value={category?.tipo_id ?? 1}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
            setCategory({
              ...category ?? {} as Category,
              tipo_id: Number(e.target.value),
            })
          }}
        >
          <InputSelectOption
            value={1}
          >
            Receita
          </InputSelectOption>
          <InputSelectOption
            value={2}
          >
            Despesa
          </InputSelectOption>
        </InputSelect>
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
            setCategory(null)
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
