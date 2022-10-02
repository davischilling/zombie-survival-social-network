import { UserModel } from '@/domain/models'
import { UserRepository } from '@/infra/db/repositories'
import LocationSchema from '@/infra/db/schemas/Location'
import UserSchema from '@/infra/db/schemas/User'
import { faker } from '@faker-js/faker'

jest.mock('@/infra/db/schemas/User')
jest.mock('@/infra/db/schemas/Location')

describe('User Repository', () => {
  let userModelMock: UserModel
  let fakeUserSchema: jest.Mocked<typeof UserSchema>
  let fakeLocationSchema: jest.Mocked<typeof LocationSchema>
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
        latitude: Number(faker.address.latitude()),
        longitude: Number(faker.address.longitude()),
      },
      isInfected: faker.datatype.boolean(),
      items: [],
    }
    fakeUserSchema = UserSchema as jest.Mocked<typeof UserSchema>
    fakeUserSchema.create.mockResolvedValue(userModelMock)
    fakeLocationSchema = LocationSchema as jest.Mocked<typeof LocationSchema>
  })

  beforeEach(() => {
    sut = new UserRepository()
  })

  it('should create a new User and Location and return an user id', async () => {
    const id = await sut.create(userModelMock)

    const { location, ...userAttrs } = userModelMock

    expect(fakeUserSchema.create).toHaveBeenCalledWith(userAttrs, {
      fields: ['id', 'name', 'age', 'sex', 'items', 'isInfected'],
    })
    expect(fakeUserSchema.create).toHaveBeenCalledTimes(1)

    const { latitude, longitude } = location

    expect(fakeLocationSchema.create).toHaveBeenCalledWith(
      { latitude, longitude },
      {
        fields: ['latitude', 'longitude'],
      }
    )
    expect(fakeLocationSchema.create).toHaveBeenCalledTimes(1)
    expect(id).toBe(userModelMock.id)
  })

  // it('should define a new id for the entity if it was not passed to the constructor', () => {
  //   const { id, ...userWithNoId } = userModelMock

  //   sut = new User(userWithNoId, idGeneratorMock)

  //   expect(sut.id).toBeDefined()
  // })

  // it('should define isInffected and items with default value if not passed to the constructor', () => {
  //   const { isInfected, items, ...userWithNoIsInffected } = userModelMock

  //   sut = new User(userWithNoIsInffected, idGeneratorMock)

  //   expect(sut.isInfected).toBeDefined()
  //   expect(sut.items).toBeDefined()
  // })

  // it('should update an user correctly', () => {
  //   sut = new User(userModelMock, idGeneratorMock)

  //   const anyId = faker.datatype.uuid()
  //   const anyName = faker.name.fullName()

  //   sut.id = anyId
  //   sut.name = anyName

  //   const updatedUser = new User(
  //     { ...sut, ...{ name: anyName } },
  //     idGeneratorMock
  //   )

  //   expect(updatedUser).toEqual(sut)
  // })

  // it('should call idGenerator.perfom if id was not passed returning a valid id', () => {
  //   const { id, ...userWithNoId } = userModelMock

  //   sut = new User(userWithNoId, idGeneratorMock)

  //   expect(idGeneratorMock.perform).toHaveBeenCalledTimes(1)
  //   expect(sut.id).toBe(generatedId)
  // })

  // it('should not call idGenerator.perfom if id was passed to the constructor', () => {
  //   sut = new User(userModelMock, idGeneratorMock)

  //   expect(idGeneratorMock.perform).toHaveBeenCalledTimes(0)
  // })
})
