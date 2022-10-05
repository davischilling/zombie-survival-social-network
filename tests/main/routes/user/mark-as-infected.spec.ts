import { UserModel } from '@/domain/models'
import { UserRepository } from '@/infra/db/repositories/User'
import { UserSchema } from '@/infra/db/schemas/User'
import { app } from '@/main/config/app'
import { db } from '@/main/config/database'
import { faker } from '@faker-js/faker'
import request from 'supertest'

import { generateUser } from '../mocks/generateUser'

const createUser = async () => {
  const user = generateUser()
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

describe('Mark User as Infected Route - PATCH /users/:id/infected', () => {
  let user: UserModel

  beforeAll(async () => {
    user = generateUser()
  })

  beforeEach(async () => {
    await db.sync()
  })

  it('should return 404 and not_found error if user to update does not exist', async () => {
    const id = faker.datatype.uuid()

    const { statusCode, body } = await request(app)
      .patch(`/users/${id}/infected`)
      .set('Accept', 'application/json')
      .query({
        snitchOneId: faker.datatype.uuid(),
        snitchTwoId: faker.datatype.uuid(),
        snitchThreeId: faker.datatype.uuid(),
      })

    expect(statusCode).toBe(404)
    expect(body).toEqual({ error: 'not_found' })
  })

  it('should return 404 and not_found error if snitch one does not exist', async () => {
    const user = await createUser()

    const { statusCode, body } = await request(app)
      .patch(`/users/${user.id}/infected`)
      .set('Accept', 'application/json')
      .query({
        snitchOneId: faker.datatype.uuid(),
        snitchTwoId: faker.datatype.uuid(),
        snitchThreeId: faker.datatype.uuid(),
      })

    expect(statusCode).toBe(404)
    expect(body).toEqual({ error: 'not_found' })
  })

  it('should return 404 and not_found error if snitch two does not exist', async () => {
    const user = await createUser()
    const snitchOne = await createUser()

    const { statusCode, body } = await request(app)
      .patch(`/users/${user.id}/infected`)
      .set('Accept', 'application/json')
      .query({
        snitchOneId: snitchOne.id,
        snitchTwoId: faker.datatype.uuid(),
        snitchThreeId: faker.datatype.uuid(),
      })

    expect(statusCode).toBe(404)
    expect(body).toEqual({ error: 'not_found' })
  })

  it('should return 404 and not_found error if snitch three does not exist', async () => {
    const user = await createUser()
    const snitchOne = await createUser()
    const snitchTwo = await createUser()

    const { statusCode, body } = await request(app)
      .patch(`/users/${user.id}/infected`)
      .set('Accept', 'application/json')
      .query({
        snitchOneId: snitchOne.id,
        snitchTwoId: snitchTwo.id,
        snitchThreeId: faker.datatype.uuid(),
      })

    expect(statusCode).toBe(404)
    expect(body).toEqual({ error: 'not_found' })
  })
})
