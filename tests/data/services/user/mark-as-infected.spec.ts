import { IIdGenerator, IRepository } from '@/data/contracts'
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
  let idGenerator: MockProxy<IIdGenerator>
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
    idGenerator = mock()
    userToUpdateFound = generateUser(markUserAsInfectedDTO.id, false)
    snitchOneFound = generateUser(markUserAsInfectedDTO.snitchOneId, false)
    snitchTwoFound = generateUser(markUserAsInfectedDTO.snitchTwoId, false)
    snitchThreeFound = generateUser(markUserAsInfectedDTO.snitchThreeId, false)
    userRepo.findById.mockResolvedValue(userToUpdateFound)
    userRepo.findById.mockResolvedValue(snitchOneFound)
    userRepo.findById.mockResolvedValue(snitchTwoFound)
    userRepo.findById.mockResolvedValue(snitchThreeFound)
  })

  beforeEach(() => {
    sut = new MarkUserAsInfectedService(idGenerator, userRepo)
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

  it('should throw not_found if the user about to be updated was not found', async () => {
    userRepo.findById.mockResolvedValueOnce(null)
    userRepo.findById.mockResolvedValueOnce(snitchOneFound)
    userRepo.findById.mockResolvedValueOnce(snitchTwoFound)
    userRepo.findById.mockResolvedValueOnce(snitchThreeFound)

    const promise = sut.handle(markUserAsInfectedDTO)

    expect(promise).rejects.toThrow(new Error('not_found'))
  })

  it('should throw not_found if snitch one was not found', async () => {
    userRepo.findById.mockResolvedValueOnce(userToUpdateFound)
    userRepo.findById.mockResolvedValueOnce(null)
    userRepo.findById.mockResolvedValueOnce(snitchTwoFound)
    userRepo.findById.mockResolvedValueOnce(snitchThreeFound)

    const promise = sut.handle(markUserAsInfectedDTO)

    expect(promise).rejects.toThrow(new Error('not_found'))
  })

  it('should throw not_found if snitch two was not found', async () => {
    userRepo.findById.mockResolvedValueOnce(userToUpdateFound)
    userRepo.findById.mockResolvedValueOnce(snitchOneFound)
    userRepo.findById.mockResolvedValueOnce(null)
    userRepo.findById.mockResolvedValueOnce(snitchThreeFound)

    const promise = sut.handle(markUserAsInfectedDTO)

    expect(promise).rejects.toThrow(new Error('not_found'))
  })

  it('should throw not_found if snitch two was not found', async () => {
    userRepo.findById.mockResolvedValueOnce(userToUpdateFound)
    userRepo.findById.mockResolvedValueOnce(snitchOneFound)
    userRepo.findById.mockResolvedValueOnce(snitchTwoFound)
    userRepo.findById.mockResolvedValueOnce(null)

    const promise = sut.handle(markUserAsInfectedDTO)

    expect(promise).rejects.toThrow(new Error('not_found'))
  })

  it('should throw invalid_user if the user about to be updated is already infected', async () => {
    userToUpdateFound = generateUser(markUserAsInfectedDTO.id, true)
    snitchOneFound = generateUser(markUserAsInfectedDTO.snitchOneId, false)
    snitchTwoFound = generateUser(markUserAsInfectedDTO.snitchTwoId, false)
    snitchThreeFound = generateUser(markUserAsInfectedDTO.snitchThreeId, false)
    userRepo.findById.mockResolvedValueOnce(userToUpdateFound)
    userRepo.findById.mockResolvedValueOnce(snitchOneFound)
    userRepo.findById.mockResolvedValueOnce(snitchTwoFound)
    userRepo.findById.mockResolvedValueOnce(snitchThreeFound)

    const promise = sut.handle(markUserAsInfectedDTO)

    expect(promise).rejects.toThrow(new Error('invalid_user'))
  })

  it('should throw invalid_user if snitch one is infected', async () => {
    userToUpdateFound = generateUser(markUserAsInfectedDTO.id, false)
    snitchOneFound = generateUser(markUserAsInfectedDTO.snitchOneId, true)
    snitchTwoFound = generateUser(markUserAsInfectedDTO.snitchTwoId, false)
    snitchThreeFound = generateUser(markUserAsInfectedDTO.snitchThreeId, false)
    userRepo.findById.mockResolvedValueOnce(userToUpdateFound)
    userRepo.findById.mockResolvedValueOnce(snitchOneFound)
    userRepo.findById.mockResolvedValueOnce(snitchTwoFound)
    userRepo.findById.mockResolvedValueOnce(snitchThreeFound)

    const promise = sut.handle(markUserAsInfectedDTO)

    expect(promise).rejects.toThrow(new Error('invalid_user'))
  })

  it('should throw invalid_user if snitch two is infected', async () => {
    userToUpdateFound = generateUser(markUserAsInfectedDTO.id, false)
    snitchOneFound = generateUser(markUserAsInfectedDTO.snitchOneId, false)
    snitchTwoFound = generateUser(markUserAsInfectedDTO.snitchTwoId, true)
    snitchThreeFound = generateUser(markUserAsInfectedDTO.snitchThreeId, false)
    userRepo.findById.mockResolvedValueOnce(userToUpdateFound)
    userRepo.findById.mockResolvedValueOnce(snitchOneFound)
    userRepo.findById.mockResolvedValueOnce(snitchTwoFound)
    userRepo.findById.mockResolvedValueOnce(snitchThreeFound)

    const promise = sut.handle(markUserAsInfectedDTO)

    expect(promise).rejects.toThrow(new Error('invalid_user'))
  })

  it('should throw invalid_user if snitch three is infected', async () => {
    userToUpdateFound = generateUser(markUserAsInfectedDTO.id, false)
    snitchOneFound = generateUser(markUserAsInfectedDTO.snitchOneId, false)
    snitchTwoFound = generateUser(markUserAsInfectedDTO.snitchTwoId, false)
    snitchThreeFound = generateUser(markUserAsInfectedDTO.snitchThreeId, true)
    userRepo.findById.mockResolvedValueOnce(userToUpdateFound)
    userRepo.findById.mockResolvedValueOnce(snitchOneFound)
    userRepo.findById.mockResolvedValueOnce(snitchTwoFound)
    userRepo.findById.mockResolvedValueOnce(snitchThreeFound)

    const promise = sut.handle(markUserAsInfectedDTO)

    expect(promise).rejects.toThrow(new Error('invalid_user'))
  })

  it('should call userRepo.findByIdAndUpdate with correct params', async () => {
    userRepo.findById.mockResolvedValueOnce(userToUpdateFound)

    const { isInfected, ...userAttrs } = userToUpdateFound

    await sut.handle(markUserAsInfectedDTO)

    expect(userRepo.findByIdAndUpdate).toHaveBeenCalledWith(userAttrs.id, {
      ...userAttrs,
      isInfected: true,
    })
    expect(userRepo.findByIdAndUpdate).toHaveBeenCalledTimes(1)
  })
})
