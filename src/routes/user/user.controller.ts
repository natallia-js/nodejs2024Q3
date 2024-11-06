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
  UseInterceptors,
  UsePipes,
  HttpStatus,
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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
//import { BadRequestParamsException } from '../../exceptions/bad-request-params.exception';
import { Error as ErrorType } from '../../dto/error';
import { ApiGetAllDataResponse } from '../../decorators/ApiGetAllDataResponse';

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
  @ApiOperation({
    summary: 'Get single user by id',
    description: 'Gets single user by id',
    tags: ['Users'],
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful operation',
    type: User,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad request. Parameter id is invalid (not uuid). ' +
                 'Error message: "Bad request params: User id is not valid"',
    type: ErrorType,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User not found. Error message: "Instance not found: user with id = [id]"',
    type: ErrorType,
  })  
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
  @ApiOperation({
    summary: 'Create user',
    description: 'Creates a new user',
    tags: ['Users'],
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The user has been created',
    type: User,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad request. Body does not contain required field(-s) or field value(-s) is(are) incorrect. ' +
                 'Possible error messages are "Bad request params: \\"[field name]\\": Required", ' +
                 '"Minimal [field name] length is 1 symbol"',
    type: ErrorType,
  })  
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
  async deleteUser(
    @Param('id', new ZodValidationPipe(userIdSchema)) id: string,
  ) {
    if (!(await this.usersService.deleteUser(id)))
      throw new InstanceNotFoundException(`user with id = ${id}`);
  }
}
