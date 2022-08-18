import { Injectable, NestInterceptor, ExecutionContext, Logger, CallHandler } from '@nestjs/common'
import { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'
import { FastifyRequest } from 'fastify'

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {
    const now = Date.now()
    const request = context.switchToHttp().getRequest<FastifyRequest>()
    return next.handle().pipe(
      tap(() => {
        Logger.log(`${request.method} ${request.url} ${Date.now() - now}ms`, context.getClass().name)
      }),
    )
  }
}
