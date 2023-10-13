/* eslint-disable @typescript-eslint/no-explicit-any */

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react'

// import { message } from 'antd'

import firebase from '@/firebase/firebase'
import { handleGetAdminData, handleLogoutAdmin } from '@/firebase/auth'

import { IUserData } from '@/@types/Auth'

interface ClientAuthContextData {
  userId: string | null
  userData: IUserData | null
  isClientLogged: boolean

  handleLogout: () => void
}

// ===================================================================

export const ClientAuthContext = createContext<ClientAuthContextData>(
  {} as ClientAuthContextData
)

const ClientAuthProvider = ({ children }: { children: React.ReactNode }) => {
  // =================================================================

  const [userId, setUserId] = useState<string | null>(null)
  const [userData, setUserData] = useState<IUserData | null>(null)

  const isClientLogged = useMemo(() => {
    return !!userId
  }, [userId])

  // -----------------------------------------------------------------

  const handleLogout = useCallback(async () => {
    const response = await handleLogoutAdmin()
    if (!response) return

    setUserId(null)
    setUserData(null)
  }, [])

  // -----------------------------------------------------------------

  useEffect(() => {
    const unsubscribe = firebase
      .auth()
      .onAuthStateChanged(async (user: any) => {
        if (user) {
          const uid = user.uid
          setUserId(uid)
        } else {
          setUserId(null)
          setUserData(null)
          handleLogout()
        }
      })

    return () => unsubscribe()
  }, [handleLogout])

  useEffect(() => {
    const unsubscribe = handleGetAdminData((accountData) => {
      setUserData(accountData)
    })

    if (unsubscribe) {
      return () => {
        unsubscribe()
      }
    }
  }, [userId])

  // =================================================================

  // useEffect(() => {
  //   console.log('LOGADO ======>', isClientLogged, userId)
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [isClientLogged])

  const ClientAuthContextValues = useMemo(() => {
    return {
      userId,
      userData,
      isClientLogged,
      handleLogout
    }
  }, [userId, userData, isClientLogged, handleLogout])

  return (
    <ClientAuthContext.Provider value={ClientAuthContextValues}>
      {children}
    </ClientAuthContext.Provider>
  )
}

function useClientAuth(): ClientAuthContextData {
  const context = useContext(ClientAuthContext)

  if (!context)
    throw new Error('useClientAuth must be used within a UserProvider')

  return context
}

export { ClientAuthProvider, useClientAuth }
