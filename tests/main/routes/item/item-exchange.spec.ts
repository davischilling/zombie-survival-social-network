import { ItemModel, UserModel } from '@/domain/models'
import { ItemRepository, UserRepository } from '@/infra/db/repositories'
import { ItemSchema } from '@/infra/db/schemas/Item'
import { UserSchema } from '@/infra/db/schemas/User'
import { app } from '@/main/config/app'
import { db } from '@/main/config/database'
import { generateItem, generateUser } from '@/tests/main/routes/mocks'
import { faker } from '@faker-js/faker'
import request from 'supertest'

const createUser = async (idParam: string, isInfectedParam: boolean) => {
  const user: UserModel = generateUser(idParam, isInfectedParam)
  const { id: _id, location, ...userAttrs } = user
  const { latitude, longitude } = location

  const createdSqliteUser: any = await UserSchema.create({
    _id,
    latitude,
    longitude,
    ...userAttrs,
  })

  const { dataValues } = createdSqliteUser
  return UserRepository.sqliteToDTO(dataValues)
}

const createItem = async (userId?: string) => {
  const item: ItemModel = generateItem({ userId })
  const { id: _id, ...itemAttrs } = item
  console.log(item)

  const createdSqliteItem: any = await ItemSchema.create({
    _id,
    ...itemAttrs,
  })

  const { dataValues } = createdSqliteItem
  return ItemRepository.sqliteToDTO(dataValues)
}

describe('Item Exchange Route - PATCH /items/exchange', () => {
  beforeEach(async () => {
    await db.sync()
  })

  it('should return 404 and not_found error if one of the items does not exist', async () => {
    const newItem = generateItem({})

    const { statusCode, body } = await request(app)
      .patch('/items/exchange')
      .set('Accept', 'application/json')
      .query({
        dealerId: faker.datatype.uuid(),
        clientId: faker.datatype.uuid(),
      })
      .send({
        dealerItems: [newItem, newItem],
        clientItems: [newItem],
      })

    expect(statusCode).toBe(404)
    expect(body).toEqual({ error: 'ITEM not_found' })
  })

  it('should return 400 and invalid_item error if one of the items does not belong to user', async () => {
    const newUserOne = await createUser(faker.datatype.uuid(), false)
    const newUserTwo = await createUser(faker.datatype.uuid(), false)

    const newItemOne = await createItem(newUserOne.id)
    const newItemTwo = await createItem(newUserOne.id)
    const newItemThree = await createItem(newUserTwo.id)

    const { statusCode, body } = await request(app)
      .patch('/items/exchange')
      .set('Accept', 'application/json')
      .query({
        dealerId: faker.datatype.uuid(),
        clientId: faker.datatype.uuid(),
      })
      .send({
        dealerItems: [newItemOne, newItemTwo],
        clientItems: [newItemThree],
      })

    expect(statusCode).toBe(400)
    expect(body).toEqual({ error: 'invalid_item' })
  })
})
