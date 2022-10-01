import { IIdGenerator, IRepository } from '@/data/contracts'
import User from '@/data/entities/user'
import { CreateUserService } from '@/data/services/user'
import { SexEnumTypes } from '@/domain/models'
import {
  CreateUserDTOType,
  ICreateUserService,
} from '@/domain/use-cases/user/create'
import { mock, MockProxy } from 'jest-mock-extended'

jest.mock('@/data/entities/user')

describe('Create User Service', () => {
  let userRepo: MockProxy<IRepository>
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
    userRepo = mock()
    idGenerator = mock()
  })

  beforeEach(() => {
    sut = new CreateUserService(idGenerator, userRepo)
  })

  it('Should call entityName class constructor with correct params', async () => {
    await sut.handle(createUserDTO)

    expect(User).toHaveBeenCalledWith(createUserDTO, idGenerator)
    expect(User).toHaveBeenCalledTimes(1)
  })

  it('should call userRepo.create with correct params', async () => {
    await sut.handle(createUserDTO)

    const userEntity = new User(createUserDTO, idGenerator)

    expect(userRepo.create).toHaveBeenCalledWith(userEntity)
    expect(userRepo.create).toHaveBeenCalledTimes(1)
  })
})
