/* eslint-disable @typescript-eslint/no-explicit-any */
// ====================== TYPES ====================== //

// ==================== INTERFACES =================== //

export interface ISigninUser {
  userEmail: string
  userPassword: string
}

export interface ISignupUser {
  userEmail: string
  userPassword: string
}

export interface ISigninAdmin {
  adminEmail: string
  adminPassword: string
}

export interface IUserData {
  userId: string
  userName: string
  userEmail: string
  userRegisteredAt: number
  userAffiliateLinks?: any
  userAffiliateComission?: any
}
