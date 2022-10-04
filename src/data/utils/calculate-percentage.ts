/* eslint-disable no-param-reassign */
import { UserModel } from '@/domain/models'

export const calculatePercentage = (
  allUsers: UserModel[]
): {
  percentageOfNonInfectedUsers: number
  percentageOfInfectedUsers: number
} => {
  const { amountOfNonInfectedUsers, amountOfInfectedUsers } = allUsers.reduce(
    (previous, current) => {
      if (current.isInfected) {
        previous.amountOfInfectedUsers += 1
      } else if (!current.isInfected) {
        previous.amountOfNonInfectedUsers += 1
      }
      return previous
    },
    {
      amountOfNonInfectedUsers: 0,
      amountOfInfectedUsers: 0,
    }
  )
  return {
    percentageOfNonInfectedUsers: Number(
      Math.floor((amountOfNonInfectedUsers * 100) / allUsers.length)
    ),
    percentageOfInfectedUsers: Number(
      Math.floor((amountOfInfectedUsers * 100) / allUsers.length)
    ),
  }
}
