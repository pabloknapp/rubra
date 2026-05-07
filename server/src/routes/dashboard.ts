import { Router } from "express"
import { prisma } from "../../lib/prisma"
import { verificaToken } from "../middlewares/verificaToken"

const router = Router()

// Rotas de dashboard (protegidas)
router.get("/gerais", verificaToken, async (_req, res) => {
  try {
    const clientes = await prisma.cliente.count()
    const cartas = await prisma.carta.count()
    const propostas = await prisma.proposta.count()
    res.status(200).json({ clientes, cartas, propostas })
  } catch (error) {
    res.status(400).json(error)
  }
})

router.get("/cartasColecao", verificaToken, async (_req, res) => {
  try {
    const colecoes = await prisma.colecao.findMany({
      select: {
        nome: true,
        _count: { select: { cartas: true } },
      },
      orderBy: { nome: "asc" },
    })

    const payload = colecoes
      .filter((c) => c._count.cartas > 0)
      .map((c) => ({ colecao: c.nome, num: c._count.cartas }))

    res.status(200).json(payload)
  } catch (error) {
    res.status(400).json(error)
  }
})

router.get("/cartasTipo", verificaToken, async (_req, res) => {
  try {
    const grouped = await prisma.carta.groupBy({
      by: ["tipo"],
      _count: { tipo: true },
      orderBy: { _count: { tipo: "desc" } },
    })

    const payload = grouped.map((g) => ({
      tipo: g.tipo,
      num: g._count.tipo,
    }))

    res.status(200).json(payload)
  } catch (error) {
    res.status(400).json(error)
  }
})

export default router

