'use client'

import Modal from "@/_components/Modal"
import { Category } from "@/_types/category"
import React from "react"
import CategoryForm from "./_components/CategoryForm"
import { api } from "@/lib/api"
import { Pi } from "lucide-react"
import CategoryCard from "./_components/CategoryCard"

export default function CategoriaPage() {
  const [isOpen, setIsOpen] = React.useState<boolean>(false)
  const [category, setCategory] = React.useState<Category | null>(null)
  const [categoryList, setCategoryList] = React.useState<Category[]>()

  async function fetchCategories() {
    const response = await api.get('/categorias')
    setCategoryList(response.data)
  }

  React.useEffect(() => {
    fetchCategories()
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
        >Categorias</h1>

        <button
          className='
          cursor-pointer
          bg-accent rounded-lg
          p-2 px-5
          text-white font-semibold
          '
          onClick={() => {
            setCategory(null)
            setIsOpen(true)
          }}
        >
          Nova Categoria
        </button>
      </div>

      <Modal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      >
        <CategoryForm
          onClose={() => {
            setCategory(null)
            setIsOpen(false)
          }}
          fetchCategories={fetchCategories}
          category={category ?? null}
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
        >Categoria</p>
        <p
          className='
          w-[25%]
          '
        >Tipo</p>
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
          categoryList?.length && categoryList.map((category: Category, index) => (
            <CategoryCard
              key={index}
              category={category}
              fetchCategories={fetchCategories}
              handleEdit={() => {
                setCategory(category)
                setIsOpen(true)
              }}
            />
          ))
        }
        {/* <CategoryCard
          category={{
            categoria: 'Trabaiu',
            tipo_id: 1,
            id: 1,
            usuario_id: 3,
          }}
          fetchCategories={fetchCategories}
          handleEdit={() => {
            setCategory({
              categoria: 'testee rec.',
              tipo_id: 1,
              id: 1,
              usuario_id: 3,
            })
          setIsOpen(true)
          }}
        />

        <CategoryCard
          category={{
            categoria: 'Alimentação',
            tipo_id: 2,
            id: 1,
            usuario_id: 3,
          }}
          fetchCategories={fetchCategories}
          handleEdit={() => {
            setCategory({
              categoria: 'testee desp.',
              tipo_id: 2,
              id: 2,
              usuario_id: 3,
            })
          setIsOpen(true)
          }}
        /> */}
      </div>
    </div>
  )
}
