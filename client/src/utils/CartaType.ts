import type { ColecaoType } from "./ColecaoType"

export type CartaType = {
  id: number
  imagem: string
  pokemon: string
  tipo: string
  graduacao: string
  nota: number
  idioma: string
  ano: number
  raridade: string
  preco: number
  destaque: boolean
  colecaoId: number
  colecao: ColecaoType
  createdAt: string
  updatedAt: string
}

