// tests/register.test.js

// Import the function we're testing
const { register } = require('../../controllers/auth.controllers') 

const { verifyUserExistence, createUser } = require('../../repositories/user.repository')
const { generateRefreshToken, generateAccessToken } = require('../../utils/jwt.utils') 
const { createSession } = require('../../services/session.service')

jest.mock('../../repositories/user.repository')
jest.mock('../../utils/jwt.utils')
jest.mock('../../services/session.service')

describe('register controller', () => {

  // Helper to build a fake req/res/next for every test
  let req, res, next

  beforeEach(() => {
    req = {
      body: {},
      ip: '127.0.0.1',
      headers: {},
      socket: {}
    }

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      cookie: jest.fn().mockReturnThis()
    }
    
    next = jest.fn()

    jest.clearAllMocks() // reset mocks before each test
  })

  test('should return 400 if fields are missing', async () => {
    req.body = { username: 'test' } // missing email/password/confirmPassword

    await register(req, res, next)

    expect(next).toHaveBeenCalled()
    const errorArg = next.mock.calls[0][0]
    expect(errorArg.message).toBe('All fields are required.')
    expect(errorArg.statusCode).toBe(400)
  })

  test('should return 400 if password is too short', async () => {
    req.body = {
      username: 'test',
      email: 'test@example.com',
      password: '123',
      confirmPassword: '123'
    }

    await register(req, res, next)

    const errorArg = next.mock.calls[0][0]
    expect(errorArg.message).toBe('Password must be at least 8 characters.')
    expect(errorArg.statusCode).toBe(400)
  })

  test('should return 400 if passwords do not match', async () => {
    req.body = {
      username: 'test',
      email: 'test@example.com',
      password: 'password123',
      confirmPassword: 'password456'
    }

    await register(req, res, next)

    const errorArg = next.mock.calls[0][0]
    expect(errorArg.message).toBe('Passwords do not match.')
    expect(errorArg.statusCode).toBe(400)
  })

  test('should return 409 if user already exists', async () => {
    req.body = {
      username: 'test',
      email: 'test@example.com',
      password: 'password123',
      confirmPassword: 'password123'
    }

    verifyUserExistence.mockResolvedValue(true) // simulate "user already exists"

    await register(req, res, next)

    const errorArg = next.mock.calls[0][0]
    expect(errorArg.message).toBe('User already exists.')
    expect(errorArg.statusCode).toBe(409)
  })

  test('should register a new user successfully', async () => {
    req.body = {
      username: 'test',
      email: 'test@example.com',
      password: 'password123',
      confirmPassword: 'password123'
    }

    // Simulate all dependencies working correctly
    verifyUserExistence.mockResolvedValue(false)
    createUser.mockResolvedValue({
      _id: 'user123',
      username: 'test',
      email: 'test@example.com',
      role: 'user'
    })
    generateRefreshToken.mockReturnValue('fake-refresh-token')
    createSession.mockResolvedValue({ _id: 'session123' })
    generateAccessToken.mockReturnValue('fake-access-token')

    await register(req, res, next)

    expect(res.status).toHaveBeenCalledWith(201)
    expect(res.cookie).toHaveBeenCalledWith('refreshToken', 'fake-refresh-token', expect.any(Object))
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        message: 'User registered successfully.',
        data: expect.objectContaining({
          id: 'user123',
          username: 'test',
          email: 'test@example.com'
        }),
        accessToken: 'fake-access-token'
      })
    )
    expect(next).not.toHaveBeenCalled()
  })

})