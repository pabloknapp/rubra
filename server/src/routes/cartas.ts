import { prisma } from "../../lib/prisma"
import { Graduacao, Idioma, Raridade, Tipo } from "../../generated/prisma/enums"

import { Router } from 'express'
import { z } from 'zod'

const router = Router()

const cartaSchema = z.object({
  imagem: z.string().min(3, { message: "Informe a URL/arquivo da imagem" }),
  pokemon: z.string().min(2, { message: "Nome do Pokémon deve ter, no mínimo, 2 caracteres" }),
  tipo: z.nativeEnum(Tipo).optional(),
  graduacao: z.nativeEnum(Graduacao).optional(),
  nota: z.number().int().min(0).max(10),
  idioma: z.nativeEnum(Idioma).optional(),
  ano: z.number().int(),
  raridade: z.nativeEnum(Raridade).optional(),
  preco: z.number(),
  destaque: z.boolean().optional(),
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
    tipo = 'NORMAL',
    graduacao = 'OUTRO',
    nota,
    idioma = 'PORTUGUES',
    ano,
    raridade = 'COMMON',
    preco,
    destaque = true,
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
