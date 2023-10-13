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
import {
  handleDeleteAdminAccount,
  handleGetAdminData,
  handleLogoutAdmin
} from '@/firebase/auth'

import { IUserData } from '@/@types/Auth'

interface AdminAuthContextData {
  userId: string | null
  userData: IUserData | null
  isAdminLogged: boolean
  // isAdminPremium: boolean
  isDeletingClientAccount: boolean

  handleLogout: () => void
  handleDeleteClientAccount: (adminPassword: string) => Promise<boolean>
}

// ===================================================================

export const AdminAuthContext = createContext<AdminAuthContextData>(
  {} as AdminAuthContextData
)

const AdminAuthProvider = ({ children }: { children: React.ReactNode }) => {
  // =================================================================

  const [userId, setUserId] = useState<string | null>(null)
  const [userData, setUserData] = useState<IUserData | null>(null)

  const [isDeletingClientAccount, setIsDeletingClientAccount] =
    useState<boolean>(false)

  const isAdminLogged = useMemo(() => {
    return !!userId
  }, [userId])

  // const isAdminPremium = useMemo(() => {
  //   return (
  //     !!userData &&
  //     (userData.adminSubscription?.planType === 'monthly_plan' ||
  //       userData.adminSubscription?.planType === 'annual_plan' ||
  //       userData.adminSubscription?.planType === 'lifetime_plan')
  //   )
  // }, [userData])

  // -----------------------------------------------------------------

  const handleLogout = useCallback(async () => {
    const response = await handleLogoutAdmin()
    if (!response) return

    setUserId(null)
    setUserData(null)
  }, [])

  const handleDeleteClientAccount = useCallback(
    async (adminPassword: string) => {
      setIsDeletingClientAccount(true)

      const deleteAccountResponse = await handleDeleteAdminAccount(
        adminPassword
      )

      setIsDeletingClientAccount(false)

      if (deleteAccountResponse) {
        setUserId(null)
        setUserData(null)
        return true
      }
      return false
    },
    []
  )

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
  //   console.log('LOGADO ======>', isAdminLogged, userId)
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [isAdminLogged])

  const AdminAuthContextValues = useMemo(() => {
    return {
      userId,
      userData,
      isAdminLogged,
      isDeletingClientAccount,
      handleLogout,
      handleDeleteClientAccount
    }
  }, [
    userId,
    userData,
    isAdminLogged,
    isDeletingClientAccount,
    handleLogout,
    handleDeleteClientAccount
  ])

  return (
    <AdminAuthContext.Provider value={AdminAuthContextValues}>
      {children}
    </AdminAuthContext.Provider>
  )
}

function useAdminAuth(): AdminAuthContextData {
  const context = useContext(AdminAuthContext)

  if (!context)
    throw new Error('useAdminAuth must be used within a UserProvider')

  return context
}

export { AdminAuthProvider, useAdminAuth }
