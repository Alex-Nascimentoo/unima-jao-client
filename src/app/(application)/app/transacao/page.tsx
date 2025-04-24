'use client'

import Modal from "@/_components/Modal"
import { Movement } from "@/_types/movement"
import React from "react"
import MovementForm from "./_components/MovementForm"
import { api } from "@/lib/api"
import MovementCard from "./_components/MovementCard"

export default function TransacaoPage() {
  const [isOpen, setIsOpen] = React.useState<boolean>(false)
  const [movement, setMovement] = React.useState<Movement | null>(null)
  const [movementList, setMovementList] = React.useState<Movement[]>()

  async function fetchMovements() {
    const response = await api.get('/transacoes')
    setMovementList(response.data.Transacoes)
  }

  React.useEffect(() => {
    fetchMovements()
  }, [])

  return (
    <div
      className="
      p-4 px-6 h-[85%]
      "
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
        >Transações</h1>

        <button
          className='
          cursor-pointer
          bg-accent rounded-lg
          p-2 px-5
          text-white font-semibold
          '
          onClick={() => {
            setMovement(null)
            setIsOpen(true)
          }}
        >
          Nova Transação
        </button>
      </div>

      <Modal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      >
        <MovementForm
          onClose={() => {
            setMovement(null)
            setIsOpen(false)
          }}
          fetchMovements={fetchMovements}
          movement={movement ?? null}
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
        >Descrição</p>

        <p
          className='
          w-[25%]
          '
        >Valor</p>

        <p
          className='
          w-[25%]
          '
        >Data</p>

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
          movementList?.length && movementList.map((movement, index) => (
            <>
            <MovementCard
              key={index}
              movement={movement}
              fetchMovements={fetchMovements}
              handleEdit={() => {
                setMovement(movement)
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
