import firebase from '@/firebase/firebase'

import { handleTranslateFbError } from '@/utils/functions/firebaseTranslateErrors'

import { message } from 'antd'

import {
  ISigninUser,
  ISignupUser,
  ISigninAdmin,
  IUserData
} from '@/@types/Auth'

// ============================================== CREATE USER DATA

const createUserAccount = async (userData: IUserData): Promise<boolean> => {
  try {
    const userAccountsRef = firebase
      .database()
      .ref('userAccounts/' + userData.userId)

    await userAccountsRef.set(userData)

    return true
  } catch (error) {
    message.open({
      type: 'error',
      content: 'Falha ao salvar credenciais'
    })
    return false
  }
}

// ============================================== LOGIN USER

const handleSigninUser = async ({
  userEmail,
  userPassword
}: ISigninUser): Promise<boolean> => {
  try {
    const userAccountsRef = firebase.database().ref('userAccounts')

    const userQuery = userAccountsRef
      .orderByChild('userEmail')
      .equalTo(userEmail)

    const userQuerySnapshot = await userQuery.get()

    if (userQuerySnapshot.exists()) {
      const userData: any = Object.values(userQuerySnapshot.val())[0]

      if (userData?.userBlocked) {
        message.open({
          type: 'error',
          content: 'Sua conta está bloqueada. Entre em contato com o suporte.'
        })
        return false
      }
    }

    await firebase.auth().signInWithEmailAndPassword(userEmail, userPassword)

    return true
  } catch (error: any) {
    const errorCode = error.code

    const userAccountsRef = firebase.database().ref('authenticatedUsers')

    const userQuery = userAccountsRef
      .orderByChild('userEmail')
      .equalTo(userEmail)

    const userQuerySnapshot = await userQuery.get()

    if (userQuerySnapshot.exists()) {
      message.open({
        type: 'warning',
        content: 'Para acessar sua conta, cadastre uma senha em primeiro acesso'
      })
      return false
    }

    message.open({
      type: 'error',
      content: 'Você não possuí o acesso liberado à plataforma'
    })

    return false
  }
}

// ============================================== REGISTER USER

const handleSignupUser = async ({
  userEmail,
  userPassword
}: ISignupUser): Promise<boolean | string> => {
  try {
    // ----------------------------------

    const authenticatedUsersRef = firebase.database().ref('authenticatedUsers')
    const userAccountsRef = firebase.database().ref('userAccounts')

    const userAuthenticationQuery = authenticatedUsersRef
      .orderByChild('userEmail')
      .equalTo(userEmail)

    const userQuery = userAccountsRef
      .orderByChild('userEmail')
      .equalTo(userEmail)

    const userAuthenticationQuerySnapshot = await userAuthenticationQuery.get()
    const userQuerySnapshot = await userQuery.get()

    if (!userAuthenticationQuerySnapshot.exists()) {
      message.open({
        type: 'warning',
        content: 'Esse e-mail não está disponível para cadastro'
      })
      return false
    }

    if (userQuerySnapshot.exists()) {
      message.open({
        type: 'warning',
        content:
          'Essa conta já possui cadastro, faça login para acessar o sistema'
      })
      return false
    }

    const userAuthenticatedData = userAuthenticationQuerySnapshot.val()
    const userId = Object.keys(userAuthenticatedData)[0]

    const { userName, userAgreement, userBlocked } =
      userAuthenticatedData[userId]

    if (userBlocked) {
      message.open({
        type: 'warning',
        content:
          'Sua conta está bloqueada. Entre em contato para obter assistência.'
      })
      return false
    }

    // ----------------------------------

    const userCredential = await firebase
      .auth()
      .createUserWithEmailAndPassword(userEmail, userPassword)

    if (userCredential.user) {
      await userCredential.user.updateProfile({
        displayName: userName
      })

      const userData: IUserData = {
        userId: userCredential.user.uid,
        userName: userName,
        userEmail: userEmail,
        userRegisteredAt: Date.now(),
        userAffiliateLinks: [],
        userAffiliateComission: [],
        userAffiliateWithdraws: [],
        userBlocked: false,
        userAgreement: userAgreement,
        userUsdtKey: ''
      }

      const userDataResponse = await createUserAccount(userData)

      if (!userDataResponse) {
        message.open({
          type: 'error',
          content: 'Falha ao realizar o cadastro. Por favor, tente novamente.'
        })

        const user = firebase.auth().currentUser
        if (user) {
          await user.delete()
        }

        return false
      }

      message.open({
        type: 'success',
        content: 'Conta criada com sucesso'
      })
      return true
    }

    message.open({
      type: 'error',
      content: 'Erro ao realizar o cadastro'
    })
    return false
  } catch (error: any) {
    const errorCode = error.code

    const translatedError = handleTranslateFbError(errorCode)

    message.open({
      type: 'error',
      content:
        translatedError !== null
          ? translatedError
          : 'Erro ao realizar o cadastro'
    })
    return false
  }
}

