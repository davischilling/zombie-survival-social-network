import { ItemEnumTypes, ItemModel } from '@/domain/models'
import { ItemRepository } from '@/infra/db/repositories'
import { ItemSchema } from '@/infra/db/schemas/Item'
import { faker } from '@faker-js/faker'

jest.mock('@/infra/db/schemas/Item')

describe('Item Repository', () => {
  let itemModelMock: ItemModel
  let fakeItemSchema: jest.Mocked<typeof ItemSchema>
  let sut: ItemRepository

  beforeAll(() => {
    itemModelMock = {
      id: faker.datatype.uuid(),
      name: ItemEnumTypes.water,
      points: 4,
      userId: faker.datatype.uuid(),
    }
    fakeItemSchema = ItemSchema as jest.Mocked<typeof ItemSchema>
    fakeItemSchema.create.mockResolvedValue(itemModelMock)
  })

  beforeEach(() => {
    sut = new ItemRepository()
  })

  it('should create a new Item for the user returning its id', async () => {
    const id = await sut.create(itemModelMock)

    const { id: _id, ...itemAttrs } = itemModelMock

    expect(fakeItemSchema.create).toHaveBeenCalledWith({
      _id,
      ...itemAttrs,
    })
    expect(fakeItemSchema.create).toHaveBeenCalledTimes(1)

    expect(id).toBe(itemModelMock.id)
  })

  it('should call destroy with correct params', async () => {
    await sut.findByIdAndDelete(itemModelMock.id)

    expect(fakeItemSchema.destroy).toHaveBeenCalledWith({
      where: { _id: itemModelMock.id },
    })
    expect(fakeItemSchema.destroy).toHaveBeenCalledTimes(1)
  })
})
