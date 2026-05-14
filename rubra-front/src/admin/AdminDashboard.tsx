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
    <div className="pt-20 px-4 sm:px-6 max-w-7xl mx-auto">
      <div className="flex items-center mb-8">
        <div className="h-10 w-2 bg-slate-900 rounded-full mr-4"></div>
        <h2 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900">
          Visão Geral
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#A80633]/5 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-110"></div>
          <div className="relative z-10 flex flex-col items-center">
            <p className="font-bold text-slate-500 uppercase tracking-widest text-xs mb-4">Clientes</p>
            <span className="text-5xl font-black text-slate-800 tracking-tighter mb-2">
              {dados.clientes}
            </span>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#A80633]/5 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-110"></div>
          <div className="relative z-10 flex flex-col items-center">
            <p className="font-bold text-slate-500 uppercase tracking-widest text-xs mb-4">Cartas</p>
            <span className="text-5xl font-black text-slate-800 tracking-tighter mb-2">
              {dados.cartas}
            </span>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#A80633]/5 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-110"></div>
          <div className="relative z-10 flex flex-col items-center">
            <p className="font-bold text-slate-500 uppercase tracking-widest text-xs mb-4">Propostas</p>
            <span className="text-5xl font-black text-slate-800 tracking-tighter mb-2">
              {dados.propostas}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 flex flex-col items-center justify-center">
          <h3 className="text-lg font-bold text-slate-800 mb-4 uppercase tracking-wide">Distribuição por Tipo</h3>
          <div className="w-full max-w-[400px]">
            <svg viewBox="0 0 500 500">
              <VictoryPie
                standalone={false}
                width={500}
                height={500}
                data={cartasPorTipo}
                innerRadius={70}
                labelRadius={130}
                theme={VictoryTheme.clean}
                style={{
                  labels: { fontSize: 14, fill: "#334155", fontFamily: "Inter", fontWeight: "bold" },
                }}
              />
              <VictoryLabel
                textAnchor="middle"
                style={{ fontSize: 18, fill: "#0f172a", fontFamily: "Inter", fontWeight: "900" }}
                x={250}
                y={250}
                text={["Por", "Tipo"]}
              />
            </svg>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 flex flex-col items-center justify-center">
          <h3 className="text-lg font-bold text-slate-800 mb-4 uppercase tracking-wide">Distribuição por Coleção</h3>
          <div className="w-full max-w-[400px]">
            <svg viewBox="0 0 500 500">
              <VictoryPie
                standalone={false}
                width={500}
                height={500}
                data={cartasPorColecao}
                innerRadius={70}
                labelRadius={130}
                theme={VictoryTheme.clean}
                style={{
                  labels: { fontSize: 14, fill: "#334155", fontFamily: "Inter", fontWeight: "bold" },
                }}
              />
              <VictoryLabel
                textAnchor="middle"
                style={{ fontSize: 18, fill: "#0f172a", fontFamily: "Inter", fontWeight: "900" }}
                x={250}
                y={250}
                text={["Por", "Coleção"]}
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}

