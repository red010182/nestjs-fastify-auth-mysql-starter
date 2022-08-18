import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthGuard } from './auth.guard'
import { RolesGuard } from './roles.guard'
@Module({
  providers: [AuthService, AuthGuard, RolesGuard],
  exports: [AuthService],
})
export class AuthModule {}
