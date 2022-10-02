import { IIdGenerator } from '@/data/contracts'
import { v4 as uuid } from 'uuid'

class IdGenerator implements IIdGenerator {
  perform(): string {
    return uuid()
  }
}

export default IdGenerator
