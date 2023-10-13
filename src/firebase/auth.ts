import firebase from '@/firebase/firebase'

import { handleTranslateFbError } from '@/utils/functions/firebaseTranslateErrors'

import { message } from 'antd'

import { AdminTheme, ISigninUser, ISignupUser, IUserData } from '@/@types/Auth'

// ============================================== CREATE ADMIN DATA

const createAdminAccount = async (adminData: IUserData): Promise<boolean> => {
  try {
    const adminAccountsRef = firebase
      .database()
      .ref('adminAccounts/' + adminData.adminId)

    await adminAccountsRef.set(adminData)

    return true
  } catch (error) {
    message.open({
      type: 'error',
      content: 'Falha ao salvar credenciais'
    })
    return false
  }
}

// ============================================== LOGIN

const handleSigninAdmin = async ({
  adminEmail,
  adminPassword
}: ISigninUser): Promise<boolean> => {
  try {
    await firebase.auth().signInWithEmailAndPassword(adminEmail, adminPassword)

    return true
  } catch (error: any) {
    const errorCode = error.code
    const traslatedError = handleTranslateFbError(errorCode)

    message.open({
      type: 'error',
      content: traslatedError
    })
    return false
  }
}

const handleSignupAdmin = async ({
  adminName,
  adminEmail,
  adminPhone,
  adminPassword
}: ISignupUser): Promise<boolean | string> => {
  try {
    // ----------------------------------

    const adminAccountsRef = firebase.database().ref('adminAccounts')

    const adminQuery = adminAccountsRef
      .orderByChild('adminEmail')
      .equalTo(adminEmail)

    const adminQuerySnapshot = await adminQuery.get()

    if (adminQuerySnapshot.exists()) {
      message.open({
        type: 'warning',
        content:
          'Essa conta já possuí cadastro, faça login para acessar o sistema'
      })
      return false
    }

    // ----------------------------------

    const userCredential = await firebase
      .auth()
      .createUserWithEmailAndPassword(adminEmail, adminPassword)

    if (userCredential.user) {
      await userCredential.user.updateProfile({
        displayName: adminName
      })

      const adminData: IUserData = {
        adminPreferences: {
          adminTheme: 'default'
        },
        adminId: userCredential.user.uid,
        adminName: adminName,
        adminEmail: adminEmail,
        adminPhone: adminPhone,
        adminRegisteredAt: Date.now(),
        adminCompanyInfo: {
          companyActive: false,
          companyActiveTestMode: false,
          companyLogo: '',
          companyBanner: '',
          companyName: '',
          companyId: '',
          companyDescription: '',
          // companyLocation: {},
          companyContacts: {
            companyPhone: '',
            companyWhatsapp: '',
            companyEmail: '',
            companyFacebook: '',
            companyInstagram: '',
            companyWebsite: ''
          },
          // companySchedules: [],
          companyMenu: []
        }
      }

      const adminDataResponse = await createAdminAccount(adminData)

      if (!adminDataResponse) {
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
    }

    message.open({
      type: 'success',
      content: 'Conta criada com sucesso'
    })
    return true
  } catch (error: any) {
    const errorCode = error.code

    const traslatedError = handleTranslateFbError(errorCode)

    message.open({
      type: 'error',
      content: traslatedError
    })
    return false
  }
}

// ============================================== LOGOUT

const handleLogoutAdmin = async (): Promise<boolean> => {
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

const handleGetAdminData = (
  callback: (accountData: IUserData | null) => void
) => {
  const user = firebase.auth().currentUser

  if (!user) {
    callback(null)
    return
  }

  const adminsRef = firebase.database().ref('adminAccounts/' + user.uid)

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
        content: 'Falha ao obter dados da empresa'
      })
    }
  }

  const offCallback = () => {
    adminsRef.off('value', listener)
  }

  adminsRef.on('value', listener)

  return offCallback
}

// ============================================== HANDLE DELETE ACCOUNT

const handleDeleteAdminAccount = async (adminPassword: string) => {
  try {
    const user = firebase.auth().currentUser

    if (!user) {
      message.open({
        type: 'error',
        content: 'Você precisa estar logado para excluir sua conta.'
      })
      return false
    }

    try {
      if (!user.email) {
        message.open({
          type: 'error',
          content:
            'Erro na reautenticação. Verifique sua senha e tente novamente.'
        })
        return false
      }

      const credential = firebase.auth.EmailAuthProvider.credential(
        user.email,
        adminPassword
      )
      await user.reauthenticateWithCredential(credential)
    } catch (reauthError) {
      message.open({
        type: 'error',
        content:
          'Erro na reautenticação. Verifique sua senha e tente novamente.'
      })
      return false
    }

    await user.delete()

    const adminsRef = firebase.database().ref('adminAccounts/' + user.uid)
    await adminsRef.remove()

    message.open({
      type: 'success',
      content: 'Sua conta foi excluída com sucesso.'
    })

    return true
  } catch (error) {
    console.error('Erro ao excluir a conta: ', error)
    message.open({
      type: 'error',
      content: 'Falha ao excluir a conta. Tente novamente mais tarde.'
    })
    return false
  }
}

// ============================================== HANDLE EDIT E-MAIL

const handleChangeEmailAdmin = async (newEmail: string): Promise<boolean> => {
  try {
    const user = firebase.auth().currentUser

    if (!user) {
      message.open({
        type: 'error',
        content: 'Você precisa estar logado para alterar o e-mail.'
      })
      return false
    }

    await user.updateEmail(newEmail)
    await user.sendEmailVerification()

    await firebase.auth().signOut()

    message.open({
      type: 'success',
      content: 'Um e-mail de verificação foi enviado para o novo endereço.'
    })

    return true
  } catch (error: any) {
    const errorCode = error.code

    if (errorCode === 'auth/requires-recent-login') {
      message.open({
        type: 'error',
        content: 'Você precisa fazer login novamente para alterar o e-mail.'
      })
    } else {
      message.open({
        type: 'error',
        content: 'Erro ao alterar o e-mail: ' + error.message
      })
    }

    return false
  }
}

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

// ============================================== HANDLE EDIT PASSWORD

const handleChangeAdminTheme = async (adminTheme: AdminTheme) => {
  console.log(adminTheme)

  try {
    const user = firebase.auth().currentUser

    if (!user?.email) {
      message.open({
        type: 'error',
        content: 'Você precisa estar logado para alterar o tema.'
      })
      return false
    }

    const adminAccountsRef = firebase
      .database()
      .ref('adminAccounts/' + user.uid)

    const adminDataSnapshot = await adminAccountsRef.get()

    if (adminDataSnapshot.exists()) {
      const adminData = adminDataSnapshot.val()
      adminData.adminPreferences.adminTheme = adminTheme

      await adminAccountsRef.set(adminData)

      message.open({
        type: 'success',
        content: 'Tema atualizado com sucesso.'
      })

      return true
    } else {
      message.open({
        type: 'error',
        content: 'Dados não encontrados.'
      })
      return false
    }
  } catch (error) {
    console.error('Erro ao editar o tema: ', error)
    message.open({
      type: 'error',
      content: 'Falha ao editar o tema. Tente novamente mais tarde.'
    })
    return false
  }
}

// -----------------------------------------------------------------

export {
  handleSigninAdmin,
  handleSignupAdmin,
  handleLogoutAdmin,
  handleGetAdminData,
  handleDeleteAdminAccount,
  handleChangeEmailAdmin,
  handleChangePasswordAdmin,
  handleChangeAdminTheme
}
