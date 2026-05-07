import jwt from "jsonwebtoken"
import type { NextFunction, Response } from "express"

type TokenType = {
  adminLogadoId: string
  adminLogadoNome: string
  adminLogadoNivel: number
}

// Middleware: exige Bearer token (Admin)
export function verificaToken(req: any, res: Response, next: NextFunction) {
  const { authorization } = req.headers

  if (!authorization) {
    res.status(401).json({ erro: "Token não informado" })
    return
  }

  const [, token] = authorization.split(" ")
  if (!token) {
    res.status(401).json({ erro: "Token inválido" })
    return
  }

  try {
    const decode = jwt.verify(token, process.env.JWT_KEY as string) as TokenType
    req.adminLogadoId = decode.adminLogadoId
    req.adminLogadoNome = decode.adminLogadoNome
    req.adminLogadoNivel = decode.adminLogadoNivel
    next()
  } catch (_e) {
    res.status(401).json({ erro: "Token inválido" })
  }
}

