import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import { Router } from "express"
import { prisma } from "../../lib/prisma"

const router = Router()

router.post("/", async (req, res) => {
  const { email, senha } = req.body

  const mensaPadrao = "Login ou senha incorretos"

  if (!process.env.JWT_KEY) {
    res.status(500).json({ erro: "JWT_KEY não configurada no servidor" })
    return
  }

  if (!email || !senha) {
    res.status(400).json({ erro: mensaPadrao })
    return
  }

  try {
    const admin = await prisma.admin.findFirst({ where: { email } })
    if (!admin) {
      res.status(400).json({ erro: mensaPadrao })
      return
    }

    if (!bcrypt.compareSync(senha, admin.senha)) {
      res.status(400).json({ erro: mensaPadrao })
      return
    }

    const token = jwt.sign(
      {
        adminLogadoId: admin.id,
        adminLogadoNome: admin.nome,
        adminLogadoNivel: admin.nivel,
      },
      process.env.JWT_KEY,
      { expiresIn: "1h" },
    )

    res.status(200).json({
      id: admin.id,
      nome: admin.nome,
      email: admin.email,
      nivel: admin.nivel,
      token,
    })
  } catch (error) {
    res.status(400).json(error)
  }
})

export default router

