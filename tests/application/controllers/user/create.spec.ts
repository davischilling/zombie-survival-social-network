import { CreateUserController } from '@/application/controllers/user'
import { CreateUserDTOType, ICreateUserService } from '@/domain/use-cases/user'
import { faker } from '@faker-js/faker'
import { mock, MockProxy } from 'jest-mock-extended'

describe('Create User Controller', () => {
  let createUserDTO: CreateUserDTOType
  let createUserService: MockProxy<ICreateUserService>
  let sut: CreateUserController

  beforeAll(() => {
    createUserDTO = {
      name: faker.name.fullName(),
      age: faker.datatype.number({
        min: 10,
        max: 50,
      }),
      sex: faker.name.sexType(),
      location: {
        latitude: Number(faker.address.latitude()),
        longitude: Number(faker.address.longitude()),
      },
    }
    createUserService = mock()
  })

  beforeEach(() => {
    sut = new CreateUserController(createUserService)
  })

  it('should call createUserService.handle with correct params', async () => {
    await sut.perform(createUserDTO)

    expect(createUserService.handle).toHaveBeenCalledWith(createUserDTO)
    expect(createUserService.handle).toHaveBeenCalledTimes(1)
  })
})
