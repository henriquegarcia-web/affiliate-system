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
import { handleGetUserData, handleLogoutUser } from '@/firebase/auth'
import {
  handleGetAllAgreements,
  handleGetAllMediaLinks
} from '@/firebase/admin'

import { IUserData } from '@/@types/Auth'
import { IAgreement, IMedia } from '@/@types/Admin'

interface ClientAuthContextData {
  userId: string | null
  userData: IUserData | null
  isClientLogged: boolean
  formattedComissions: any
  formattedTotal: any
  labels: any
  userBalance: any
  mediasList: IMedia[] | null
  agreementList: IAgreement[] | null
  withdrawAvailability: any

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

  const [mediasList, setMediasList] = useState<IMedia[] | null>(null)
  const [agreementList, setAgreementList] = useState<IAgreement[] | null>(null)

  const isClientLogged = useMemo(() => {
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
    const unsubscribe = handleGetUserData((accountData) => {
      setUserData(accountData)
    })

    if (unsubscribe) {
      return () => {
        unsubscribe()
      }
    }
  }, [userId])

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

  // =================================================================

  const formattedComissions: any = useMemo(() => {
    if (!agreementList || !userData) return {}

    const item: any = agreementList.find(
      (item) => item.agreementId === userData?.userAgreement
    )

    const agreementValue = item.agreementCta

    return (
      formatarComissoes(userData?.userAffiliateComission, agreementValue) || {}
    )
  }, [agreementList, userData])

  const formattedTotal: any = useMemo(() => {
    return somarTotaisAnuais(formattedComissions) || {}
  }, [formattedComissions])

  const dadosOrdenados = Object.entries(formattedComissions)?.map(
    ([mes, dados]: any) => ({
      mes,
      totalFaturado: dados.totalFaturado,
      totalComissao: dados.totalComissao
    })
  )

  dadosOrdenados.sort((a, b) => a.mes.localeCompare(b.mes))

  const labels = dadosOrdenados.map((item) => item.mes)

  // -------------------------------

  const userBalance = useMemo(() => {
    if (!userData?.userAffiliateWithdraws)
      return formattedTotal.totalFaturadoAnual

    const totalWithdraws = userData?.userAffiliateWithdraws
      .filter((withdraw) => withdraw.withdrawStatus !== 'finished')
      .reduce((acc, withdraw) => acc + parseFloat(withdraw.withdrawAmount), 0)

    const saldo = formattedTotal.totalFaturadoAnual - totalWithdraws

    return saldo
  }, [userData, formattedTotal])

  const withdrawAvailability = useMemo(() => {
    if (!userData) return { available: true, daysRemaining: 0 }
    if (!userData?.userAffiliateWithdraws)
      return { available: true, daysRemaining: 0 }

    const withdraws = userData?.userAffiliateWithdraws

    const now = Date.now()
    const lastWithdraw =
      withdraws.length > 0 ? withdraws[withdraws.length - 1] : null

    if (!lastWithdraw) {
      return { available: true, daysRemaining: 0 }
    }

    const lastWithdrawDate = lastWithdraw.withdrawRegisteredAt
    const timeDifference = now - lastWithdrawDate
    const daysRemaining = Math.ceil(
      (7 * 24 * 60 * 60 * 1000 - timeDifference) / (24 * 60 * 60 * 1000)
    )

    return {
      available: daysRemaining <= 0,
      daysRemaining: daysRemaining > 0 ? daysRemaining : 0
    }
  }, [userData])

  const ClientAuthContextValues = useMemo(() => {
    return {
      userId,
      userData,
      isClientLogged,
      handleLogout,
      formattedComissions,
      formattedTotal,
      labels,
      userBalance,
      mediasList,
      agreementList,
      withdrawAvailability
    }
  }, [
    userId,
    userData,
    isClientLogged,
    handleLogout,
    formattedComissions,
    formattedTotal,
    labels,
    userBalance,
    mediasList,
    agreementList,
    withdrawAvailability
  ])

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

function formatarComissoes(comissoes, agreementValue) {
  if (!comissoes) return

  const comissoesFormatadas = {}

  comissoes.forEach((comissao) => {
    const data = new Date(comissao.comissionRegisteredAt)
    const mesAno = data.getFullYear() + '-' + (data.getMonth() + 1)

    if (!comissoesFormatadas[mesAno]) {
      comissoesFormatadas[mesAno] = {
        totalComissao: 0,
        totalFaturado: 0
      }
    }

    const valorComissao = parseFloat(comissao.comissionValue)
    comissoesFormatadas[mesAno].totalComissao += valorComissao
    comissoesFormatadas[mesAno].totalFaturado += valorComissao * agreementValue
  })

  const mesesComValores = Object.keys(comissoesFormatadas)
  const mesAtual = new Date()
  const anoAtual = mesAtual.getFullYear()
  const mesFormatado = (mesAtual.getMonth() + 1).toString().padStart(2, '0')

  for (let ano = 2023; ano <= anoAtual; ano++) {
    for (let mes = 1; mes <= 12; mes++) {
      // const mesAno = ano + '-' + mes.toString().padStart(2, '0')
      const mesAno = ano + '-' + mes.toString().padStart(2, '0')
      if (!mesesComValores.includes(mesAno)) {
        comissoesFormatadas[mesAno] = {
          totalComissao: 0,
          totalFaturado: 0
        }
      }
    }
  }

  return comissoesFormatadas
}

function somarTotaisAnuais(comissoesAgrupadas) {
  let totalComissaoAnual = 0
  let totalFaturadoAnual = 0

  for (const mesAno in comissoesAgrupadas) {
    totalComissaoAnual += comissoesAgrupadas[mesAno].totalComissao
    totalFaturadoAnual += comissoesAgrupadas[mesAno].totalFaturado
  }

  return {
    totalComissaoAnual,
    totalFaturadoAnual
  }
}
