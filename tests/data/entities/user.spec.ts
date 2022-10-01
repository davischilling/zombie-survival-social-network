import User, { IIdGenerator } from '@/data/entities/user'
import { SexTypes, UserModel } from '@/domain/models'
import { mock, MockProxy } from 'jest-mock-extended'

describe('Share', () => {
  let idGeneratorMock: MockProxy<IIdGenerator>
  let userModelMock: UserModel
  let sut: User

  beforeAll(() => {
    userModelMock = {
      id: 'id',
      name: '',
      age: 0,
      sex: SexTypes.male,
      location: {
        latitude: 0,
        longitude: 0,
      },
      isInfected: false,
      itens: [],
    }
    idGeneratorMock = mock()
    idGeneratorMock.perform.mockReturnValue('new_id')
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
    sut.id = 'any_user_id'

    sut.name = 'updated_name'
    const updatedUser = new User(
      { ...sut, ...{ name: 'updated_name' } },
      idGeneratorMock
    )

    expect(updatedUser).toEqual(sut)
  })

  it('should call idGenerator if id was not passed returning a valid id', () => {
    const { id, ...userWithNoId } = userModelMock

    sut = new User(userWithNoId, idGeneratorMock)

    expect(idGeneratorMock.perform).toHaveBeenCalledTimes(1)
    expect(sut.id).toBe('new_id')
  })
})
