import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { FastifyRequest } from 'fastify'
import { UserEntity } from 'src/model/UserEntity'

export const User = createParamDecorator((data: keyof UserEntity, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest<FastifyRequest>()
  const user = request.raw['user']

  return data ? user?.[data] : user
})
