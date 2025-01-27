import Redis from 'ioredis'

describe('zcard', () => {
  it('should return the number of items in the sorted set', () => {
    const redis = new Redis({
      data: {
        foo: new Map([
          [1, 'one'],
          [3, 'three'],
          [4, 'four'],
        ]),
      },
    })

    return redis.zcard('foo').then(length => {
      return expect(length).toBe(3)
    })
  })

  it('should return 0 if the sorted set does not exist', () => {
    const redis = new Redis()

    return redis.zcard('foo').then(length => {
      return expect(length).toBe(0)
    })
  })

  it('should throw an exception if the key contains something other than a sorted set', () => {
    const redis = new Redis({
      data: {
        foo: 'not a sorted set',
      },
    })

    return redis.zcard('foo').catch(err => {
      return expect(err.message).toBe('Key foo does not contain a sorted set')
    })
  })
})
