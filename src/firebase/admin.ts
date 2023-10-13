import firebase from '@/firebase/firebase'

import { message } from 'antd'

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

export { handleAddLinks }
