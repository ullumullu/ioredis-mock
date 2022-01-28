import Redis from 'ioredis'

describe('connect', () => {
  it('should throw if redis has already connected in ctor', done => {
    // no option specified means {lazyConnect: false}
    const redis = new Redis()

    setTimeout(() => {
      redis
        .connect()
        .then(() => {
          throw new Error('connect should not have succeeded')
        })
        .catch(reason => {
          expect(reason.message).toBe('Redis is already connecting/connected')
          done()
        })
    }, 20)
  })

  it('should signal successful connection', done => {
    const redis = new Redis({ lazyConnect: true })

    setTimeout(() => {
      redis
        .connect()
        .catch(reason => {
          return expect(reason).toBeFalsy()
        })
        .then(result => {
          expect(result).toBe(undefined)
          done()
        })
    }, 20)
  })

  it('should throw if manually connected before', () => {
    const redis = new Redis({ lazyConnect: true })

    return redis
      .connect()
      .then(result => {
        return expect(result).toBe(undefined)
      })
      .then(() => {
        return new Promise(resolve => {
          redis
            .connect()
            .catch(reason => {
              return expect(reason).toBeInstanceOf(Error)
            })
            .then(() => {
              return resolve()
            })
        })
      })
  })

  it('should throw if executing any command when not connected', () => {
    const redis = new Redis({ lazyConnect: true })

    return redis
      .get('key')
      .then(() => {
        throw new Error('get shall not succeed when redis is not connected')
      })
      .catch(reason => {
        return expect(reason.message).toBe(
          "Stream isn't writeable and enableOfflineQueue options is false"
        )
      })
  })
})