/* eslint-disable @typescript-eslint/no-explicit-any */
// ====================== TYPES ====================== //

// ==================== INTERFACES =================== //

export interface ISigninUser {
  userEmail: string
  userPassword: string
  userAdmin: boolean
}

export interface ISignupUser {
  userEmail: string
  userPassword: string
}

export interface IUserData {
  userId?: string
  userName: string
  userEmail: string
  userRegisteredAt: number
  userIsAdmin: boolean
  userIsAuthenticated: boolean
  userAffiliateLinks?: any
  userAffiliateComission?: any
}
