import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { Request, Response } from 'express';
import { UpdateUserDto } from './dtos/update-user.dto';

@Controller('auth')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('/signup')
  createUser(@Body() body: CreateUserDto) {
    return this.usersService.create(body.email, body.password);
  }

  @Get('/:id')
  findUser(@Req() req: Request) {
    return this.usersService.findOne(req.params.id);
  }

  @Get('')
  async findAllUser(@Query('email') email: string, @Res() res: Response) {
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
