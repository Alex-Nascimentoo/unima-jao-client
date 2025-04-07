'use client'

import { Button } from "@/_components/Button"
import Modal from "@/_components/Modal"
import { Category } from "@/_types/category"
import { api } from "@/lib/api"
import { DotsThreeOutlineVertical, PencilSimple, Trash } from "@phosphor-icons/react"
import React from "react"
import { toast } from "react-toastify"

type Props = {
  category: Category
  fetchCategories: () => Promise<void>
  handleEdit: () => void
}

export default function CategoryCard(props: Props) {

  const [isMenuOpen, setIsMenuOpen] = React.useState<boolean>(false)
  const [isExcludeOpen, setIsExcludeOpen] = React.useState<boolean>(false)

  async function handleSubmit() {
    const response = await api.delete(`/categorias?id=${props.category.id}`)

    if (response.status !== 200) {
      toast.error('Erro ao excluir categoria')
      return
    }

    toast.success('Categoria excluída com sucesso')
    setIsExcludeOpen(false)
    await props.fetchCategories()
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
      >{ props.category.categoria }</p>

      <div
        className="w-[25%]"
      >

        <TransactionTypeBadge
          type={ props.category.tipo_id }
        />
      </div>

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
          >Você está prestes a deletar a categoria: <b>{ props.category.categoria }</b></p>

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

type BadgeProps = {
  type: number
  classes?: string
}

function TransactionTypeBadge(props: BadgeProps) {
  return (
    <div
      data-type={props.type}
      className={`
      rounded-full
      p-1 px-4 w-fit
      text-center font-medium text-white
      bg-green-500
      data-[type=2]:bg-red-500
      ${ props.classes }
      `}
    >
      { props.type === 1 ? 'Receita' : 'Despesa' }
    </div>
  )
}
