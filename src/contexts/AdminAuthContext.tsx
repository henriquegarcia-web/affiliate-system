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
import { handleGetAdminData, handleLogoutUser } from '@/firebase/auth'

import {
  handleGetAllUsers,
  handleGetAllAuthenticatedUsers,
  handleGetAllWithdrawRequests
} from '@/firebase/admin'

import { IUserData } from '@/@types/Auth'
import { IAuthenticatedUser, IWithdraw } from '@/@types/Admin'

interface AdminAuthContextData {
  userId: string | null
  userData: IUserData | null
  affiliatesList: IUserData[] | null
  authenticatedUsersList: IAuthenticatedUser[] | null
  withdrawsList: IWithdraw[] | null
  isAdminLogged: boolean
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

  const [affiliatesList, setAffiliatesList] = useState<IUserData[] | null>(null)
  const [authenticatedUsersList, setAuthenticatedUsersList] = useState<
    IAuthenticatedUser[] | null
  >(null)
  const [withdrawsList, setWithdrawsList] = useState<IWithdraw[] | null>(null)

  const [isDeletingClientAccount, setIsDeletingClientAccount] =
    useState<boolean>(false)

  const isAdminLogged = useMemo(() => {
    return !!userId
  }, [userId])

  // useEffect(() => {
  //   console.log(authenticatedUsersList)
  // }, [authenticatedUsersList])

  // -----------------------------------------------------------------

  const handleLogout = useCallback(async () => {
    const response = await handleLogoutUser()
    if (!response) return

    setUserId(null)
    setUserData(null)
  }, [])

  const handleDeleteClientAccount = useCallback(
    async (adminPassword: string) => {
      setIsDeletingClientAccount(true)

      // const deleteAccountResponse = await handleDeleteAdminAccount(
      //   adminPassword
      // )

      setIsDeletingClientAccount(false)

      // if (deleteAccountResponse) {
      //   setUserId(null)
      //   setUserData(null)
      //   return true
      // }
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
          // handleLogout()
        }
      })

    return () => unsubscribe()
  }, [])

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

  // -----------------------------------------------------------------

  useEffect(() => {
    const unsubscribe = handleGetAllUsers((affiliates) => {
      setAffiliatesList(affiliates)
    })

    if (unsubscribe) {
      return () => {
        unsubscribe()
      }
    }
  }, [])

  useEffect(() => {
    const unsubscribe = handleGetAllAuthenticatedUsers((authenticatedUsers) => {
      setAuthenticatedUsersList(authenticatedUsers)
    })

    if (unsubscribe) {
      return () => {
        unsubscribe()
      }
    }
  }, [])

  useEffect(() => {
    const unsubscribe = handleGetAllWithdrawRequests((withdraws) => {
      setWithdrawsList(withdraws)
    })

    if (unsubscribe) {
      return () => {
        unsubscribe()
      }
    }
  }, [])

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
      handleDeleteClientAccount,
      affiliatesList,
      authenticatedUsersList,
      withdrawsList
    }
  }, [
    userId,
    userData,
    isAdminLogged,
    isDeletingClientAccount,
    handleLogout,
    handleDeleteClientAccount,
    affiliatesList,
    authenticatedUsersList,
    withdrawsList
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
