import type { AdminType } from "../../utils/AdminType"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

type AdminStore = {
  admin: AdminType & { token?: string }
  logaAdmin: (adminLogado: AdminType & { token?: string }) => void
  deslogaAdmin: () => void
  getToken: () => string | undefined
}

export const useAdminStore = create<AdminStore>()(
  persist(
    (set, get) => ({
      admin: {} as AdminType & { token?: string },
      logaAdmin: (adminLogado) => set({ admin: adminLogado }),
      deslogaAdmin: () => {
        set({ admin: {} as AdminType & { token?: string } })
        useAdminStore.persist.clearStorage()
      },
      getToken: () => get().admin.token,
    }),
    {
      name: "rubra-admin",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ admin: state.admin }),
    },
  ),
)

