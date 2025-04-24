'use client'

import React from 'react'
import { Movement } from "@/_types/movement"
import { Input } from '@/_components/form/Input'
import { InputSelect, InputSelectOption } from '@/_components/form/InputSelect'
import { Button } from '@/_components/Button'
import { toast } from 'react-toastify'
import { api } from '@/lib/api'
import { CurrencyInput } from 'react-currency-mask'
import { BankAccount } from '@/_types/bankAccount'
import { Category } from '@/_types/category'

type Props = {
  onClose: () => void
  fetchMovements: () => Promise<void>
  movement: Movement | null
}

export default function MovementForm(props: Props) {
  const [movement, setMovement] = React.useState<Movement | null>(null)
  const [accountList, setAccountList] = React.useState<BankAccount[]>()
  const [categoryList, setCategoryList] = React.useState<Category[]>()

  async function handleSubmit() {
    // Update object if passed as prop
    // Otherwise create a new one
    if (props.movement) {
      const response = await api.patch(`/transacoes`, {
        id: props.movement.id,
        usuario_id: movement?.usuario_id,
        categoria_id: movement?.categoria_id,
        tipo_id: movement?.tipo_id,
        descricao: movement?.descricao,
      })

      if (response.status !== 401 && response.status !== 200) {
        toast.error('Erro ao atualizar transação')
        return
      }
      toast.success('Transação atualizada com sucesso')
    } else {
      const cat = categoryList?.filter(c => c.id === movement?.categoria_id)[0].categoria
      console.log('selecte category id is: ', movement?.categoria_id)
      console.log('selected category is: ', cat)

      const response = await api.post('/criatransacao', {
        conta: movement?.conta_bancaria_id,
        // categoria: movement?.categoria_id,
        categoria: categoryList?.filter(c => c.id === movement?.categoria_id)[0].categoria,
        tipo: categoryList?.[movement?.categoria_id ?? 0]?.tipo_id || 1,
        descricao: movement?.descricao,
        valor: movement?.valor ? movement.valor * 100 : 0,
      })

      if (response.status !== 401 && response.status !== 201) {
        toast.error('Erro ao criar transação')
        return
      }
      toast.success('Transação criada com sucesso')
    }

    setMovement({
      id: 0,
      usuario_id: 0,
      categoria_id: 0,
      tipo_id: 1,
      descricao: '',
    } as Movement)

    props.onClose()
    await props.fetchMovements()
  }

  React.useEffect(() => {
    async function fetchAccounts() {
      const response = await api.get('/contabancaria')
      setAccountList(response.data)
      setMovement({
        ...movement ?? {} as Movement,
        conta_bancaria_id: response.data[0].id,
      })
    }

    async function fetchCategories() {
      const response = await api.get('/categorias')
      setCategoryList(response.data)
      setMovement({
        ...movement ?? {} as Movement,
        categoria_id: response.data[0].id,
      })
    }

    fetchAccounts()
    fetchCategories()
  }, [])

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
        { props.movement ? 'Editar Transação' : 'Nova Transação' }
      </h2>

      <form
        className='
        mt-6 min-w-xl
        flex flex-col gap-6
        '
      >
        <Input
          title='Descrição da transação'
          placeholder='Ex: Almoço no McDonalds'
          labelClasses='w-full'
          value={movement?.descricao ?? ''}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setMovement({
              ...movement ?? {} as Movement,
              descricao: e.target.value,
            })
          }}
        />

        <div
          className="
          flex gap-6
          "
        >
          <CurrencyInput
            onChangeValue={(e: React.ChangeEvent<HTMLInputElement>, originalValue) => {
              const value = Number(originalValue)
              setMovement({
                ...movement ?? {} as Movement,
                valor: value,
              })
            }}
            value={movement?.valor || 0}
            InputElement={
              <Input
                title='Valor'
                labelClasses='w-full'
                placeholder='R$ 0,00'
              />
            }
          />

          <InputSelect
            title='Conta'
            labelClasses='w-full'
            value={movement?.conta_bancaria_id ?? 1}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
              setMovement({
                ...movement ?? {} as Movement,
                conta_bancaria_id: Number(e.target.value),
              })
            }}
          >
            {
              accountList?.map((account, index) => (
                <InputSelectOption
                  key={index}
                  value={account.id}
                >
                  {account.nome}
                </InputSelectOption>
              ))
            }
          </InputSelect>
        </div>

        <div
          className="
          flex gap-6
          "
        >
          {/* <Input
            title='Data'
            placeholder='Ex: 2025-04-23'
            labelClasses='w-full'
            value={movement?.data ?? ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setMovement({
                ...movement ?? {} as Movement,
                data: e.target.value,
              })
            }}
          /> */}

          <InputSelect
            title='Categoria'
            labelClasses='w-full'
            value={movement?.categoria_id ?? 1}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
              setMovement({
                ...movement ?? {} as Movement,
                categoria_id: Number(e.target.value),
              })
            }}
          >
            {
              categoryList?.map((category, index) => (
                <InputSelectOption
                  key={index}
                  value={category.id}
                >
                  {category.categoria}
                </InputSelectOption>
              ))
            }
          </InputSelect>
        </div>

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
            setMovement(null)
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
