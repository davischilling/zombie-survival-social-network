import { IRepository } from '@/data/contracts'
import User from '@/data/entities/user'
import { UpdateUserLocationService } from '@/data/services/user'
import { UserModel } from '@/domain/models'
import {
  IUpdateUserLocationService,
  UpdateUserLocationUseCase,
} from '@/domain/use-cases/user'
import { faker } from '@faker-js/faker'
// eslint-disable-next-line import/no-extraneous-dependencies
import { mock, MockProxy } from 'jest-mock-extended'

import { generateUser } from './mocks/generateUser'

jest.mock('@/data/entities/user')

describe('Update User Location', () => {
  let userRepo: MockProxy<IRepository<UserModel>>
  let updateUserLocationDTO: UpdateUserLocationUseCase.input
  let sut: IUpdateUserLocationService
  let userFound: UserModel

  beforeAll(() => {
    updateUserLocationDTO = {
      id: faker.datatype.uuid(),
      location: {
        latitude: faker.address.latitude(),
        longitude: faker.address.longitude(),
      },
    }
    userFound = generateUser()
    userRepo = mock()
    userRepo.findById.mockResolvedValue(userFound)
  })

  beforeEach(() => {
    sut = new UpdateUserLocationService(userRepo)
  })

  it('should call UserRepo.findById with correct params', async () => {
    await sut.handle(updateUserLocationDTO)

    expect(userRepo.findById).toHaveBeenCalledWith(updateUserLocationDTO.id)
    expect(userRepo.findById).toHaveBeenCalledTimes(1)
  })
})
