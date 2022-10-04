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
    fakeUserSchema.findOne.mockResolvedValue(userModelMock as any)
    fakeUserSchema.update.mockResolvedValue(userModelMock.id as any)
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

  it('should call findOne with correct params, return an user or throw not_found if not found', async () => {
    const id = faker.datatype.uuid()

    const user = await sut.findById(id)

    expect(fakeUserSchema.findOne).toHaveBeenCalledWith({
      where: { _id: id },
    })
    expect(fakeUserSchema.findOne).toHaveBeenCalledTimes(1)
    expect(user).toEqual(userModelMock)

    fakeUserSchema.findOne.mockResolvedValueOnce(null)

    const promise = sut.findById(id)

    expect(promise).rejects.toThrow(new Error('not_found'))
  })

  it('should call findByOneParam with correct params and return an user', async () => {
    const name = faker.name.firstName()

    const user = await sut.findOneByParam({ name })

    expect(fakeUserSchema.findOne).toHaveBeenCalledWith({
      where: { name },
    })
    expect(fakeUserSchema.findOne).toHaveBeenCalledTimes(1)
    expect(user).toEqual(userModelMock)
  })

  it('should call update with correct params and return the updated user id', async () => {
    const id = await sut.findByIdAndUpdate(userModelMock.id, userModelMock)

    const { id: _id, location, ...userAttrs } = userModelMock
    const { latitude, longitude } = location

    expect(fakeUserSchema.update).toHaveBeenCalledWith(
      {
        // _id,
        ...userAttrs,
        latitude,
        longitude,
      },
      {
        where: { _id },
      }
    )
    expect(fakeUserSchema.update).toHaveBeenCalledTimes(1)
    expect(id).toEqual(_id)
  })

  it('should call destroy with correct params', async () => {
    await sut.findByIdAndDelete(userModelMock.id)

    expect(fakeUserSchema.destroy).toHaveBeenCalledWith({
      where: { _id: userModelMock.id },
    })
    expect(fakeUserSchema.destroy).toHaveBeenCalledTimes(1)
  })
})
