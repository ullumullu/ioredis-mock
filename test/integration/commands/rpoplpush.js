import Redis from 'ioredis'

describe('rpoplpush', () => {
  it('should remove one item from the tail of the source list', () => {
    const redis = new Redis({
      data: {
        foo: ['foo', 'bar'],
      },
    })

    return redis.rpoplpush('foo', 'bar').then(() => {
      return expect(redis.data.get('foo')).toEqual(['foo'])
    })
  })

  it('should add one item to the head of the destination list', () => {
    const redis = new Redis({
      data: {
        foo: ['foo', 'bar'],
        bar: ['baz'],
      },
    })

    return redis.rpoplpush('foo', 'bar').then(() => {
      return expect(redis.data.get('bar')).toEqual(['bar', 'baz'])
    })
  })

  it('should return null if the source list does not exist', () => {
    const redis = new Redis({
      data: {},
    })

    return redis.rpoplpush('foo', 'bar').then(item => {
      return expect(item).toEqual(null)
    })
  })

  it('should return null if the source list is empty', () => {
    const redis = new Redis({
      data: {
        foo: [],
      },
    })

    return redis.rpoplpush('foo', 'bar').then(item => {
      return expect(item).toEqual(null)
    })
  })

  it('should return the item', () => {
    const redis = new Redis({
      data: {
        foo: ['foo', 'bar'],
      },
    })

    return redis.rpoplpush('foo', 'bar').then(item => {
      return expect(item).toBe('bar')
    })
  })

  it('should throw an exception if the source key contains something other than a list', () => {
    const redis = new Redis({
      data: {
        foo: 'not a list',
        bar: [],
      },
    })

    return redis.rpoplpush('foo', 'bar').catch(err => {
      return expect(err.message).toBe(
        'WRONGTYPE Operation against a key holding the wrong kind of value'
      )
    })
  })

  it('should throw an exception if the destination key contains something other than a list', () => {
    const redis = new Redis({
      data: {
        foo: [],
        bar: 'not a list',
      },
    })

    return redis.rpoplpush('foo', 'bar').catch(err => {
      return expect(err.message).toBe('Key bar does not contain a list')
    })
  })
})