import { prisma } from "../../lib/prisma"
import { Router } from "express"
import { z } from 'zod'
import { verificaToken } from "../middlewares/verificaToken"

const router = Router()

const propostaSchema = z.object({
  clienteId: z.string(),
  cartaId: z.number(),
  descricao: z.string().min(10,
    { message: "Descrição da Proposta deve possuir, no mínimo, 10 caracteres" }),
})

const propostaRespostaSchema = z.object({
  resposta: z.string().min(3, { message: "Resposta deve possuir, no mínimo, 3 caracteres" }),
  status: z.enum(["ACEITA", "RECUSADA", "PENDENTE"]).optional(),
})

router.get("/", async (req, res) => {
  try {
    const propostas = await prisma.proposta.findMany({
      include: {
        cliente: true,
        carta: {
          include: { colecao: true }
        },
      },
      orderBy: { id: 'desc'}
    })
    res.status(200).json(propostas)
  } catch (error) {
    res.status(400).json(error)
  }
})

router.post("/", async (req, res) => {

  const valida = propostaSchema.safeParse(req.body)
  if (!valida.success) {
    res.status(400).json({ erro: valida.error })
    return
  }  
  const { clienteId, cartaId, descricao } = valida.data

  try {
    const proposta = await prisma.proposta.create({
      data: { clienteId, cartaId, descricao }
    })
    res.status(201).json(proposta)
  } catch (error) {
    res.status(400).json(error)
  }
})

router.get("/:clienteId", async (req, res) => {
  const { clienteId } = req.params
  try {
    const propostas = await prisma.proposta.findMany({
      where: { clienteId },
      include: {
        carta: { include: { colecao: true } }
      }
    })
    res.status(200).json(propostas)
  } catch (error) {
    res.status(400).json(error)
  }
})

// Admin: responder proposta
router.patch("/:id", verificaToken, async (req, res) => {
  const { id } = req.params

  const valida = propostaRespostaSchema.safeParse(req.body)
  if (!valida.success) {
    res.status(400).json({ erro: valida.error })
    return
  }

  const { resposta, status } = valida.data

  try {
    const proposta = await prisma.proposta.update({
      where: { id: Number(id) },
      data: { resposta, status: status ?? undefined },
    })
    res.status(200).json(proposta)
  } catch (error) {
    res.status(400).json(error)
  }
})

// Admin: excluir proposta
router.delete("/:id", verificaToken, async (req: any, res) => {
  const { id } = req.params

  // segurança simples por nível
  if ((req.adminLogadoNivel ?? 0) < 2) {
    res.status(403).json({ erro: "Sem permissão" })
    return
  }

  try {
    const proposta = await prisma.proposta.delete({ where: { id: Number(id) } })
    res.status(200).json(proposta)
  } catch (error) {
    res.status(400).json({ erro: error })
  }
})

export default router