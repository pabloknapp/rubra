import type { CartaType } from "./CartaType"

export type PropostaType = {
  id: number
  clienteId: string
  cartaId: number
  carta: CartaType
  descricao: string
  resposta: string | null
  createdAt: string
  updatedAt: string | null
}