import { CreateUserController } from '@/application/controllers/user'
import { ServerError } from '@/application/errors'
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
        latitude: faker.address.latitude(),
        longitude: faker.address.longitude(),
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

  it('should rethrow if createUserService.handle throws', async () => {
    const error = new ServerError(new Error('server_error'))
    createUserService.handle.mockRejectedValueOnce(error)

    const promise = sut.perform(createUserDTO)

    await expect(promise).rejects.toThrow(error)
  })

  it('should return 201 and entityName confirmation message on success', async () => {
    const httpResponse = await sut.perform(createUserDTO)

    expect(httpResponse).toEqual({
      statusCode: 201,
      data: { message: 'User created' },
    })
  })
})
