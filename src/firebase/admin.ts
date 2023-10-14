import firebase from '@/firebase/firebase'

import { message } from 'antd'

import { IUserData } from '@/@types/Auth'
import { IAuthenticatedUser } from '@/@types/Admin'

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

// =============================================

interface IAddLink {
  userEmail: string
  link: string
}

const handleAddLinks = async ({
  userEmail,
  link
}: IAddLink): Promise<boolean | string> => {
  try {
    // ----------------------------------

    const userAccountsRef = firebase.database().ref('userAccounts')

    const userQuery = userAccountsRef
      .orderByChild('userEmail')
      .equalTo(userEmail)

    const userQuerySnapshot = await userQuery.get()

    if (userQuerySnapshot.exists()) {
      userQuerySnapshot.forEach((userSnapshot) => {
        userAccountsRef.child(userSnapshot.key).update({ link })
      })

      message.open({
        type: 'success',
        content: 'Cadastro realizado com sucesso'
      })

      return true
    }

    message.open({
      type: 'success',
      content: 'Erro ao adicionar um link para o afiliado'
    })
    return false
  } catch (error: any) {
    message.open({
      type: 'error',
      content: 'Erro ao adicionar um link para o afiliado'
    })
    return false
  }
}

export {
  handleCreateAuthenticatedUser,
  handleAddLinks,
  handleGetAllUsers,
  handleGetAllAuthenticatedUsers
}
