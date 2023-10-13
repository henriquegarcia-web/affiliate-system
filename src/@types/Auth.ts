// ====================== TYPES ====================== //

// ==================== INTERFACES =================== //

export interface ISigninUser {
  userEmail: string
  userPassword: string
  userAdmin: boolean
}

export interface ISignupUser {
  userName: string
  userEmail: string
  userPassword: string
  userIsAdmin: boolean
}

export interface IUserData {
  userId: string
  userName: string
  userEmail: string
  userRegisteredAt: number
  userIsAdmin: boolean
}
