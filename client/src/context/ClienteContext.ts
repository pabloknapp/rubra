import type { ClienteType } from '../utils/ClienteType'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

type ClienteComToken = ClienteType & { token?: string }

type ClienteStore = {
    cliente: ClienteType
    token?: string
    loading: boolean
    error?: string
    logaCliente: (clienteLogado: ClienteType) => void
    deslogaCliente: () => void
    login: (params: { email: string; senha: string; manter: boolean }) => Promise<boolean>
    cadastro: (params: { nome: string; email: string; senha: string }) => Promise<boolean>
    limpaErro: () => void
}

const apiUrl = import.meta.env.VITE_API_URL

export const useClienteStore = create<ClienteStore>()(
    persist(
        (set) => ({
            cliente: {} as ClienteType,
            token: undefined,
            loading: false,
            error: undefined,

            limpaErro: () => set({ error: undefined }),

            logaCliente: (clienteLogado) => set({ cliente: clienteLogado }),

            deslogaCliente: () => {
                set({ cliente: {} as ClienteType, token: undefined, loading: false, error: undefined })
                useClienteStore.persist.clearStorage()
            },

            login: async ({ email, senha, manter }) => {
                set({ loading: true, error: undefined })
                try {
                    const response = await fetch(`${apiUrl}/clientes/login`, {
                        headers: { 'Content-Type': 'application/json' },
                        method: 'POST',
                        body: JSON.stringify({ email, senha }),
                    })

                    if (!response.ok) {
                        const data = await response.json().catch(() => null)
                        const message = data?.erro ?? 'Login ou senha incorretos'
                        set({ loading: false, error: message })
                        return false
                    }

                    const data = (await response.json()) as ClienteComToken

                    set({
                        cliente: { id: data.id, nome: data.nome, email: data.email },
                        token: data.token,
                        loading: false,
                        error: undefined,
                    })

                    // Se não for pra manter conectado, não persiste (vale só nesta sessão).
                    if (!manter) {
                        useClienteStore.persist.clearStorage()
                    }

                    return true
                } catch (e) {
                    set({ loading: false, error: 'Erro ao conectar na API' })
                    return false
                }
            },

            cadastro: async ({ nome, email, senha }) => {
                set({ loading: true, error: undefined })
                try {
                    const response = await fetch(`${apiUrl}/clientes`, {
                        headers: { 'Content-Type': 'application/json' },
                        method: 'POST',
                        body: JSON.stringify({ nome, email, senha }),
                    })

                    if (response.status === 201) {
                        set({ loading: false })
                        return true
                    }

                    const data = await response.json().catch(() => null)
                    const message = data?.erro ?? 'Erro ao cadastrar'
                    set({ loading: false, error: message })
                    return false
                } catch (e) {
                    set({ loading: false, error: 'Erro ao conectar na API' })
                    return false
                }
            },
        }),
        {
            name: 'rubra-auth',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({ cliente: state.cliente, token: state.token }),
        },
    ),
)