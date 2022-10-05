import { UserModel } from '@/domain/models'
import { UserRepository } from '@/infra/db/repositories'
import { ItemSchema } from '@/infra/db/schemas/Item'
import { UserSchema } from '@/infra/db/schemas/User'
import { app } from '@/main/config/app'
import { db } from '@/main/config/database'
import { faker } from '@faker-js/faker'
import request from 'supertest'

import { generateUser } from '../mocks/generateUser'

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

describe('Create Item Route - POST /items/:userId', () => {
  beforeEach(async () => {
    await db.sync()
  })

  it('should return 404 and not_found error if user does not exist', async () => {
    const { statusCode, body } = await request(app)
      .post(`/items/${faker.datatype.uuid()}`)
      .set('Accept', 'application/json')
      .send({ name: 'water' })

    expect(statusCode).toBe(404)
    expect(body).toEqual({ error: 'USER not_found' })
  })

  it('should return 201 and a success message', async () => {
    const newUser = await createUser(faker.datatype.uuid(), false)

    const beforeItemCreation: any = await ItemSchema.findAll()

    expect(beforeItemCreation.length).toBe(0)

    const { statusCode, body } = await request(app)
      .post(`/items/${newUser.id}`)
      .set('Accept', 'application/json')
      .send({ name: 'water' })

    expect(statusCode).toBe(201)
    expect(body.message).toBe('Item added to user with success')

    const afterItemCreation: any = await ItemSchema.findAll()

    expect(afterItemCreation.length).toBe(1)
  })
})
