import { UserModel } from '@/domain/models'
import { UserRepository } from '@/infra/db/repositories'
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
  let user: UserModel

  beforeAll(async () => {
    user = generateUser(faker.datatype.uuid(), faker.datatype.boolean())
  })

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
})
