import firebase from '@/firebase/firebase'

import { message } from 'antd'

import { IWithdraw } from '@/@types/Admin'

// ============================================= WITHDRAW

interface IRequestWithdraw {
  userId: string
  withdrawUsdt: string
  withdrawAmount: number
}

const handleRequestWithdraw = async ({
  userId,
  withdrawUsdt,
  withdrawAmount
}: IRequestWithdraw) => {
  try {
    const userAccountsRef = firebase.database().ref('userAccounts/' + userId)

    const snapshot = await userAccountsRef.once('value')
    const userData = snapshot.val()

    if (!userData) {
      return false
    }

    if (!('userAffiliateWithdraws' in userData)) {
      userData.userAffiliateWithdraws = []
    }

    const withdrawData: IWithdraw = {
      withdrawId: userAccountsRef.push().key,
      withdrawUsdt,
      withdrawAmount,
      withdrawStatus: 'pending',
      withdrawRegisteredAt: Date.now()
    }

    userData.userAffiliateWithdraws.push(withdrawData)

    await userAccountsRef.set(userData)

    message.open({
      type: 'success',
      content: 'Saque solicitado com sucesso'
    })

    return true
  } catch (error) {
    message.open({
      type: 'error',
      content: 'Erro ao solicitar saque'
    })
    return false
  }
}

export { handleRequestWithdraw }
