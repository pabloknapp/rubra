import { prisma } from "../../lib/prisma"
import { Router } from 'express'
import { z } from 'zod'
import { verificaToken } from "../middlewares/verificaToken"

const router = Router()

const tiposValidos = ["NORMAL", "FOGO", "AGUA", "ELETRICO", "GRAMA", "GELO", "LUTADOR", "VENENO", "TERRA", "VOADOR", "PSIQUICO", "INSETO", "PEDRA", "FANTASMA", "DRAGAO", "SOMBRIO", "ACO", "FADA", "ESTELAR"] as const

const cartaSchema = z.object({
  imagem: z.string().min(3, { message: "Informe a URL/arquivo da imagem" }),
  pokemon: z.string().min(2, { message: "Nome do Pokémon deve ter, no mínimo, 2 caracteres" }),
  tipo: z.enum(tiposValidos).default("NORMAL"),
  graduacao: z.string().default("OUTRO"),
  nota: z.number().int().min(0).max(10),
  idioma: z.string().default("PORTUGUES"),
  ano: z.number().int(),
  raridade: z.string().default("COMMON"),
  preco: z.number(),
  destaque: z.boolean().default(true),
  colecaoId: z.number(),
})

router.get("/", async (req, res) => {
  try {
    const cartas = await prisma.carta.findMany({
      include: {
        colecao: true,
      }
    })
    res.status(200).json(cartas)
  } catch (error) {
    res.status(500).json({ erro: error })
  }
})

router.get("/destaques", async (req, res) => {
  try {
    const cartas = await prisma.carta.findMany({
      include: {
        colecao: true,
      },
      where: {
        destaque: true
      }
    })
    res.status(200).json(cartas)
  } catch (error) {
    res.status(500).json({ erro: error })
  }
})

router.get("/:id", async (req, res) => {
  const { id } = req.params

  try {
    const carta = await prisma.carta.findFirst({
      where: { id: Number(id) },
      include: {
        colecao: true,
      }
    })
    res.status(200).json(carta)
  } catch (error) {
    res.status(500).json({ erro: error })
  }
})

router.post("/", async (req, res) => {

  const valida = cartaSchema.safeParse(req.body)
  if (!valida.success) {
    res.status(400).json({ erro: valida.error })
    return
  }

  const {
    imagem,
    pokemon,
    tipo,
    graduacao,
    nota,
    idioma,
    ano,
    raridade,
    preco,
    destaque,
    colecaoId,
  } = valida.data

  try {
    const carta = await prisma.carta.create({
      data: {
        imagem,
        pokemon,
        tipo,
        graduacao,
        nota,
        idioma,
        ano,
        raridade,
        preco,
        destaque,
        colecaoId,
      }
    })
    res.status(201).json(carta)
  } catch (error) {
    res.status(400).json({ error })
  }
})

router.delete("/:id", async (req, res) => {
  const { id } = req.params

  try {
    const carta = await prisma.carta.delete({
      where: { id: Number(id) }
    })
    res.status(200).json(carta)
  } catch (error) {
    res.status(400).json({ erro: error })
  }
})

router.put("/:id", async (req, res) => {
  const { id } = req.params

  const valida = cartaSchema.safeParse(req.body)
  if (!valida.success) {
    res.status(400).json({ erro: valida.error })
    return
  }

  const {
    imagem,
    pokemon,
    tipo,
    graduacao,
    nota,
    idioma,
    ano,
    raridade,
    preco,
    destaque,
    colecaoId,
  } = valida.data

  try {
    const carta = await prisma.carta.update({
      where: { id: Number(id) },
      data: {
        imagem,
        pokemon,
        tipo,
        graduacao,
        nota,
        idioma,
        ano,
        raridade,
        preco,
        destaque,
        colecaoId,
      }
    })
    res.status(200).json(carta)
  } catch (error) {
    res.status(400).json({ error })
  }
})

// Admin: alterna destaque
router.patch("/destacar/:id", verificaToken, async (req, res) => {
  const { id } = req.params
  try {
    const carta = await prisma.carta.findUnique({ where: { id: Number(id) } })
    if (!carta) {
      res.status(404).json({ erro: "Carta não encontrada" })
      return
    }

    const atualizada = await prisma.carta.update({
      where: { id: Number(id) },
      data: { destaque: !carta.destaque },
    })
    res.status(200).json(atualizada)
  } catch (error) {
    res.status(400).json({ erro: error })
  }
})

router.get("/pesquisa/:termo", async (req, res) => {
  const { termo } = req.params

  // tenta converter para número
  const termoNumero = Number(termo)

  // is Not a Number, ou seja, se não é um número: filtra por texto
  if (isNaN(termoNumero)) {
    try {
      const cartas = await prisma.carta.findMany({
        include: {
          colecao: true,
        },
        where: {
          OR: [
            { pokemon: { contains: termo, mode: "insensitive" } },
            { colecao: { nome: { contains: termo, mode: "insensitive" } } }
          ]
        }
      })
      res.status(200).json(cartas)
    } catch (error) {
      res.status(500).json({ erro: error })
    }
  } else {
    if (termoNumero <= 2100) {
      try {
        const cartas = await prisma.carta.findMany({
          include: {
            colecao: true,
          },
          where: { ano: termoNumero }
        })
        res.status(200).json(cartas)
      } catch (error) {
        res.status(500).json({ erro: error })
      }
    } else {
      try {
        const cartas = await prisma.carta.findMany({
          include: {
            colecao: true,
          },
          where: { preco: { lte: termoNumero } }
        })
        res.status(200).json(cartas)
      } catch (error) {
        res.status(500).json({ erro: error })
      }
    }
  }
})

export default router
