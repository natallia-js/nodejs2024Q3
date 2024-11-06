import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import ZodValidationPipe from '../../pipes/zod-validation.pipe';
import { UsersService } from './user.service';
import {
  CreateUserDto,
  createUserSchema,
  UpdatePasswordDto,
  updatePasswordSchema,
  User,
  userIdSchema,
} from '../../dto/user';
import { InstanceNotFoundException } from '../../exceptions/instance-not-found.exception';
import { WrongCurrentPasswordException } from '../../exceptions/wrong-current-password.exception';
import { ApiResponse, ApiTags, getSchemaPath } from '@nestjs/swagger';
//import { BadRequestParamsException } from '../../exceptions/bad-request-params.exception';
import { ApiGetAllDataResponse } from '../../decorators/ApiGetAllDataResponse';
import { ApiGetCertainItemResponse } from '../../decorators/ApiGetCertainItemResponse';
import { ApiCreateNewInstanceResponse } from '../../decorators/ApiCreateNewInstanceResponse';
import { ApiModifyInstanceResponse } from '../../decorators/ApiModifyInstanceResponse';
import { Error as ErrorType } from '../../dto/error';
import { ApiDelInstanceResponse } from '../../decorators/ApiDelInstanceResponse';

@ApiTags('user')
@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  @HttpCode(200)
  @ApiGetAllDataResponse(User, ['Users'], 'users')
  async getAllUsers(): Promise<User[]> {
    return await this.usersService.getAllUsers();
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':id')
  @HttpCode(200)
  @ApiGetCertainItemResponse(User, ['Users'], 'user')
  async getUser(
    @Param('id', new ZodValidationPipe(userIdSchema)) id: string,
  ): Promise<User> {
    const user: User | null = await this.usersService.getUser(id);
    if (!user) throw new InstanceNotFoundException(`user with id = ${id}`);
    return user;
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createUserSchema))
  @ApiCreateNewInstanceResponse(User, ['Users'], 'user')
  async addUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    /*if (await this.usersService.userWithLoginExists(createUserDto.login))
      throw new BadRequestParamsException(
        'User with this login already exists',
      );*/
    return await this.usersService.addUser(createUserDto);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Put(':id')
  @HttpCode(200)
  @ApiModifyInstanceResponse('Update a user\'s password', 'Updates a user\'s password by ID',
    'The user\'s password has been updated', User, ['Users'], 'user')
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'oldPassword parameter is wrong. Error message: "Current password is wrong"',
    schema: {
      '$ref': getSchemaPath(ErrorType)
    },
  })
  async changeUserPassword(
    @Param('id', new ZodValidationPipe(userIdSchema)) id: string,
    @Body(new ZodValidationPipe(updatePasswordSchema))
    updatePasswordDto: UpdatePasswordDto,
  ): Promise<User> {
    const existingUserRecord: User | null = await this.usersService.getUser(id);
    if (!existingUserRecord)
      throw new InstanceNotFoundException(`user with id = ${id}`);
    if (existingUserRecord.password !== updatePasswordDto.oldPassword)
      throw new WrongCurrentPasswordException();
    const user: User | null = await this.usersService.updateUserPassword(
      id,
      updatePasswordDto.newPassword,
    );
    if (!user) throw new InstanceNotFoundException(`user with id = ${id}`);
    return user;
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Delete(':id')
  @HttpCode(204)
  @ApiDelInstanceResponse(User, ['Users'], 'user')
  async deleteUser(
    @Param('id', new ZodValidationPipe(userIdSchema)) id: string,
  ) {
    if (!(await this.usersService.deleteUser(id)))
      throw new InstanceNotFoundException(`user with id = ${id}`);
  }
}