// ============================================== LOGIN ADMIN

const handleSigninAdmin = async ({
  adminEmail,
  adminPassword
}: ISigninAdmin): Promise<boolean> => {
  try {
    const adminAccountsRef = firebase.database().ref('adminAccounts')

    const adminQuery = adminAccountsRef
      .orderByChild('userEmail')
      .equalTo(adminEmail)
      .once('value')

    const adminQuerySnapshot = await adminQuery

    if (!adminQuerySnapshot.exists()) {
      message.open({
        type: 'error',
        content: 'Usuário não é um administrador'
      })
      return false
    }

    await firebase.auth().signInWithEmailAndPassword(adminEmail, adminPassword)

    return true
  } catch (error: any) {
    const errorCode = error.code
    const traslatedError = handleTranslateFbError(errorCode)

    message.open({
      type: 'error',
      content:
        traslatedError !== null ? traslatedError : 'Erro ao realizar login'
    })
    return false
  }
}

// ============================================== LOGOUT

const handleLogoutUser = async (): Promise<boolean> => {
  try {
    await firebase.auth().signOut()

    return true
  } catch (error: any) {
    message.open({
      type: 'error',
      content: 'Falha ao fazer logout'
    })

    return false
  }
}

// ============================================== HANDLE GET USER DATA

const handleGetUserData = (
  callback: (accountData: IUserData | null) => void
) => {
  const user = firebase.auth().currentUser

  if (!user) {
    callback(null)
    return
  }

  const usersRef = firebase.database().ref('userAccounts/' + user.uid)

  const listener = (snapshot: any) => {
    try {
      if (snapshot && snapshot.exists()) {
        const companyData = snapshot.val()
        callback(companyData)
      } else {
        callback(null)
      }
    } catch (error) {
      message.open({
        type: 'error',
        content: 'Falha ao obter dados do usuário'
      })
    }
  }

  const offCallback = () => {
    usersRef.off('value', listener)
  }

  usersRef.on('value', listener)

  return offCallback
}

// ============================================== HANDLE GET USER DATA

const handleGetAdminData = (
  callback: (accountData: IUserData | null) => void
) => {
  const user = firebase.auth().currentUser

  if (!user) {
    callback(null)
    return
  }

  const usersRef = firebase.database().ref('adminAccounts/' + user.uid)

  const listener = (snapshot: any) => {
    try {
      if (snapshot && snapshot.exists()) {
        const companyData = snapshot.val()
        callback(companyData)
      } else {
        callback(null)
      }
    } catch (error) {
      message.open({
        type: 'error',
        content: 'Falha ao obter dados do usuário'
      })
    }
  }

  const offCallback = () => {
    usersRef.off('value', listener)
  }

  usersRef.on('value', listener)

  return offCallback
}

// ==============================================

// ============================================== HANDLE EDIT PASSWORD

const handleChangePasswordAdmin = async (
  currentPassword: string,
  newPassword: string
): Promise<boolean> => {
  try {
    const user = firebase.auth().currentUser

    if (!user?.email) {
      message.open({
        type: 'error',
        content: 'Você precisa estar logado para alterar a senha.'
      })
      return false
    }

    const credentials = firebase.auth.EmailAuthProvider.credential(
      user.email,
      currentPassword
    )
    await user.reauthenticateWithCredential(credentials)

    await user.updatePassword(newPassword)

    message.open({
      type: 'success',
      content: 'Senha alterada com sucesso.'
    })

    return true
  } catch (error) {
    console.error('Erro ao alterar a senha: ', error)
    message.open({
      type: 'error',
      content:
        'Falha ao alterar a senha. Verifique a senha atual e tente novamente.'
    })
    return false
  }
}

// -----------------------------------------------------------------

export {
  handleSigninUser,
  handleSignupUser,
  handleSigninAdmin,
  handleLogoutUser,
  handleGetUserData,
  handleGetAdminData,
  handleChangePasswordAdmin
}
