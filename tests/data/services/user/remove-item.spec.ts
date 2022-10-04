import { IRepository } from '@/data/contracts'
import Item from '@/data/entities/Item'
import { RemoveItemFromUserService } from '@/data/services/user'
import { ItemModel } from '@/domain/models'
import {
  IRemoveItemFromUserService,
  RemoveItemFromUserUseCase,
} from '@/domain/use-cases/user'
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
})
