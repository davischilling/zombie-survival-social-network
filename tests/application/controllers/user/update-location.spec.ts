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
})
