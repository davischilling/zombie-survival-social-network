import { NotFoundError } from '@/data/errors'
import { ItemEnumTypes, ItemModel } from '@/domain/models'
import { ItemRepository, SqliteItemModel } from '@/infra/db/repositories'
import { ItemSchema } from '@/infra/db/schemas/Item'
import { faker } from '@faker-js/faker'

jest.mock('@/infra/db/schemas/Item')

describe('Item Repository', () => {
  let sqliteResponse: SqliteItemModel
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
    sqliteResponse = {
      id: 1,
      _id: itemModelMock.id,
      name: itemModelMock.name,
      points: itemModelMock.points,
      userId: itemModelMock.userId,
      createdAt: faker.datatype.datetime(),
      updatedAt: faker.datatype.datetime(),
    }
    fakeItemSchema = ItemSchema as jest.Mocked<typeof ItemSchema>
    fakeItemSchema.create.mockResolvedValue(itemModelMock)
    fakeItemSchema.findAll.mockResolvedValue([
      {
        dataValues: sqliteResponse,
      } as any,
    ])
    fakeItemSchema.destroy.mockResolvedValue(1)
    fakeItemSchema.findOne.mockResolvedValue({
      dataValues: sqliteResponse,
    } as any)
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

  it('should call findAll with correct params and return a list of items', async () => {
    const name = ItemEnumTypes.water

    await sut.find({ name })

    expect(fakeItemSchema.findAll).toHaveBeenCalledWith({
      where: { name },
    })
    expect(fakeItemSchema.findAll).toHaveBeenCalledTimes(1)
  })

  it('should call findAll with correct params and return a list of users', async () => {
    const name = ItemEnumTypes.water

    const response = await sut.find({ name })

    const users = [
      {
        dataValues: sqliteResponse,
      } as any,
    ]
    const itemsDTO = users.map((user: any) => {
      const { dataValues } = user
      return ItemRepository.sqliteToDTO(dataValues)
    })

    expect(fakeItemSchema.findAll).toHaveBeenCalledWith({
      where: { name },
    })
    expect(fakeItemSchema.findAll).toHaveBeenCalledTimes(1)
    expect(response).toEqual({
      items: 1,
      data: itemsDTO,
    })
  })

  it('should call findAll with correct params and return an empty list', async () => {
    fakeItemSchema.findAll.mockResolvedValueOnce([])
    const name = ItemEnumTypes.water

    const response = await sut.find({ name })

    expect(fakeItemSchema.findAll).toHaveBeenCalledWith({
      where: { name },
    })
    expect(fakeItemSchema.findAll).toHaveBeenCalledTimes(1)
    expect(response).toEqual({
      items: 0,
      data: [],
    })
  })

  it('should call destroy with correct params and throw not found if theres no item to delete', async () => {
    await sut.findByIdAndDelete(itemModelMock.id)

    expect(fakeItemSchema.destroy).toHaveBeenCalledWith({
      where: { _id: itemModelMock.id },
    })
    expect(fakeItemSchema.destroy).toHaveBeenCalledTimes(1)

    fakeItemSchema.destroy.mockResolvedValueOnce(0)

    const promise = sut.findByIdAndDelete(itemModelMock.id)

    expect(promise).rejects.toThrow(new NotFoundError('item'))
  })

  it('should call update with correct params and return the updated user id', async () => {
    const id = await sut.findByIdAndUpdate(itemModelMock.id, itemModelMock)

    const { id: _id, ...userAttrs } = itemModelMock

    expect(fakeItemSchema.update).toHaveBeenCalledWith(userAttrs, {
      where: { _id },
    })
    expect(fakeItemSchema.update).toHaveBeenCalledTimes(1)
    expect(id).toEqual(_id)
  })

  it('should call findOne with correct params, return an user', async () => {
    const id = faker.datatype.uuid()

    const user = await sut.findById(id)

    expect(fakeItemSchema.findOne).toHaveBeenCalledWith({
      where: { _id: id },
    })
    expect(fakeItemSchema.findOne).toHaveBeenCalledTimes(1)
    expect(user).toEqual(itemModelMock)
  })

  it('should call findOne with correct params and null if not found', async () => {
    const id = faker.datatype.uuid()
    fakeItemSchema.findOne.mockResolvedValueOnce(null)

    const item = await sut.findById(id)

    expect(fakeItemSchema.findOne).toHaveBeenCalledWith({
      where: { _id: id },
    })
    expect(fakeItemSchema.findOne).toHaveBeenCalledTimes(1)
    expect(item).toEqual(null)
  })

  it('should call findByOneParam with correct params and return an user', async () => {
    const name = faker.name.firstName()

    const user = await sut.findOneByParam({ name })

    expect(fakeItemSchema.findOne).toHaveBeenCalledWith({
      where: { name },
    })
    expect(fakeItemSchema.findOne).toHaveBeenCalledTimes(1)
    expect(user).toEqual(itemModelMock)
  })

  it('should call findByOneParam with correct params and null if not found', async () => {
    const name = faker.name.firstName()
    fakeItemSchema.findOne.mockResolvedValueOnce(null)

    const user = await sut.findOneByParam({ name })

    expect(fakeItemSchema.findOne).toHaveBeenCalledWith({
      where: { name },
    })
    expect(fakeItemSchema.findOne).toHaveBeenCalledTimes(1)
    expect(user).toEqual(null)
  })
})
