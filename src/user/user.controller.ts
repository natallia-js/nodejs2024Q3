import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UseFilters,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { UsersService } from './user.service';
import { CreateUserDto, createUserSchema, UpdatePasswordDto, updatePasswordSchema, User, userIdSchema } from '../dto/user';
import { HttpExceptionFilter } from '../exceptions/http-exception.filter';
import { UserNotFoundException } from '../exceptions/user-not-found.exception';
import { WrongCurrentPasswordException } from '../exceptions/wrong-current-password.exception';
import ZodValidationPipe from 'src/pipes/zod-validation.pipe';
import { BadRequestParamsException } from 'src/exceptions/bad-request-params.exception';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  @HttpCode(200)
  @UseFilters(HttpExceptionFilter)
  async getAllUsers(): Promise<User[]> {
    return this.usersService.getAllUsers();
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':id')
  @HttpCode(200)
  @UseFilters(HttpExceptionFilter)
  async getUser(@Param('id', new ZodValidationPipe(userIdSchema)) id: string): Promise<User> {
    const user: User | null = await this.usersService.getUser(id);
    if (!user)
      throw new UserNotFoundException();
    return user;
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createUserSchema))
  @UseFilters(HttpExceptionFilter)
  async addUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    if (await this.usersService.userWithLoginExists(createUserDto.login))
      throw new BadRequestParamsException('User with this login already exists');
    return this.usersService.addUser(createUserDto);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Put(':id')
  @HttpCode(200)
  @UseFilters(HttpExceptionFilter)
  async changeUserPassword(
    @Param('id', new ZodValidationPipe(userIdSchema)) id: string,
    @Body(new ZodValidationPipe(updatePasswordSchema)) updatePasswordDto: UpdatePasswordDto): Promise<User>
  {
    const existingUserRecord: User | null = await this.usersService.getUser(id);
    if (!existingUserRecord)
      throw new UserNotFoundException();
    if (existingUserRecord.password !== updatePasswordDto.oldPassword)
      throw new WrongCurrentPasswordException();
    const user: User | null = await this.usersService.updateUserPassword(id, updatePasswordDto.newPassword);
    if (!user)
      throw new UserNotFoundException();
    return user;
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Delete(':id')
  @HttpCode(204)
  @UseFilters(HttpExceptionFilter)
  async deleteUser(@Param('id', new ZodValidationPipe(userIdSchema)) id: string): Promise<User> {
    const user: User | null = await this.usersService.deleteUser(id);
    if (!user)
      throw new UserNotFoundException();
    return user;
  }
}
