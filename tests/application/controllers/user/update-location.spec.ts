import { UpdateUserLocationController } from '@/application/controllers/user'
import {
  UpdateUserLocationDTOType,
  IUpdateUserLocationService,
} from '@/domain/use-cases/user'
import { faker } from '@faker-js/faker'
import { mock, MockProxy } from 'jest-mock-extended'

describe('Update User Location Controller', () => {
  let updateUserLocationDTO: UpdateUserLocationDTOType
  let updateUserLocationService: MockProxy<IUpdateUserLocationService>
  let sut: UpdateUserLocationController

  beforeAll(() => {
    updateUserLocationDTO = {
      id: faker.datatype.uuid(),
      location: {
        latitude: faker.address.latitude(),
        longitude: faker.address.longitude(),
      },
    }
    updateUserLocationService = mock()
  })

  beforeEach(() => {
    sut = new UpdateUserLocationController(updateUserLocationService)
  })

  it('should call updateUserLocationService.handle with correct params', async () => {
    await sut.perform(updateUserLocationDTO)

    expect(updateUserLocationService.handle).toHaveBeenCalledWith(
      updateUserLocationDTO
    )
    expect(updateUserLocationService.handle).toHaveBeenCalledTimes(1)
  })

  it('should rethrow if updateUserLocationService.handle throws', async () => {
    updateUserLocationService.handle.mockRejectedValueOnce(
      new Error('service_error')
    )

    const promise = sut.perform(updateUserLocationDTO)

    await expect(promise).rejects.toThrow(new Error('service_error'))
  })

  it('should return 200 statusCode and update user location confirmation message on success', async () => {
    const httpResponse = await sut.perform(updateUserLocationDTO)

    expect(httpResponse).toEqual({
      statusCode: 200,
      data: { message: 'Updated user location' },
    })
  })
})
