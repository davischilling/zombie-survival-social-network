import { IIdGenerator } from '@/data/contracts'
import IdGenerator from '@/infra/id-generator/uuid'

export const makeIdGenerator = (): IIdGenerator => {
  return new IdGenerator()
}
