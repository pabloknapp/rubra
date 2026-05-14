import { prisma } from "../../lib/prisma"

import { Router } from 'express'
import { z } from 'zod'

const router = Router()

const colecaoSchema = z.object({
  nome: z.string().min(3,
    { message: "Modelo deve possuir, no mínimo, 3 caracteres" })
})

router.get("/", async (req, res) => {
  try {
    const colecoes = await prisma.colecao.findMany({
      orderBy: { id: 'asc' }
    })
    res.status(200).json(colecoes)
  } catch (error) {
    res.status(500).json({ erro: error })
  }
})

router.post("/", async (req, res) => {

  const valida = colecaoSchema.safeParse(req.body)
  if (!valida.success) {
    res.status(400).json({ erro: valida.error })
    return
  }

  const { nome } = valida.data

  try {
    const colecao = await prisma.colecao.create({
      data: { nome }
    })
    res.status(201).json(colecao)
  } catch (error) {
    res.status(400).json({ error })
  }
})

router.delete("/:id", async (req, res) => {
  const { id } = req.params

  try {
    const colecao = await prisma.colecao.delete({
      where: { id: Number(id) }
    })
    res.status(200).json(colecao)
  } catch (error) {
    res.status(400).json({ erro: error })
  }
})

router.put("/:id", async (req, res) => {
  const { id } = req.params

  const valida = colecaoSchema.safeParse(req.body)
  if (!valida.success) {
    res.status(400).json({ erro: valida.error })
    return
  }

  const { nome } = valida.data

  try {
    const colecao = await prisma.colecao.update({
      where: { id: Number(id) },
      data: { nome }
    })
    res.status(200).json(colecao)
  } catch (error) {
    res.status(400).json({ error })
  }
})

export default router
