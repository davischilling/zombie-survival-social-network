import { MarkUserAsInfectedController } from '@/application/controllers/user'
import {
  MarkUserAsInfectedDTOType,
  IMarkUserAsInfectedService,
} from '@/domain/use-cases/user'
import { faker } from '@faker-js/faker'
import { mock, MockProxy } from 'jest-mock-extended'

describe('Mark User As Infected Controller', () => {
  let markUserAsInfectedDTO: MarkUserAsInfectedDTOType
  let markUserAsInfectedService: MockProxy<IMarkUserAsInfectedService>
  let sut: MarkUserAsInfectedController

  beforeAll(() => {
    markUserAsInfectedDTO = {
      id: faker.datatype.uuid(),
      snitchOneId: faker.datatype.uuid(),
      snitchTwoId: faker.datatype.uuid(),
      snitchThreeId: faker.datatype.uuid(),
    }
    markUserAsInfectedService = mock()
  })

  beforeEach(() => {
    sut = new MarkUserAsInfectedController(markUserAsInfectedService)
  })

  it('should call markUserAsInfectedService.handle with correct params', async () => {
    await sut.perform(markUserAsInfectedDTO)

    expect(markUserAsInfectedService.handle).toHaveBeenCalledWith(
      markUserAsInfectedDTO
    )
    expect(markUserAsInfectedService.handle).toHaveBeenCalledTimes(1)
  })

  it('should rethrow if markUserAsInfectedService.handle throws', async () => {
    markUserAsInfectedService.handle.mockRejectedValueOnce(
      new Error('service_error')
    )

    const promise = sut.perform(markUserAsInfectedDTO)

    await expect(promise).rejects.toThrow(new Error('service_error'))
  })
})
