import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { FastifyRequest } from 'fastify'

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler())
    if (!roles || roles.length === 0) {
      return true
    }
    const request = context.switchToHttp().getRequest<FastifyRequest>()
    const user = request.raw['user']
    if (!user) return false

    const roleName = user.role
    // const hasRole = role => roles.includes(role)
    return roleName && roles.includes(roleName)
  }
}
