// ====================== TYPES ====================== //

// ==================== INTERFACES =================== //

export interface IAuthenticatedUser {
  userName: string
  userEmail: string
  userRegisteredAt?: number
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
