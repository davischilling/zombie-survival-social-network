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

const createItem = async (userId: string) => {
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

describe('Delete Item Route - DELETE /items/:id', () => {
  beforeEach(async () => {
    await db.sync()
  })

  it('should return 200 and a success message', async () => {
    const newUser = await createUser(faker.datatype.uuid(), false)
    const newItem = await createItem(newUser.id)

    const beforeItemRemoval: any = await ItemSchema.findAll()

    expect(beforeItemRemoval.length).toBe(1)

    const { statusCode, body } = await request(app)
      .delete(`/zssn-api/items/${newItem!.id}`)
      .set('Accept', 'application/json')

    expect(statusCode).toBe(200)
    expect(body.message).toBe('Item removed from user with success')

    const afterItemRemoval: any = await ItemSchema.findAll()

    expect(afterItemRemoval.length).toBe(0)
  })
})
