import { IIdGenerator, IRepository } from '@/data/contracts'
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
  let idGenerator: MockProxy<IIdGenerator>
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
    idGenerator = mock()
    userRepo.findById.mockResolvedValue(userFound)
  })

  beforeEach(() => {
    sut = new UpdateUserLocationService(idGenerator, userRepo)
  })

  it('should call UserRepo.findById with correct params', async () => {
    await sut.handle(updateUserLocationDTO)

    expect(userRepo.findById).toHaveBeenCalledWith(updateUserLocationDTO.id)
    expect(userRepo.findById).toHaveBeenCalledTimes(1)
  })

  it('should throw if userRepo.findById does not find any collection to update', async () => {
    userRepo.findById.mockResolvedValueOnce(null)

    const promise = sut.handle(updateUserLocationDTO)

    expect(promise).rejects.toThrow(new Error('not_found'))
  })

  it('Should call User class constructor', async () => {
    await sut.handle(updateUserLocationDTO)

    const { location, ...userAttrs } = userFound

    expect(User).toHaveBeenCalledWith(
      {
        ...userAttrs,
        location: updateUserLocationDTO.location,
      },
      idGenerator
    )
    expect(User).toHaveBeenCalledTimes(1)
  })

  it('should call User.findByIdAndUpdate with correct params', async () => {
    await sut.handle(updateUserLocationDTO)

    const { location, ...userAttrs } = userFound
    const updatedUser = new User(
      {
        ...userAttrs,
        location: updateUserLocationDTO.location,
      },
      idGenerator
    )

    expect(userRepo.findByIdAndUpdate).toHaveBeenCalledWith(
      updateUserLocationDTO.id,
      updatedUser
    )
    expect(userRepo.findByIdAndUpdate).toHaveBeenCalledTimes(1)
  })

  it('should rethrow if userRepo throws', async () => {
    userRepo.findById.mockRejectedValueOnce(new Error('findById_repo_error'))

    const findByIdPromise = sut.handle(updateUserLocationDTO)

    await expect(findByIdPromise).rejects.toThrow(
      new Error('findById_repo_error')
    )

    userRepo.findByIdAndUpdate.mockRejectedValueOnce(
      new Error('findByIdAndUpdate_repo_error')
    )

    const findByIdAndUpdatePromise = sut.handle(updateUserLocationDTO)

    await expect(findByIdAndUpdatePromise).rejects.toThrow(
      new Error('findByIdAndUpdate_repo_error')
    )
  })
})
