import User from '@/data/entities/user'
import { SexTypes, UserModel } from '@/domain/models'

describe('Share', () => {
  let userModelMock: UserModel
  let sut: User

  beforeEach(() => {
    userModelMock = {
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
})
