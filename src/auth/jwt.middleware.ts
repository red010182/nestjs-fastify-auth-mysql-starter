/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, NestMiddleware } from '@nestjs/common'
import { FastifyRequest, FastifyReply } from 'fastify'
import { UserEntity } from 'src/model/UserEntity'
import { AuthService } from './auth.service'

declare module 'fastify' {
  export interface FastifyRequest {
    user?: UserEntity
  }
}

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor(private authService: AuthService) {}

  async use(req: FastifyRequest, res: FastifyReply, next: () => void) {
    let bearerAuth = req.headers['Authentication'] || req.headers['authentication'] || ''
    if (bearerAuth instanceof Array) {
      bearerAuth = bearerAuth[0]
    }
    const [_, token = req.query['token']] = bearerAuth?.split(' ')
    if (!token) {
      return next()
    }
    req.user = this.authService.parseToken(token)
    next()
  }
}
