import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  UseGuards,
  Request,
  ForbiddenException,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMe(@Request() req: any) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  updateUser(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
    @Request() req: any,
  ) {
    if (req.user.id !== id) throw new ForbiddenException('Access denied');
    return this.usersService.updateUser(id, dto);
  }
}
