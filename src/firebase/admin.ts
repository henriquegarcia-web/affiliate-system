import firebase from '@/firebase/firebase'

import { message } from 'antd'

import { IUserData } from '@/@types/Auth'
import {
  IAgreement,
  IAuthenticatedUser,
  IComission,
  ILink,
  IMedia,
  IWithdraw
} from '@/@types/Admin'

// ============================================= CREATE AFFILIATE REGISTRATION

interface ICreateAuthenticatedUser {
  userName: string
  userEmail: string
  userAgreement: string
}

const handleCreateAuthenticatedUser = async ({
  userName,
  userEmail,
  userAgreement
}: ICreateAuthenticatedUser) => {
  try {
    const authenticatedUsersRef = firebase.database().ref('authenticatedUsers')

    const userData: IAuthenticatedUser = {
      userName: userName,
      userEmail: userEmail,
      userBlocked: false,
      userRegisteredAt: Date.now(),
      userAgreement: userAgreement
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

// ============================================= MEDIAS

interface IAddMedia {
  mediaUrl: string
  mediaLabel: string
}

const handleAddMediaLink = async ({ mediaUrl, mediaLabel }: IAddMedia) => {
  try {
    const mediaLinksRef = firebase.database().ref('application/mediasLinks')

    const newMediaRef = mediaLinksRef.push()

    const mediaData: IMedia = {
      mediaId: newMediaRef.key,
      mediaUrl,
      mediaLabel
    }

    await newMediaRef.set(mediaData)

    message.open({
      type: 'success',
      content: 'Link de mídia criada com sucesso'
    })

    return true
  } catch (error) {
    message.open({
      type: 'error',
      content: 'Erro ao criar link de mídia'
    })
    return false
  }
}

const handleDeleteMediaLink = async (mediaId: string) => {
  try {
    const mediaLinksRef = firebase.database().ref('application/mediasLinks')

    const mediaToDeleteRef = mediaLinksRef.child(mediaId)

    await mediaToDeleteRef.remove()

    message.open({
      type: 'success',
      content: 'Link de mídia excluído com sucesso'
    })

    return true
  } catch (error) {
    message.open({
      type: 'error',
      content: 'Erro ao excluir o link de mídia'
    })

    return false
  }
}

const handleGetAllMediaLinks = (
  callback: (mediaLinks: IMedia[] | null) => void
) => {
  const mediaLinksRef = firebase.database().ref('application/mediasLinks')

  const listener = (snapshot: any) => {
    try {
      if (snapshot && snapshot.exists()) {
        const mediaLinksData = snapshot.val()
        const allMediaLinks: IMedia[] = []

        for (const mediaId in mediaLinksData) {
          const mediaData: IMedia = mediaLinksData[mediaId]
          allMediaLinks.push(mediaData)
        }

        callback(allMediaLinks)
      } else {
        callback([])
      }
    } catch (error) {
      message.open({
        type: 'error',
        content: 'Falha ao obter links de mídia'
      })
    }
  }

  const offCallback = () => {
    mediaLinksRef.off('value', listener)
  }

  mediaLinksRef.on('value', listener)

  return offCallback
}

// ============================================= AGREEMENTS

interface IAddAgreement {
  agreementCta: number
  agreementLabel: string
}

const handleAddAgreement = async ({
  agreementCta,
  agreementLabel
}: IAddAgreement) => {
  try {
    const agreementsRef = firebase.database().ref('application/agreements')

    const newMediaRef = agreementsRef.push()

    const mediaData: IAgreement = {
      agreementId: newMediaRef.key,
      agreementCta,
      agreementLabel
    }

    await newMediaRef.set(mediaData)

    message.open({
      type: 'success',
      content: 'Acordo criado com sucesso'
    })

    return true
  } catch (error) {
    message.open({
      type: 'error',
      content: 'Erro ao criar acordo'
    })
    return false
  }
}

const handleDeleteAgreement = async (agreementId: string) => {
  try {
    const agreementsRef = firebase.database().ref('application/agreements')

    const userAccountsRef = firebase.database().ref('userAccounts')
    const userQuery = userAccountsRef
      .orderByChild('userAgreement')
      .equalTo(agreementId)
    const userQuerySnapshot = await userQuery.get()

    if (userQuerySnapshot.exists()) {
      message.open({
        type: 'error',
        content:
          'Este acordo está associado a pelo menos um usuário e não pode ser excluído'
      })
      return false
    }

    const mediaToDeleteRef = agreementsRef.child(agreementId)
    await mediaToDeleteRef.remove()

    message.open({
      type: 'success',
      content: 'Acordo deletado com sucesso'
    })

    return true
  } catch (error) {
    message.open({
      type: 'error',
      content: 'Falha ao deletar acordo'
    })

    return false
  }
}

const handleGetAllAgreements = (
  callback: (agreements: IAgreement[] | null) => void
) => {
  const agreementsRef = firebase.database().ref('application/agreements')

  const listener = (snapshot: any) => {
    try {
      if (snapshot && snapshot.exists()) {
        const agreementsData = snapshot.val()
        const allMediaLinks: IAgreement[] = []

        for (const mediaId in agreementsData) {
          const mediaData: IAgreement = agreementsData[mediaId]
          allMediaLinks.push(mediaData)
        }

        callback(allMediaLinks)
      } else {
        callback([])
      }
    } catch (error) {
      message.open({
        type: 'error',
        content: 'Falha ao obter os acordos'
      })
    }
  }

  const offCallback = () => {
    agreementsRef.off('value', listener)
  }

  agreementsRef.on('value', listener)

  return offCallback
}

const handleGetApplicationData = (callback: (data: any | null) => void) => {
  const applicationRef = firebase.database().ref('application')

  const listener = (snapshot: any) => {
    try {
      if (snapshot && snapshot.exists()) {
        const applicationData = snapshot.val()
        callback(applicationData)
      } else {
        callback(null)
      }
    } catch (error) {
      message.open({
        type: 'error',
        content: 'Falha ao obter os dados da aplicação'
      })
    }
  }

  const offCallback = () => {
    applicationRef.off('value', listener)
  }

  applicationRef.on('value', listener)

  return offCallback
}

interface IUpdateUserAgreement {
  userId: string
  agreementId: string
}

const handleUpdateUserAgreement = async ({
  userId,
  agreementId
}: IUpdateUserAgreement) => {
  try {
    const userAccountsRef = firebase.database().ref('userAccounts/' + userId)

    const snapshot = await userAccountsRef.once('value')
    const userData = snapshot.val()

    userData.userAgreement = agreementId

    await userAccountsRef.set(userData)

    message.open({
      type: 'success',
      content: 'Acordo do usuário atualizado com sucesso'
    })

    return true
  } catch (error) {
    message.open({
      type: 'error',
      content: 'Falha ao atualizar acordo do usuário'
    })

    return false
  }
}

// ============================================== HANDLE BLOCK ACCOUNT

interface IBlockUser {
  userId: string
  userEmail: string
  userBlocked: boolean
}

const handleBlockUser = async ({
  userId,
  userEmail,
  userBlocked
}: IBlockUser) => {
  try {
    const authenticatedUsersRef = firebase.database().ref('authenticatedUsers')
    const usersRef = firebase.database().ref('userAccounts')

    const authenticatedUserQuery = authenticatedUsersRef
      .orderByChild('userEmail')
      .equalTo(userEmail)
    const authenticatedUserQuerySnapshot = await authenticatedUserQuery.get()
    const authenticatedUserData = authenticatedUserQuerySnapshot.val()

    const userQuery = usersRef.orderByKey().equalTo(userId)
    const userQuerySnapshot = await userQuery.get()
    const userSnapshot = userQuerySnapshot.val()

    if (!userSnapshot || !authenticatedUserData) {
      message.open({
        type: 'error',
        content: 'Usuário não encontrado'
      })
      return false
    }

    const authenticatedUserKey = Object.keys(authenticatedUserData)[0]
    authenticatedUserData[authenticatedUserKey].userBlocked = userBlocked

    const userKey = Object.keys(userSnapshot)[0]
    userSnapshot[userKey].userBlocked = userBlocked

    await authenticatedUsersRef
      .child(authenticatedUserKey)
      .set(authenticatedUserData[authenticatedUserKey])

    await usersRef.child(userKey).set(userSnapshot[userKey])

    const messageType = userBlocked ? 'bloqueado' : 'liberado'

    message.open({
      type: 'success',
      content: `Usuário ${messageType} com sucesso`
    })

    return true
  } catch (error) {
    message.open({
      type: 'error',
      content: 'Falha ao atualizar o status de bloqueio do usuário'
    })
    return false
  }
}

// ============================================= DELETE AUTHENTICATED USER

interface IBlockAuthenticatedUser {
  userEmail: string
  userBlocked: boolean
}

const handleBlockAuthenticatedUser = async ({
  userEmail,
  userBlocked
}: IBlockAuthenticatedUser) => {
  try {
    const authenticatedUsersRef = firebase.database().ref('authenticatedUsers')
    const usersRef = firebase.database().ref('userAccounts')

    const snapshotAuthenticatedUser = await authenticatedUsersRef
      .orderByChild('userEmail')
      .equalTo(userEmail)
      .once('value')

    const snapshotUser = await usersRef
      .orderByChild('userEmail')
      .equalTo(userEmail)
      .once('value')

    const authenticatedUserData = snapshotAuthenticatedUser.val()
    const userSnapshot = snapshotUser.val()

    if (!authenticatedUserData) {
      message.open({
        type: 'error',
        content: 'Usuário não encontrado'
      })
      return false
    }

    const authenticatedUserKey = Object.keys(authenticatedUserData)[0]

    authenticatedUserData[authenticatedUserKey].userBlocked = userBlocked

    await authenticatedUsersRef
      .child(authenticatedUserKey)
      .set(authenticatedUserData[authenticatedUserKey])

    if (!userSnapshot) {
      const messageType = userBlocked ? 'bloqueado' : 'liberado'

      message.open({
        type: 'success',
        content: `Usuário ${messageType} com sucesso`
      })
      return false
    }

    const userKey = Object.keys(userSnapshot)[0]

    userSnapshot[userKey].userBlocked = userBlocked

    await usersRef.child(userKey).set(userSnapshot[userKey])

    const messageType = userBlocked ? 'bloqueado' : 'liberado'

    message.open({
      type: 'success',
      content: `Usuário ${messageType} com sucesso`
    })

    return true
  } catch (error) {
    message.open({
      type: 'error',
      content: 'Erro ao excluir o acesso de usuário autenticado'
    })

    return false
  }
}

// ============================================= UPDATE SETTINGS

interface IUpdateColor {
  appColor: string
}

const handleUpdateApplicationColor = async ({ appColor }: IUpdateColor) => {
  try {
    const mediaLinksRef = firebase.database().ref('application/appColor')

    mediaLinksRef.set(appColor)

    message.open({
      type: 'success',
      content: 'Cor da aplicação alterada com sucesso'
    })

    return true
  } catch (error) {
    message.open({
      type: 'error',
      content: 'Erro ao alterar cor da aplicação'
    })
    return false
  }
}

interface IUpdateMaintanceStatus {
  appMaintanceStatus: boolean
}

const handleUpdateApplicationMaintanceStatus = async ({
  appMaintanceStatus
}: IUpdateMaintanceStatus) => {
  try {
    const mediaLinksRef = firebase
      .database()
      .ref('application/appMaintanceStatus')

    mediaLinksRef.set(appMaintanceStatus)

    message.open({
      type: 'success',
      content: 'Status da aplicação alterada com sucesso'
    })

    return true
  } catch (error) {
    message.open({
      type: 'error',
      content: 'Erro ao alterar status da aplicação'
    })
    return false
  }
}

interface IUpdateApplicationPics {
  companyLogo: string
  companyFlaticon: string
}

const handleUpdateApplicationPics = async ({
  companyLogo,
  companyFlaticon
}: IUpdateApplicationPics) => {
  try {
    const mediaLinksRef = firebase.database().ref('application/appPics')

    const applicationPics = {
      companyLogo,
      companyFlaticon
    }

    mediaLinksRef.set(applicationPics)

    message.open({
      type: 'success',
      content: 'Imagens da aplicação alterada com sucesso'
    })

    return true
  } catch (error) {
    message.open({
      type: 'error',
      content: 'Erro ao alterar imagens da aplicação'
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
  handleAddMediaLink,
  handleDeleteMediaLink,
  handleGetAllMediaLinks,
  handleGetAllUsers,
  handleGetAllAuthenticatedUsers,
  handleGetAllWithdrawRequests,
  handleUpdateWithdrawStatus,
  handleBlockUser,
  handleBlockAuthenticatedUser,
  handleAddAgreement,
  handleDeleteAgreement,
  handleGetAllAgreements,
  handleUpdateUserAgreement,
  handleGetApplicationData,
  handleUpdateApplicationColor,
  handleUpdateApplicationMaintanceStatus,
  handleUpdateApplicationPics
}
