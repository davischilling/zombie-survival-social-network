/* eslint-disable no-param-reassign */
import { UserModel } from '@/domain/models'

export const calculateLostPoints = (
  users: UserModel[]
): { lostPointsByInfectedUser: number } => {
  const lostPointsByInfectedUser = users.reduce((previous, current) => {
    if (current.isInfected) {
      previous += 1
    }
    return previous
  }, 0)
  return { lostPointsByInfectedUser }
}
