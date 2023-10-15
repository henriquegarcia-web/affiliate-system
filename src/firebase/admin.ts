import firebase from '@/firebase/firebase'

import { message } from 'antd'

import { IUserData } from '@/@types/Auth'
import {
  IAuthenticatedUser,
  IComission,
  ILink,
  IWithdraw
} from '@/@types/Admin'

// ============================================= CREATE AFFILIATE REGISTRATION

const handleCreateAuthenticatedUser = async ({
  userName,
  userEmail
}: IAuthenticatedUser) => {
  try {
    const authenticatedUsersRef = firebase.database().ref('authenticatedUsers')

    const userData = {
      userName: userName,
      userEmail: userEmail
    }

    await authenticatedUsersRef.push(userData)

    message.open({
      type: 'success',
      content: 'Acesso criado com sucesso'
    })

    return true
  } catch (error) {
    console.error('Erro ao salvar usuário autenticado: ', error)
    return false
  }
}

// ============================================= GET ALL USERS

const handleGetAllUsers = (
  callback: (usersData: IUserData[] | null) => void
) => {
  const userAccountsRef = firebase.database().ref('userAccounts')

  const listener = (snapshot: any) => {
    try {
      if (snapshot && snapshot.exists()) {
        const userData = snapshot.val()

        const allUsers: IUserData[] = Object.values(userData)

        callback(allUsers)
      } else {
        callback([])
      }
    } catch (error) {
      message.open({
        type: 'error',
        content: 'Falha ao obter contas de usuário não administradores'
      })
    }
  }

  const offCallback = () => {
    userAccountsRef.off('value', listener)
  }

  userAccountsRef.on('value', listener)

  return offCallback
}

// ============================================= GET ALL AUTHENTICATED USERS

const handleGetAllAuthenticatedUsers = (
  callback: (usersData: IUserData[] | null) => void
) => {
  const userAccountsRef = firebase.database().ref('authenticatedUsers')

  const listener = (snapshot: any) => {
    try {
      if (snapshot && snapshot.exists()) {
        const userData = snapshot.val()

        const allUsers: IUserData[] = Object.values(userData)

        callback(allUsers)
      } else {
        callback([])
      }
    } catch (error) {
      message.open({
        type: 'error',
        content: 'Falha ao obter contas de usuário não administradores'
      })
    }
  }

  const offCallback = () => {
    userAccountsRef.off('value', listener)
  }

  userAccountsRef.on('value', listener)

  return offCallback
}

// ============================================= GET ALL WITHDRAW REQUESTS

const handleGetAllWithdrawRequests = (
  callback: (withdrawData: IWithdraw[] | null) => void
) => {
  const userAccountsRef = firebase.database().ref('userAccounts')

  const listener = (snapshot: any) => {
    try {
      if (snapshot && snapshot.exists()) {
        const userAccountsData = snapshot.val()
        const allWithdrawRequests: IWithdraw[] = []

        for (const userId in userAccountsData) {
          const userData: IUserData = userAccountsData[userId]

          if ('userAffiliateWithdraws' in userData) {
            const withdraws: IWithdraw[] = userData.userAffiliateWithdraws

            for (const withdraw of withdraws) {
              const withdrawWithUserData: IWithdraw = {
                ...withdraw,
                withdrawUser: userData
              }
              allWithdrawRequests.push(withdrawWithUserData)
            }
          }
        }

        callback(allWithdrawRequests)
      } else {
        callback([])
      }
    } catch (error) {
      message.open({
        type: 'error',
        content: 'Falha ao obter solicitações de saque'
      })
    }
  }

  const offCallback = () => {
    userAccountsRef.off('value', listener)
  }

  userAccountsRef.on('value', listener)

  return offCallback
}

// ============================================= UPDATE WITHDRAW REQUEST

interface IUpdateWithdrawStatus {
  withdrawId: string
  newStatus: string
}

const handleUpdateWithdrawStatus = async ({
  withdrawId,
  newStatus
}: IUpdateWithdrawStatus) => {
  try {
    const userAccountsRef = firebase.database().ref('userAccounts')

    let targetUser: any
    let targetWithdrawIndex: number = -1

    const snapshot = await userAccountsRef.once('value')
    const userAccountsData = snapshot.val()

    if (!userAccountsData) {
      throw new Error('Não foi possível encontrar os dados do usuário')
    }

    for (const userId in userAccountsData) {
      const userData = userAccountsData[userId]

      if ('userAffiliateWithdraws' in userData) {
        const withdraws: IWithdraw[] = userData.userAffiliateWithdraws

        for (let i = 0; i < withdraws.length; i++) {
          if (withdraws[i].withdrawId === withdrawId) {
            targetUser = userData
            targetWithdrawIndex = i
            break
          }
        }

        if (targetWithdrawIndex !== -1) {
          break
        }
      }
    }

    if (!targetUser) {
      throw new Error('Solicitação de saque não encontrada')
    }

    targetUser.userAffiliateWithdraws[targetWithdrawIndex].withdrawStatus =
      newStatus

    await userAccountsRef.child(targetUser.userId).set(targetUser)

    message.open({
      type: 'success',
      content: 'Status da solicitação de saque atualizado com sucesso'
    })

    return true
  } catch (error) {
    message.open({
      type: 'error',
      content: 'Erro ao atualizar o status da solicitação de saque'
    })
    return false
  }
}

