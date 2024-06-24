import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  Req,
  Res,
  Session,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserDto } from './dtos/user.dto';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { CurrentUserInterceptor } from './interceptors/curent-user.interceptor';
import { User } from './users.entity';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('auth')
@Serialize(UserDto)
@UseInterceptors(CurrentUserInterceptor)
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Get('/test')
  @UseGuards(AuthGuard)
  testFunc(@CurrentUser() user: User) {
    return user;
  }

  @Get('/find-person')
  findPerson(@CurrentUser() user: string) {
    return user;
  }

  @Post('/signout')
  signout(@Session() session: any) {
    session.userId = null;
  }

  @Post('/signup')
  async createUser(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signup(body.email, body.password);
    session.userId = user.id;
    return user;
  }

  @Post('/signin')
  async signin(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signin(body.email, body.password);
    console.log(user);
    session.userId = user.id;
    return user;
  }

  @Get('/:id')
  async findUser(@Req() req: Request) {
    console.log('handler is runnings');
    const user = await this.usersService.findOne(req.params.id);
    if (!user) {
      throw new NotFoundException('User is not found');
    }
    return user;
  }

  @Get('')
  async findAllUser(@Query('email') email: string, @Res() res: Response) {
    console.log('handler is runnings');
    const users = await this.usersService.find(email);
    return res.status(200).json({
      data: users,
      message: 'Success',
    });
  }

  @Put('/update/:id')
  updateUser(@Body() body: UpdateUserDto, @Param('id') id: string) {
    return this.usersService.update(id, body);
  }

  @Delete('/:id')
  removeUser(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
