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
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserDto } from './dtos/user.dto';
import { UsersService } from './users.service';

@Controller('auth')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('/signup')
  createUser(@Body() body: CreateUserDto) {
    return this.usersService.create(body.email, body.password);
  }

  @Serialize(UserDto)
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
