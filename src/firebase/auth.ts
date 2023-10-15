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
    const userAccountsRef = firebase.database().ref('usersAccounts')

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
          'Essa conta já possuí cadastro, faça login para acessar o sistema'
      })
      return false
    }

    const userAuthenticatedData = userAuthenticationQuerySnapshot.val()
    const userId = Object.keys(userAuthenticatedData)[0]

    const { userName } = userAuthenticatedData[userId]

    if (!userName) {
      message.open({
        type: 'error',
        content: 'Erro ao realizar cadastro'
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
        userAffiliateComission: []
      }

      const userDataResponse = await createUserAccount(userData)

      if (!userDataResponse) {
        message.open({
          type: 'error',
          content: 'Falha ao realizar cadastro, faça novamente o seu cadastro.'
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
      content: 'Erro ao realizar cadastro'
    })
    return false
  } catch (error: any) {
    const errorCode = error.code

    const traslatedError = handleTranslateFbError(errorCode)

    message.open({
      type: 'error',
      content:
        traslatedError !== null ? traslatedError : 'Erro ao realizar cadastro'
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

// ============================================== HANDLE DELETE ACCOUNT

// const handleDeleteAdminAccount = async (adminPassword: string) => {
//   try {
//     const user = firebase.auth().currentUser

//     if (!user) {
//       message.open({
//         type: 'error',
//         content: 'Você precisa estar logado para excluir sua conta.'
//       })
//       return false
//     }

//     try {
//       if (!user.email) {
//         message.open({
//           type: 'error',
//           content:
//             'Erro na reautenticação. Verifique sua senha e tente novamente.'
//         })
//         return false
//       }

//       const credential = firebase.auth.EmailAuthProvider.credential(
//         user.email,
//         adminPassword
//       )
//       await user.reauthenticateWithCredential(credential)
//     } catch (reauthError) {
//       message.open({
//         type: 'error',
//         content:
//           'Erro na reautenticação. Verifique sua senha e tente novamente.'
//       })
//       return false
//     }

//     await user.delete()

//     const adminsRef = firebase.database().ref('adminAccounts/' + user.uid)
//     await adminsRef.remove()

//     message.open({
//       type: 'success',
//       content: 'Sua conta foi excluída com sucesso.'
//     })

//     return true
//   } catch (error) {
//     console.error('Erro ao excluir a conta: ', error)
//     message.open({
//       type: 'error',
//       content: 'Falha ao excluir a conta. Tente novamente mais tarde.'
//     })
//     return false
//   }
// }

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
