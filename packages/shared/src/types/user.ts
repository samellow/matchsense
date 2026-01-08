export interface User {
  id: number
  email: string
  name: string
  createdAt: Date
  updatedAt?: Date
}

export interface CreateUserInput {
  email: string
  name: string
}

export interface UpdateUserInput {
  email?: string
  name?: string
}

