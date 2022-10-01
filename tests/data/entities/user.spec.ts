import User, { IIdGenerator } from '@/data/entities/user'
import { UserModel } from '@/domain/models'
import { faker } from '@faker-js/faker'
import { mock, MockProxy } from 'jest-mock-extended'

describe('Share', () => {
  let generatedId: string
  let idGeneratorMock: MockProxy<IIdGenerator>
  let userModelMock: UserModel
  let sut: User

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
      itens: [],
    }
    generatedId = faker.datatype.uuid()
    idGeneratorMock = mock()
    idGeneratorMock.perform.mockReturnValue(generatedId)
  })

  it('should fill the attrs on the constructor with correct params', () => {
    sut = new User(userModelMock, idGeneratorMock)

    expect(sut).toEqual(userModelMock)
  })

  it('should define a new id for the entity if it was not passed to the constructor', () => {
    const { id, ...userWithNoId } = userModelMock

    sut = new User(userWithNoId, idGeneratorMock)

    expect(sut.id).toBeDefined()
  })

  it('should update an user correctly', () => {
    sut = new User(userModelMock, idGeneratorMock)

    const anyId = faker.datatype.uuid()
    const anyName = faker.name.fullName()

    sut.id = anyId
    sut.name = anyName

    const updatedUser = new User(
      { ...sut, ...{ name: anyName } },
      idGeneratorMock
    )

    expect(updatedUser).toEqual(sut)
  })

  it('should call idGenerator.perfom if id was not passed returning a valid id', () => {
    const { id, ...userWithNoId } = userModelMock

    sut = new User(userWithNoId, idGeneratorMock)

    expect(idGeneratorMock.perform).toHaveBeenCalledTimes(1)
    expect(sut.id).toBe(generatedId)
  })

  it('should not call idGenerator.perfom if id was passed to the constructor', () => {
    sut = new User(userModelMock, idGeneratorMock)

    expect(idGeneratorMock.perform).toHaveBeenCalledTimes(0)
  })
})
