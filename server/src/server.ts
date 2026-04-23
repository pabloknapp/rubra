import express from 'express'
import cors from 'cors'

import routesColecoes from './routes/colecoes'
import routesCartas from './routes/cartas'
import routesClientes from './routes/clientes'
import routesLogin from './routes/login'
import routesPropostas from './routes/propostas'

const app = express()
const port = 3000

app.use(express.json())
app.use(cors())

app.use("/colecoes", routesColecoes)
app.use("/cartas", routesCartas)
app.use("/clientes", routesClientes)
app.use("/clientes/login", routesLogin)
app.use("/propostas", routesPropostas)

app.get('/', (req, res) => {
  res.send('API: Cartas Pokémon')
})

app.listen(port, () => {
  console.log(`Servidor rodando na porta: ${port}`)
})