import { IIdGenerator } from '@/data/contracts'
import Item, { CreateItemModel } from '@/data/entities/Item'
import { ItemEnumTypes } from '@/domain/models'
import { faker } from '@faker-js/faker'
import { mock, MockProxy } from 'jest-mock-extended'

describe('Item Entity', () => {
  let generatedId: string
  let idGeneratorMock: MockProxy<IIdGenerator>
  let itemModelMock: CreateItemModel
  let sut: Item

  beforeAll(() => {
    itemModelMock = {
      name: faker.helpers.arrayElement([
        ItemEnumTypes.water,
        ItemEnumTypes.medicine,
        ItemEnumTypes.food,
        ItemEnumTypes.ammunition,
      ]),
      userId: faker.datatype.uuid(),
    }
    generatedId = faker.datatype.uuid()
    idGeneratorMock = mock()
    idGeneratorMock.perform.mockReturnValue(generatedId)
  })

  it('should fill the attrs on the constructor with correct params', () => {
    sut = new Item(itemModelMock, idGeneratorMock)

    expect(sut.name).toEqual(itemModelMock.name)
    expect(sut.userId).toEqual(itemModelMock.userId)
  })
})
