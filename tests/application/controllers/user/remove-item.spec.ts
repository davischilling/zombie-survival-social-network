import { RemoveItemFromUserController } from '@/application/controllers/user'
import {
  IRemoveItemFromUserService,
  RemoveItemFromUserDTOType,
} from '@/domain/use-cases/user'
import { faker } from '@faker-js/faker'
import { mock, MockProxy } from 'jest-mock-extended'

describe('Remove Item from User Controller', () => {
  let removeItemFromUserDTO: RemoveItemFromUserDTOType
  let removeItemFromUserService: MockProxy<IRemoveItemFromUserService>
  let sut: RemoveItemFromUserController

  beforeAll(() => {
    removeItemFromUserDTO = {
      id: faker.datatype.uuid(),
    }
    removeItemFromUserService = mock()
  })

  beforeEach(() => {
    sut = new RemoveItemFromUserController(removeItemFromUserService)
  })

  it('should call removeItemFromUserService.handle with correct params', async () => {
    await sut.perform(removeItemFromUserDTO)

    expect(removeItemFromUserService.handle).toHaveBeenCalledWith(
      removeItemFromUserDTO
    )
    expect(removeItemFromUserService.handle).toHaveBeenCalledTimes(1)
  })

  it('should rethrow if removeItemFromUserService.handle throws', async () => {
    removeItemFromUserService.handle.mockRejectedValueOnce(
      new Error('service_error')
    )

    const promise = sut.perform(removeItemFromUserDTO)

    await expect(promise).rejects.toThrow(new Error('service_error'))
  })
})
