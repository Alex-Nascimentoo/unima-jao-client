import { User } from "./user"

export type BankAccount = {
  id: number
  usuario_id: number
  usuario: User
  nome: string
  saldo_conta: number
}
