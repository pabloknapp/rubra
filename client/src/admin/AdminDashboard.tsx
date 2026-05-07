import "./AdminDashboard.css"
import { useEffect, useMemo, useState } from "react"
import { VictoryPie, VictoryLabel, VictoryTheme } from "victory"
import type { CartaType } from "../utils/CartaType"
import type { ClienteType } from "../utils/ClienteType"
import type { PropostaType } from "../utils/PropostaType"
import { fetchWithToken } from "./utils/fetchWithToken"

const apiUrl = import.meta.env.VITE_API_URL

type GraficoType = { x: string; y: number }

type GeralDadosType = {
  clientes: number
  cartas: number
  propostas: number
}

export default function AdminDashboard() {
  const [cartas, setCartas] = useState<CartaType[]>([])
  const [clientes, setClientes] = useState<ClienteType[]>([])
  const [propostas, setPropostas] = useState<PropostaType[]>([])

  useEffect(() => {
    async function carregar() {
      const [rCartas, rClientes, rPropostas] = await Promise.all([
        fetchWithToken(`${apiUrl}/cartas`).then((r) => r.json()),
        fetchWithToken(`${apiUrl}/clientes`).then((r) => r.json()),
        fetchWithToken(`${apiUrl}/propostas`).then((r) => r.json()),
      ])
      setCartas(Array.isArray(rCartas) ? rCartas : [])
      setClientes(Array.isArray(rClientes) ? rClientes : [])
      setPropostas(Array.isArray(rPropostas) ? rPropostas : [])
    }
    carregar().catch(() => {
      setCartas([])
      setClientes([])
      setPropostas([])
    })
  }, [])

  const dados: GeralDadosType = useMemo(
    () => ({
      clientes: clientes.length,
      cartas: cartas.length,
      propostas: propostas.length,
    }),
    [clientes.length, cartas.length, propostas.length],
  )

  const cartasPorTipo: GraficoType[] = useMemo(() => {
    const map = new Map<string, number>()
    for (const c of cartas) {
      const key = String(c.tipo ?? "N/A")
      map.set(key, (map.get(key) ?? 0) + 1)
    }
    return [...map.entries()]
      .map(([x, y]) => ({ x, y }))
      .sort((a, b) => b.y - a.y)
      .slice(0, 10)
  }, [cartas])

  const cartasPorColecao: GraficoType[] = useMemo(() => {
    const map = new Map<string, number>()
    for (const c of cartas) {
      const key = String(c.colecao?.nome ?? "Sem coleção")
      map.set(key, (map.get(key) ?? 0) + 1)
    }
    return [...map.entries()]
      .map(([x, y]) => ({ x, y }))
      .sort((a, b) => b.y - a.y)
      .slice(0, 10)
  }, [cartas])

  return (
    <div className="container mt-24">
      <h2 className="text-3xl mb-4 font-bold">Visão Geral do Sistema</h2>

      <div className="w-2/3 flex justify-between mx-auto mb-5">
        <div className="border-[#A80633] border rounded p-6 w-1/3 me-3">
          <span className="bg-[#A80633]/10 text-[#A80633] text-xl text-center font-bold mx-auto block px-2.5 py-5 rounded">
            {dados.clientes}
          </span>
          <p className="font-bold mt-2 text-center">Nº Clientes</p>
        </div>
        <div className="border-gray-700 border rounded p-6 w-1/3 me-3">
          <span className="bg-gray-100 text-gray-800 text-xl text-center font-bold mx-auto block px-2.5 py-5 rounded">
            {dados.cartas}
          </span>
          <p className="font-bold mt-2 text-center">Nº Cartas</p>
        </div>
        <div className="border-green-600 border rounded p-6 w-1/3">
          <span className="bg-green-100 text-green-800 text-xl text-center font-bold mx-auto block px-2.5 py-5 rounded">
            {dados.propostas}
          </span>
          <p className="font-bold mt-2 text-center">Nº Propostas</p>
        </div>
      </div>

      <div className="div-graficos">
        <svg viewBox="0 0 500 500">
          <VictoryPie
            standalone={false}
            width={500}
            height={500}
            data={cartasPorTipo}
            innerRadius={60}
            labelRadius={120}
            theme={VictoryTheme.clean}
            style={{
              labels: { fontSize: 12, fill: "#333", fontFamily: "Arial", fontWeight: "bold" },
            }}
          />
          <VictoryLabel
            textAnchor="middle"
            style={{ fontSize: 16, fill: "#111", fontFamily: "Arial", fontWeight: "bold" }}
            x={250}
            y={250}
            text={["Cartas", "por Tipo"]}
          />
        </svg>

        <svg viewBox="0 0 500 500">
          <VictoryPie
            standalone={false}
            width={500}
            height={500}
            data={cartasPorColecao}
            innerRadius={60}
            labelRadius={120}
            theme={VictoryTheme.clean}
            style={{
              labels: { fontSize: 12, fill: "#333", fontFamily: "Arial", fontWeight: "bold" },
            }}
          />
          <VictoryLabel
            textAnchor="middle"
            style={{ fontSize: 16, fill: "#111", fontFamily: "Arial", fontWeight: "bold" }}
            x={250}
            y={250}
            text={["Cartas", "por Coleção"]}
          />
        </svg>
      </div>
    </div>
  )
}

