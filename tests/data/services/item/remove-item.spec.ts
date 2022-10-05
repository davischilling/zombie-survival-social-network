import { ServerError } from '@/application/errors'
import { IRepository } from '@/data/contracts'
import { RemoveItemFromUserService } from '@/data/services/item'
import { ItemModel } from '@/domain/models'
import {
  IRemoveItemFromUserService,
  RemoveItemFromUserUseCase,
} from '@/domain/use-cases/item'
import { faker } from '@faker-js/faker'
import { mock, MockProxy } from 'jest-mock-extended'

jest.mock('@/data/entities/Item')

describe('Remove Item from User Service', () => {
  let itemRepo: MockProxy<IRepository<ItemModel>>
  let removeItemFromUserDTO: RemoveItemFromUserUseCase.input
  let sut: IRemoveItemFromUserService

  beforeAll(() => {
    removeItemFromUserDTO = {
      id: faker.datatype.uuid(),
    }
    itemRepo = mock()
  })

  beforeEach(() => {
    sut = new RemoveItemFromUserService(itemRepo)
  })

  it('should call itemRepo.findByIdAndDelete with correct params', async () => {
    await sut.handle(removeItemFromUserDTO)

    expect(itemRepo.findByIdAndDelete).toHaveBeenCalledWith(
      removeItemFromUserDTO.id
    )
    expect(itemRepo.findByIdAndDelete).toHaveBeenCalledTimes(1)
  })

  it('should rethrow if itemRepo throws', async () => {
    const error = new ServerError(new Error('itemRepo_findById_error'))
    itemRepo.findByIdAndDelete.mockRejectedValueOnce(error)

    const findByIdPromise = sut.handle(removeItemFromUserDTO)

    await expect(findByIdPromise).rejects.toThrow(error)
  })
})
