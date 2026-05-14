import type { CartaType } from "./CartaType"
import type { ClienteType } from "./ClienteType"

export type PropostaType = {
  id: number
  clienteId: string
  cartaId: number
  carta: CartaType
  cliente?: ClienteType
  descricao: string
  resposta: string | null
  status: "PENDENTE" | "ACEITA" | "RECUSADA"
  createdAt: string
  updatedAt: string | null
}