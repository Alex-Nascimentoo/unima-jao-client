'use client'

import { Movement } from "@/_types/movement"

type Props = {
  onClose: () => void
  fetchMovements: () => void
  movement: Movement | null
}

export default function MovementForm(props: Props) {
  return (
    <div>
      movement form
    </div>
  )
}
