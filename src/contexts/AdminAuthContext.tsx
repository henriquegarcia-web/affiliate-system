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
  handleGetAllWithdrawRequests,
  handleGetAllMediaLinks,
  handleGetAllAgreements,
  handleGetApplicationData
} from '@/firebase/admin'

import { IUserData } from '@/@types/Auth'
import {
  IAgreement,
  IAuthenticatedUser,
  IMedia,
  IWithdraw
} from '@/@types/Admin'

interface AdminAuthContextData {
  userId: string | null
  userData: IUserData | null
  affiliatesList: IUserData[] | null
  authenticatedUsersList: IAuthenticatedUser[] | null
  withdrawsList: IWithdraw[] | null
  mediasList: IMedia[] | null
  agreementList: IAgreement[] | null
  applicationData: any | null
  isAdminLogged: boolean

  handleLogout: () => void
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
  const [mediasList, setMediasList] = useState<IMedia[] | null>(null)
  const [agreementList, setAgreementList] = useState<IAgreement[] | null>(null)

  const [applicationData, setApplicationData] = useState<any | null>(null)

  const isAdminLogged = useMemo(() => {
    return !!userId
  }, [userId])

  // -----------------------------------------------------------------

  const handleLogout = useCallback(async () => {
    const response = await handleLogoutUser()
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

  useEffect(() => {
    const unsubscribe = handleGetAllMediaLinks((medias) => {
      setMediasList(medias)
    })

    if (unsubscribe) {
      return () => {
        unsubscribe()
      }
    }
  }, [])

  useEffect(() => {
    const unsubscribe = handleGetAllAgreements((agreements) => {
      setAgreementList(agreements)
    })

    if (unsubscribe) {
      return () => {
        unsubscribe()
      }
    }
  }, [])

  useEffect(() => {
    const unsubscribe = handleGetApplicationData((applicationData) => {
      setApplicationData(applicationData)
    })

    if (unsubscribe) {
      return () => {
        unsubscribe()
      }
    }
  }, [])

  // =================================================================

  const AdminAuthContextValues = useMemo(() => {
    return {
      userId,
      userData,
      isAdminLogged,
      handleLogout,
      affiliatesList,
      authenticatedUsersList,
      withdrawsList,
      mediasList,
      agreementList,
      applicationData
    }
  }, [
    userId,
    userData,
    isAdminLogged,
    handleLogout,
    affiliatesList,
    authenticatedUsersList,
    withdrawsList,
    mediasList,
    agreementList,
    applicationData
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
