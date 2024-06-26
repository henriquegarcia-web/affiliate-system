import { IUserData } from './Auth'

// ====================== TYPES ====================== //

// ==================== INTERFACES =================== //

export interface IAuthenticatedUser {
  userName: string
  userEmail: string
  userRegisteredAt?: number
  userBlocked: boolean
  userAgreement: string
}

export interface ILink {
  linkId: string
  linkUrl: string
  linkLabel: string
}

export interface IComission {
  comissionId: string
  comissionValue: number
  comissionRegisteredAt: number
}

export interface IWithdraw {
  withdrawId: string
  withdrawUsdt: string
  withdrawAmount: number
  withdrawStatus: 'concluded' | 'pending' | 'finished'
  withdrawUser?: IUserData
  withdrawRegisteredAt?: number
}

export interface IMedia {
  mediaId: string
  mediaUrl: string
  mediaLabel: string
}

export interface IAgreement {
  agreementId: string
  agreementCta: number
  agreementLabel: string
}
