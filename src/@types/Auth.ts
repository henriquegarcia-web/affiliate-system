// ====================== TYPES ====================== //

// ==================== INTERFACES =================== //

export interface ISigninUser {
  adminEmail: string
  adminPassword: string
}

export interface ISignupUser {
  adminName: string
  adminEmail: string
  adminPhone: string
  adminPassword: string
}

export interface IUserData {
  adminId: string
  adminName: string
  adminEmail: string
  adminPhone: string
  adminRegisteredAt: number
}
