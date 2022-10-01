import User from '@/data/entities/user'
import { SexTypes, UserModel } from '@/domain/models'

describe('Share', () => {
  let userModelMock: UserModel
  let sut: User

  beforeEach(() => {
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
  })

  it('should fill the attrs on the constructor with correct params', () => {
    sut = new User(userModelMock)

    expect(sut).toEqual(userModelMock)
  })

  it('should define a new id for the entity if it was not passed to the constructor', () => {
    const { id, ...userWithNoId } = userModelMock

    sut = new User(userWithNoId)

    expect(sut.id).toBeDefined()
  })

  it('should update an user correctly', () => {
    sut = new User(userModelMock)
    sut.id = 'any_user_id'

    sut.name = 'updated_name'
    const updatedUser = new User({ ...sut, ...{ name: 'updated_name' } })

    expect(updatedUser).toEqual(sut)
  })
})
