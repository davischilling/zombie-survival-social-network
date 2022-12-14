import { IIdGenerator, IRepository } from '@/data/contracts'
import User from '@/data/entities/user'
import { CreateUserService } from '@/data/services/user'
import {
  CreateUserDTOType,
  ICreateUserService,
} from '@/domain/use-cases/user/create'
import { faker } from '@faker-js/faker'
import { mock, MockProxy } from 'jest-mock-extended'

jest.mock('@/data/entities/user')

describe('Create User Service', () => {
  let userRepo: MockProxy<IRepository>
  let createUserDTO: CreateUserDTOType
  let idGenerator: IIdGenerator
  let sut: ICreateUserService

  beforeAll(() => {
    createUserDTO = {
      name: faker.name.fullName(),
      age: faker.datatype.number({
        min: 10,
        max: 50,
      }),
      sex: faker.name.sexType(),
      location: {
        latitude: faker.address.latitude(),
        longitude: faker.address.longitude(),
      },
    }
    userRepo = mock()
    idGenerator = mock()
  })

  beforeEach(() => {
    sut = new CreateUserService(idGenerator, userRepo)
  })

  it('Should call User class constructor with correct params', async () => {
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

  it('should rethrow if userRepo.create throws', async () => {
    userRepo.create.mockRejectedValueOnce(new Error('repo_error'))

    const promise = sut.handle(createUserDTO)

    await expect(promise).rejects.toThrow(new Error('repo_error'))
  })
})
