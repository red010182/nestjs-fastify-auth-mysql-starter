import { Controller, Get, InternalServerErrorException, Param, ParseIntPipe } from '@nestjs/common'
import { ApiOkResponse, ApiProperty, ApiResponse } from '@nestjs/swagger'
import { request } from 'http'
import { AppService } from './app.service'
import { Auth } from './auth/auth.decorator'
import { AuthService } from './auth/auth.service'
import { UserEntity } from './model/UserEntity'
import { MysqlService } from './mysql/mysql.service'
import { User } from './user/user.decorator'

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly authService: AuthService,
    private readonly db: MysqlService,
  ) {}

  @Get('/hello')
  helloWorld(): string {
    return this.appService.getHello()
  }

  // TODO: error code & i18n
  // TODO: message, error code, request ID
  @ApiOkResponse({ description: 'hi' })
  @Get('/hi/:id')
  greeting(@Param('id', ParseIntPipe) id: number): string {
    return `hi, ${id}`
  }

  @ApiResponse({ description: '500 Error' })
  @Get('/error')
  getError() {
    throw new InternalServerErrorException()
  }

  @Get('/login')
  async login() {
    const user = new UserEntity('1234')
    const token = this.authService.getToken(user)
    return {
      token,
      user,
    }
  }

  @Auth()
  @Get('/me')
  async me(@User() user: UserEntity) {
    return user
  }

  @Auth()
  @Get('/dbTest')
  async dbTest() {
    const [{ count }] = await this.db.query('SELECT COUNT(1) as count FROM user')
    return {
      userCount: count,
    }
  }
}
