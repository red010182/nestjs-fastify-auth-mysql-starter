import { ExceptionFilter, Catch, ArgumentsHost, Logger, HttpException, HttpStatus } from '@nestjs/common'
import { FastifyRequest, FastifyReply } from 'fastify'

@Catch()
export class ErrorFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): any {
    const ctx = host.switchToHttp()
    const request = ctx.getRequest<FastifyRequest>()
    const reply = ctx.getResponse<FastifyReply>()

    if (request.url === '/favicon.ico') {
      return
    }

    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR

    const message = exception instanceof HttpException ? exception.message || null : 'Internal server error'

    const { url, method } = request

    const errorResponse = {
      code: status,
      path: url,
      method,
      message,
    }

    reply.send(errorResponse)

    const logMessage =
      exception instanceof HttpException ? JSON.stringify(errorResponse) : (exception as any).stack || exception

    // TODO: 注意 log 被打乱. request.id
    Logger.error(`${method} ${url}`, logMessage, 'ExceptionFilter')
  }
}
