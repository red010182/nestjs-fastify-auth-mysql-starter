import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { AppModule } from './app.module'
import helmet from '@fastify/helmet'

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter(), {
    logger: process.env.NODE_ENV === 'production' ? ['error'] : ['debug'],
  })
  // await app.register(helmet)

  // TODO: validation i18n
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  )
  app.enableCors()

  const options = new DocumentBuilder().setTitle('Title').setDescription('Description').setVersion('1.0').build()
  const document = SwaggerModule.createDocument(app, options)
  SwaggerModule.setup('apiDoc', app, document)

  await app.listen(+process.env.PORT, '0.0.0.0')
}
bootstrap()
