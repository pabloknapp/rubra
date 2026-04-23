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
    }, [])

    // para retornar apenas a data do campo no banco de dados
    // 2024-10-10T22:46:27.227Z => 10/10/2024
    function dataDMA(data: string) {
        const ano = data.substring(0, 4)
        const mes = data.substring(5, 7)
        const dia = data.substring(8, 10)
        return dia + "/" + mes + "/" + ano
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
                {proposta.resposta ?
                    <>
                        <p><b>{proposta.resposta}</b></p>
                        <p><i>Respondido em: {dataDMA(proposta.updatedAt as string)}</i></p>
                    </>
                    :
                    <i>Aguardando...</i>}
            </td>
        </tr>
    ))

    return (
        <section className="max-w-7xl mx-auto">
            <h1 className="mb-8 mt-16 text-2xl  font-extrabold leading-none tracking-tight text-gray-900 md:text-4xl lg:text-4xl">
                Minhas propostas</h1>

            {propostas.length == 0 ?
                <h2 className="mb-4 mt-10 text-2xl font-extrabold leading-none tracking-tight text-gray-900 md:text-4xl">
                   &nbsp;&nbsp; Você ainda não fez nenhuma proposta.
                </h2>
                :
                <table className="w-full text-sm text-left rtl:text-right text-gray-900 border border-gray-200">
                    <thead className="text-xs text-gray-800 font-bold uppercase bg-gray-200">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                Carta
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Imagem
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Proposta
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Resposta
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {propostasTable}
                    </tbody>
                </table>
            }
        </section>
    )
}