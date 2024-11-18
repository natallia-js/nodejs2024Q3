import { Controller, UseInterceptors, ClassSerializerInterceptor, Post, HttpCode, UsePipes, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, User, createUserSchema, authUserSchema, AuthUserDto, RefreshTokenDto, refreshTokenSchema } from '../../dto/user';
import ZodValidationPipe from '../../pipes/zod-validation.pipe';
import { ApiCreateNewInstanceResponse } from '../../decorators/ApiCreateNewInstanceResponse';
import { ApiLoginResponse } from '../../decorators/ApiLoginResponse';
import { Tokens } from '../../dto/tokens';
import { ApiRefreshTokensResponse } from '../../decorators/ApiRefreshTokensResponse';
import { Public } from '../../decorators/Public';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ) {}

  @Public()
  @UseInterceptors(ClassSerializerInterceptor)
  @Post('signup')
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createUserSchema))
  @ApiCreateNewInstanceResponse(User, ['auth'], 'user')
  async signup(@Body() createUserDto: CreateUserDto): Promise<User> {
    return await this.authService.signup(createUserDto);
  }

  @Public()
  @UseInterceptors(ClassSerializerInterceptor)
  @Post('login')
  @HttpCode(200)
  @UsePipes(new ZodValidationPipe(authUserSchema))
  @ApiLoginResponse(['auth'])
  async login(@Body() authUserDto: AuthUserDto): Promise<Tokens> {
    return await this.authService.login(authUserDto);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('refresh')
  @HttpCode(200)
  @UsePipes(new ZodValidationPipe(refreshTokenSchema))
  @ApiRefreshTokensResponse(['auth'])
  async refresh(@Body() refreshTokenDto: RefreshTokenDto): Promise<Tokens> {
    return await this.authService.refresh(refreshTokenDto);
  }  
}
