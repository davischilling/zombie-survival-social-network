import { UserModel } from '@/domain/models'
import { UserRepository } from '@/infra/db/repositories'
import { UserSchema } from '@/infra/db/schemas/User'
import { faker } from '@faker-js/faker'

jest.mock('@/infra/db/schemas/User')

describe('User Repository', () => {
  let userModelMock: UserModel
  let fakeUserSchema: jest.Mocked<typeof UserSchema>
  let sut: UserRepository

  beforeAll(() => {
    userModelMock = {
      id: faker.datatype.uuid(),
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
      isInfected: faker.datatype.boolean(),
      items: [],
    }
    fakeUserSchema = UserSchema as jest.Mocked<typeof UserSchema>
    fakeUserSchema.create.mockResolvedValue(userModelMock)
    fakeUserSchema.findAll.mockResolvedValue([])
  })

  beforeEach(() => {
    sut = new UserRepository()
  })

  it('should create a new User and Location and return an user id', async () => {
    const id = await sut.create(userModelMock)

    const { location, id: _id, ...userAttrs } = userModelMock

    expect(fakeUserSchema.create).toHaveBeenCalledWith({
      _id,
      ...userAttrs,
      ...location,
    })
    expect(fakeUserSchema.create).toHaveBeenCalledTimes(1)

    expect(id).toBe(userModelMock.id)
  })

  it('should call findAll with correct params and return a list of users', async () => {
    const name = faker.name.fullName()

    await sut.find({ name })

    expect(fakeUserSchema.findAll).toHaveBeenCalledWith({
      where: { name },
    })
    expect(fakeUserSchema.findAll).toHaveBeenCalledTimes(1)
  })
})
