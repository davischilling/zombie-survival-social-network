import { IRepository } from '@/data/contracts'
import User from '@/data/entities/user'
import { MarkUserAsInfectedService } from '@/data/services/user'
import { UserModel } from '@/domain/models'
import {
  IMarkUserAsInfectedService,
  MarkUserAsInfectedDTOType,
} from '@/domain/use-cases/user'
import { faker } from '@faker-js/faker'
import { mock, MockProxy } from 'jest-mock-extended'

import { generateUser } from './mocks/generateUser'

jest.mock('@/data/entities/user')

describe('Mark User as infected Service', () => {
  let userRepo: MockProxy<IRepository>
  let markUserAsInfectedDTO: MarkUserAsInfectedDTOType
  let userToUpdateFound: UserModel
  let snitchOneFound: UserModel
  let snitchTwoFound: UserModel
  let snitchThreeFound: UserModel
  let sut: IMarkUserAsInfectedService

  beforeAll(() => {
    markUserAsInfectedDTO = {
      id: faker.datatype.uuid(),
      snitchOneId: faker.datatype.uuid(),
      snitchTwoId: faker.datatype.uuid(),
      snitchThreeId: faker.datatype.uuid(),
    }
    userRepo = mock()
    userToUpdateFound = generateUser(markUserAsInfectedDTO.id)
    snitchOneFound = generateUser(markUserAsInfectedDTO.snitchOneId)
    snitchTwoFound = generateUser(markUserAsInfectedDTO.snitchTwoId)
    snitchThreeFound = generateUser(markUserAsInfectedDTO.snitchThreeId)
    userRepo.findById.mockResolvedValue(userToUpdateFound)
    userRepo.findById.mockResolvedValue(snitchOneFound)
    userRepo.findById.mockResolvedValue(snitchTwoFound)
    userRepo.findById.mockResolvedValue(snitchThreeFound)
  })

  beforeEach(() => {
    sut = new MarkUserAsInfectedService(userRepo)
  })

  it('should call UserRepo.findById with correct params', async () => {
    await sut.handle(markUserAsInfectedDTO)

    const { id, snitchOneId, snitchTwoId, snitchThreeId } =
      markUserAsInfectedDTO

    expect(userRepo.findById).toHaveBeenCalledWith(id)
    expect(userRepo.findById).toHaveBeenCalledWith(snitchOneId)
    expect(userRepo.findById).toHaveBeenCalledWith(snitchTwoId)
    expect(userRepo.findById).toHaveBeenCalledWith(snitchThreeId)
    expect(userRepo.findById).toHaveBeenCalledTimes(4)
  })

  it('should rethrow if userRepo.findById throws', async () => {
    userRepo.findById.mockRejectedValueOnce(new Error('repo_error'))

    const promise = sut.handle(markUserAsInfectedDTO)

    await expect(promise).rejects.toThrow(new Error('repo_error'))
  })
})
