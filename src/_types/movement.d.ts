export type Movement = {
  id: number
  usuario_id: number
  conta_bancaria_id: number
  valor: number
  data: string
  categoria_id: number
  tipo_id: number
  descricao: string
}

export type MovementList = {
  [key: string]: { CREDIT: number; DEBIT: number }
}

export type ActionList = {
  [key: string]: number
}
