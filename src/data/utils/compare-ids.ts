/* eslint-disable no-restricted-syntax */
export const areThereToEqualIds = (ids: string[]) => {
  const count: any = {}

  for (const element of ids) {
    if (count[element]) {
      count[element] += 1
    } else {
      count[element] = 1
    }
  }

  for (const el in count) {
    if (count[el] > 1) {
      return true
    }
  }
  return false
}
