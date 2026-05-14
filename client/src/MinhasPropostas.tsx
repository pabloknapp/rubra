import { useEffect, useState } from "react";
import { useClienteStore } from "./context/ClienteContext";
import type { PropostaType } from "./utils/PropostaType";

const apiUrl = import.meta.env.VITE_API_URL

export default function Propostas() {
    const [propostas, setPropostas] = useState<PropostaType[]>([])
    const { cliente } = useClienteStore()

    useEffect(() => {
        async function buscaDados() {
            const response = await fetch(`${apiUrl}/propostas/${cliente.id}`)
            const dados = await response.json()
            setPropostas(dados)
        }
        buscaDados()
    }, [cliente.id])

    // para retornar apenas a data do campo no banco de dados
    // 2024-10-10T22:46:27.227Z => 10/10/2024
    function dataDMA(data: string) {
        const ano = data.substring(0, 4)
        const mes = data.substring(5, 7)
        const dia = data.substring(8, 10)
        return dia + "/" + mes + "/" + ano
    }

    function getStatusColor(status: string) {
        switch (status) {
            case "ACEITA":
                return "bg-green-100 text-green-800"
            case "RECUSADA":
                return "bg-red-100 text-red-800"
            case "PENDENTE":
                return "bg-yellow-100 text-yellow-800"
            default:
                return "bg-gray-100 text-gray-800"
        }
    }

    function getStatusText(status: string) {
        switch (status) {
            case "ACEITA":
                return "✓ Aceita"
            case "RECUSADA":
                return "✗ Recusada"
            case "PENDENTE":
                return "⏳ Pendente"
            default:
                return status
        }
    }

    const propostasTable = propostas.map(proposta => (
        <tr key={proposta.id} className="bg-gray-50 border-b border-gray-400">
            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                <p><b>{proposta.carta.pokemon} ({proposta.carta.colecao?.nome})</b></p>
                <p>R$ {Number(proposta.carta.preco).toLocaleString("pt-br", { minimumFractionDigits: 2 })}</p>
            </th>
            <td className="px-6 py-4">
                <img src={proposta.carta.imagem} className="w-[120px]" alt="Imagem Carta" />
            </td>
            <td className="px-6 py-4">
                <p><b>{proposta.descricao}</b></p>
                <p><i>Enviado em: {dataDMA(proposta.createdAt)}</i></p>
            </td>
            <td className="px-6 py-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium inline-block ${getStatusColor(proposta.status)}`}>
                    {getStatusText(proposta.status)}
                </span>
            </td>
            <td className="px-6 py-4">
                {proposta.resposta ?
                    <>
                        <p><b>{proposta.resposta}</b></p>
                        <p><i>Respondido em: {dataDMA(proposta.updatedAt as string)}</i></p>
                    </>
                    :
                    <i className="text-gray-500">Aguardando resposta...</i>}
            </td>
        </tr>
    ))

    return (
        <div className="min-h-screen bg-slate-50/50 py-12">
            <section className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="flex items-center mb-10">
                    <div className="h-10 w-2 bg-[#A80633] rounded-full mr-4"></div>
                    <h1 className="text-3xl font-black tracking-tight text-slate-900 md:text-4xl">
                        Minhas Propostas
                    </h1>
                </div>

                {propostas.length === 0 ? (
                    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-12 text-center flex flex-col items-center justify-center">
                        <div className="bg-slate-50 p-4 rounded-full mb-4">
                            <svg className="w-12 h-12 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-slate-800 mb-2">Nenhuma proposta encontrada</h2>
                        <p className="text-slate-500 font-medium max-w-md">Você ainda não fez nenhuma proposta em cartas. Explore as cartas em destaque e faça sua primeira oferta!</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-slate-600">
                                <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
                                    <tr>
                                        <th scope="col" className="px-8 py-5 font-bold tracking-wider">Carta</th>
                                        <th scope="col" className="px-8 py-5 font-bold tracking-wider">Sua Proposta</th>
                                        <th scope="col" className="px-8 py-5 font-bold tracking-wider">Status</th>
                                        <th scope="col" className="px-8 py-5 font-bold tracking-wider">Resposta do Vendedor</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {propostas.map(proposta => (
                                        <tr key={proposta.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-20 h-28 bg-slate-50 rounded-lg flex items-center justify-center border border-slate-100 overflow-hidden shrink-0">
                                                        <img src={proposta.carta.imagem} className="object-contain h-full p-2" alt="Imagem Carta" />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-slate-900 text-base mb-1 line-clamp-1">{proposta.carta.pokemon}</p>
                                                        <p className="text-xs font-semibold text-[#A80633] bg-red-50 inline-block px-2 py-0.5 rounded-md mb-2">{proposta.carta.colecao?.nome}</p>
                                                        <p className="font-black text-slate-900">R$ {Number(proposta.carta.preco).toLocaleString("pt-br", { minimumFractionDigits: 2 })}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 align-top">
                                                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                                    <p className="font-medium text-slate-800 mb-2 whitespace-pre-wrap">{proposta.descricao}</p>
                                                    <p className="text-xs text-slate-400 font-medium flex items-center">
                                                        <svg className="w-3.5 h-3.5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                        {dataDMA(proposta.createdAt)}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 align-top">
                                                <span className={`px-3 py-1.5 rounded-lg text-sm font-bold inline-flex items-center shadow-sm ${getStatusColor(proposta.status)}`}>
                                                    {getStatusText(proposta.status)}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6 align-top">
                                                {proposta.resposta ? (
                                                    <div className={`p-4 rounded-xl border ${proposta.status === 'ACEITA' ? 'bg-green-50/50 border-green-100' : proposta.status === 'RECUSADA' ? 'bg-red-50/50 border-red-100' : 'bg-slate-50 border-slate-100'}`}>
                                                        <p className="font-medium text-slate-800 mb-2 whitespace-pre-wrap">{proposta.resposta}</p>
                                                        <p className="text-xs text-slate-400 font-medium flex items-center">
                                                            <svg className="w-3.5 h-3.5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                            </svg>
                                                            {dataDMA(proposta.updatedAt as string)}
                                                        </p>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center text-slate-400 font-medium italic">
                                                        <svg className="w-4 h-4 mr-2 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                                                        </svg>
                                                        Aguardando resposta...
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </section>
        </div>
    )
}