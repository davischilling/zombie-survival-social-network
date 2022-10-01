import { IIdGenerator } from '@/data/contracts'
import User from '@/data/entities/user'
import { CreateUserService } from '@/data/services/user'
import { SexEnumTypes } from '@/domain/models'
import {
  CreateUserDTOType,
  ICreateUserService,
} from '@/domain/use-cases/user/create'
import { mock } from 'jest-mock-extended'

jest.mock('@/data/entities/user')

describe('Create User', () => {
  let createUserDTO: CreateUserDTOType
  let idGenerator: IIdGenerator
  let sut: ICreateUserService

  beforeAll(() => {
    createUserDTO = {
      name: '',
      age: 0,
      sex: SexEnumTypes.male,
      location: {
        latitude: 0,
        longitude: 0,
      },
    }
    idGenerator = mock()
  })

  beforeEach(() => {
    sut = new CreateUserService(idGenerator)
  })

  it('Should call entityName class constructor with correct params', async () => {
    await sut.handle(createUserDTO)

    expect(User).toHaveBeenCalledWith(createUserDTO, idGenerator)
    expect(User).toHaveBeenCalledTimes(1)
  })
})
