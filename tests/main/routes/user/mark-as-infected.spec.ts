import { UserModel } from '@/domain/models'
import { UserRepository } from '@/infra/db/repositories/User'
import { UserSchema } from '@/infra/db/schemas/User'
import { app } from '@/main/config/app'
import { db } from '@/main/config/database'
import { generateUser } from '@/tests/main/routes/mocks/generateUser'
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

describe('Mark User as Infected Route - PATCH /users/:id/infected', () => {
  beforeEach(async () => {
    await db.sync()
  })

  it('should return 400 and invalid_user error if two ids are the same', async () => {
    const newUser = await createUser(faker.datatype.uuid(), false)
    const newSnitchTwo = await createUser(faker.datatype.uuid(), false)
    const newSnitchThree = await createUser(faker.datatype.uuid(), false)

    const { statusCode, body } = await request(app)
      .patch(`/users/${newUser.id}/infected`)
      .set('Accept', 'application/json')
      .query({
        snitchOneId: newUser.id,
        snitchTwoId: newSnitchTwo.id,
        snitchThreeId: newSnitchThree.id,
      })

    expect(statusCode).toBe(400)
    expect(body).toEqual({ error: 'invalid_user' })
  })

  it('should return 404 and not_found error if user to update does not exist', async () => {
    const newSnitchOne = await createUser(faker.datatype.uuid(), false)
    const newSnitchTwo = await createUser(faker.datatype.uuid(), false)
    const newSnitchThree = await createUser(faker.datatype.uuid(), false)

    const { statusCode, body } = await request(app)
      .patch(`/users/${faker.datatype.uuid()}/infected`)
      .set('Accept', 'application/json')
      .query({
        snitchOneId: newSnitchOne.id,
        snitchTwoId: newSnitchTwo.id,
        snitchThreeId: newSnitchThree.id,
      })

    expect(statusCode).toBe(404)
    expect(body).toEqual({ error: 'USER not_found' })
  })

  it('should return 404 and not_found error if snitch one does not exist', async () => {
    const newUser = await createUser(faker.datatype.uuid(), false)
    const newSnitchTwo = await createUser(faker.datatype.uuid(), false)
    const newSnitchThree = await createUser(faker.datatype.uuid(), false)

    const { statusCode, body } = await request(app)
      .patch(`/users/${newUser.id}/infected`)
      .set('Accept', 'application/json')
      .query({
        snitchOneId: faker.datatype.uuid(),
        snitchTwoId: newSnitchTwo.id,
        snitchThreeId: newSnitchThree.id,
      })

    expect(statusCode).toBe(404)
    expect(body).toEqual({ error: 'USER not_found' })
  })

  it('should return 404 and not_found error if snitch two does not exist', async () => {
    const newUser = await createUser(faker.datatype.uuid(), false)
    const newSnitchOne = await createUser(faker.datatype.uuid(), false)
    const newSnitchThree = await createUser(faker.datatype.uuid(), false)

    const { statusCode, body } = await request(app)
      .patch(`/users/${newUser.id}/infected`)
      .set('Accept', 'application/json')
      .query({
        snitchOneId: newSnitchOne.id,
        snitchTwoId: faker.datatype.uuid(),
        snitchThreeId: newSnitchThree.id,
      })

    expect(statusCode).toBe(404)
    expect(body).toEqual({ error: 'USER not_found' })
  })

  it('should return 404 and not_found error if snitch three does not exist', async () => {
    const newUser = await createUser(faker.datatype.uuid(), false)
    const newSnitchOne = await createUser(faker.datatype.uuid(), false)
    const newSnitchTwo = await createUser(faker.datatype.uuid(), false)

    const { statusCode, body } = await request(app)
      .patch(`/users/${newUser.id}/infected`)
      .set('Accept', 'application/json')
      .query({
        snitchOneId: newSnitchOne.id,
        snitchTwoId: newSnitchTwo.id,
        snitchThreeId: faker.datatype.uuid(),
      })

    expect(statusCode).toBe(404)
    expect(body).toEqual({ error: 'USER not_found' })
  })

  it('should return 400 and invalid_user error if user to update is already infected', async () => {
    const newUser = await createUser(faker.datatype.uuid(), true)
    const newSnitchOne = await createUser(faker.datatype.uuid(), false)
    const newSnitchTwo = await createUser(faker.datatype.uuid(), false)
    const newSnitchThree = await createUser(faker.datatype.uuid(), false)

    const { statusCode, body } = await request(app)
      .patch(`/users/${newUser.id}/infected`)
      .set('Accept', 'application/json')
      .query({
        snitchOneId: newSnitchOne.id,
        snitchTwoId: newSnitchTwo.id,
        snitchThreeId: newSnitchThree.id,
      })

    expect(statusCode).toBe(400)
    expect(body).toEqual({ error: 'invalid_user' })
  })

  it('should return 400 and invalid_user error if snitch one is infected', async () => {
    const newUser = await createUser(faker.datatype.uuid(), false)
    const newSnitchOne = await createUser(faker.datatype.uuid(), true)
    const newSnitchTwo = await createUser(faker.datatype.uuid(), false)
    const newSnitchThree = await createUser(faker.datatype.uuid(), false)

    const { statusCode, body } = await request(app)
      .patch(`/users/${newUser.id}/infected`)
      .set('Accept', 'application/json')
      .query({
        snitchOneId: newSnitchOne.id,
        snitchTwoId: newSnitchTwo.id,
        snitchThreeId: newSnitchThree.id,
      })

    expect(statusCode).toBe(400)
    expect(body).toEqual({ error: 'invalid_user' })
  })

  it('should return 400 and invalid_user error if snitch two is infected', async () => {
    const newUser = await createUser(faker.datatype.uuid(), false)
    const newSnitchOne = await createUser(faker.datatype.uuid(), false)
    const newSnitchTwo = await createUser(faker.datatype.uuid(), true)
    const newSnitchThree = await createUser(faker.datatype.uuid(), false)

    const { statusCode, body } = await request(app)
      .patch(`/users/${newUser.id}/infected`)
      .set('Accept', 'application/json')
      .query({
        snitchOneId: newSnitchOne.id,
        snitchTwoId: newSnitchTwo.id,
        snitchThreeId: newSnitchThree.id,
      })

    expect(statusCode).toBe(400)
    expect(body).toEqual({ error: 'invalid_user' })
  })

  it('should return 400 and invalid_user error if snitch three is infected', async () => {
    const newUser = await createUser(faker.datatype.uuid(), false)
    const newSnitchOne = await createUser(faker.datatype.uuid(), false)
    const newSnitchTwo = await createUser(faker.datatype.uuid(), false)
    const newSnitchThree = await createUser(faker.datatype.uuid(), true)

    const { statusCode, body } = await request(app)
      .patch(`/users/${newUser.id}/infected`)
      .set('Accept', 'application/json')
      .query({
        snitchOneId: newSnitchOne.id,
        snitchTwoId: newSnitchTwo.id,
        snitchThreeId: newSnitchThree.id,
      })

    expect(statusCode).toBe(400)
    expect(body).toEqual({ error: 'invalid_user' })
  })

  it('should return 200 and success message', async () => {
    const newUser = await createUser(faker.datatype.uuid(), false)
    const newSnitchOne = await createUser(faker.datatype.uuid(), false)
    const newSnitchTwo = await createUser(faker.datatype.uuid(), false)
    const newSnitchThree = await createUser(faker.datatype.uuid(), false)

    const { statusCode, body } = await request(app)
      .patch(`/users/${newUser.id}/infected`)
      .set('Accept', 'application/json')
      .query({
        snitchOneId: newSnitchOne.id,
        snitchTwoId: newSnitchTwo.id,
        snitchThreeId: newSnitchThree.id,
      })

    expect(statusCode).toBe(200)
    expect(body).toEqual({ message: 'Marked user as infected with success' })
  })
})
