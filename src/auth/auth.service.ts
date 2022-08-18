import { Injectable } from '@nestjs/common'
import { sign, decode } from 'jsonwebtoken'
import { UserEntity } from 'src/model/UserEntity'
import { jwtConstants } from './auth.constants'

type Token = string

@Injectable()
export class AuthService {
  parseToken(token: Token) {
    return token ? (decode(token) as UserEntity) : null
  }

  getToken(user: UserEntity): Token {
    return sign({ ...user }, jwtConstants.secret, {
      expiresIn: '7d',
    })
  }
}