// ============================================= LINKS

interface IAddLinks {
  userId: string
  linkUrl: string
  linkLabel: string
}

const handleAddLinks = async ({ userId, linkUrl, linkLabel }: IAddLinks) => {
  try {
    const userAccountsRef = firebase.database().ref('userAccounts/' + userId)

    const snapshot = await userAccountsRef.once('value')
    const userData = snapshot.val()

    if (!userData) {
      return false
    }

    if (!('userAffiliateLinks' in userData)) {
      userData.userAffiliateLinks = []
    }

    const linkData: ILink = {
      linkId: userAccountsRef.push().key,
      linkUrl,
      linkLabel
    }

    userData.userAffiliateLinks.push(linkData)

    await userAccountsRef.set(userData)

    message.open({
      type: 'success',
      content: 'Link criado com sucesso'
    })

    return true
  } catch (error) {
    message.open({
      type: 'error',
      content: 'Erro ao criar link'
    })
    return false
  }
}

interface IEditLink {
  userId: string
  linkId: string
  newLinkUrl: string
  newLinkLabel: string
}

const handleEditLink = async ({
  userId,
  linkId,
  newLinkUrl,
  newLinkLabel
}: IEditLink) => {
  try {
    const userAccountsRef = firebase.database().ref('userAccounts/' + userId)

    const snapshot = await userAccountsRef.once('value')
    const userData = snapshot.val()

    if (!userData) {
      return false
    }

    if (!('userAffiliateLinks' in userData)) {
      return false
    }

    const affiliateLinks = userData.userAffiliateLinks
    const linkIndex = affiliateLinks.findIndex((link) => link.linkId === linkId)

    if (linkIndex === -1) {
      return false
    }

    affiliateLinks[linkIndex].linkUrl = newLinkUrl
    affiliateLinks[linkIndex].linkLabel = newLinkLabel

    await userAccountsRef.set(userData)

    message.open({
      type: 'success',
      content: 'Link atualizado com sucesso'
    })

    return true
  } catch (error) {
    message.open({
      type: 'error',
      content: 'Erro ao atualizar o link'
    })
    return false
  }
}

interface IDeleteLink {
  userId: string
  linkId: string
}

const handleDeleteLink = async ({ userId, linkId }: IDeleteLink) => {
  try {
    const userAccountsRef = firebase.database().ref('userAccounts/' + userId)

    const snapshot = await userAccountsRef.once('value')
    const userData = snapshot.val()

    if (!userData) {
      return false
    }

    if (!('userAffiliateLinks' in userData)) {
      return false
    }

    const affiliateLinks = userData.userAffiliateLinks
    const linkIndex = affiliateLinks.findIndex((link) => link.linkId === linkId)

    if (linkIndex === -1) {
      return false
    }

    affiliateLinks.splice(linkIndex, 1)

    await userAccountsRef.set(userData)

    message.open({
      type: 'success',
      content: 'Link excluído com sucesso'
    })

    return true
  } catch (error) {
    message.open({
      type: 'error',
      content: 'Erro ao excluir o link'
    })
    return false
  }
}

// ============================================= COMISSION

interface IAddComission {
  userId: string
  comissionValue: number
}

const handleAddComission = async ({
  userId,
  comissionValue
}: IAddComission) => {
  try {
    const userAccountsRef = firebase.database().ref('userAccounts/' + userId)

    const snapshot = await userAccountsRef.once('value')
    const userData = snapshot.val()

    if (!userData) {
      return false
    }

    if (!('userAffiliateComission' in userData)) {
      userData.userAffiliateComission = []
    }

    const linkData: IComission = {
      comissionId: userAccountsRef.push().key,
      comissionValue,
      comissionRegisteredAt: Date.now()
    }

    userData.userAffiliateComission.push(linkData)

    await userAccountsRef.set(userData)

    message.open({
      type: 'success',
      content: 'Comissão criada com sucesso'
    })

    return true
  } catch (error) {
    message.open({
      type: 'error',
      content: 'Erro ao criar comissão'
    })
    return false
  }
}

interface IDeleteComission {
  userId: string
  comissionId: string
}

const handleDeleteComission = async ({
  userId,
  comissionId
}: IDeleteComission) => {
  try {
    const userAccountsRef = firebase.database().ref('userAccounts/' + userId)

    const snapshot = await userAccountsRef.once('value')
    const userData = snapshot.val()

    if (!userData) {
      return false
    }

    if (!('userAffiliateComission' in userData)) {
      return false
    }

    const affiliateComissions = userData.userAffiliateComission
    const comissionIndex = affiliateComissions.findIndex(
      (comission) => comission.comissionId === comissionId
    )

    if (comissionIndex === -1) {
      return false
    }

    affiliateComissions.splice(comissionIndex, 1)

    await userAccountsRef.set(userData)

    message.open({
      type: 'success',
      content: 'Comissão excluída com sucesso'
    })

    return true
  } catch (error) {
    message.open({
      type: 'error',
      content: 'Erro ao excluir o comissão'
    })
    return false
  }
}

export {
  handleCreateAuthenticatedUser,
  handleAddLinks,
  handleEditLink,
  handleDeleteLink,
  handleAddComission,
  handleDeleteComission,
  handleGetAllUsers,
  handleGetAllAuthenticatedUsers,
  handleGetAllWithdrawRequests,
  handleUpdateWithdrawStatus
}
