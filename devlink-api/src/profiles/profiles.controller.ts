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
import { ProfilesService } from './profiles.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
export class ProfilesController {
  constructor(private profiles: ProfilesService) {}

  // Public
  @Get(':id/profile')
  getProfile(@Param('id') id: string) {
    return this.profiles.getProfile(id);
  }

  // Protected
  @UseGuards(JwtAuthGuard)
  @Patch(':id/profile')
  updateProfile(
    @Param('id') id: string,
    @Body() dto: UpdateProfileDto,
    @Request() req,
  ) {
    if (req.user.id !== id) throw new ForbiddenException('Access denied');
    return this.profiles.updateProfile(id, dto);
  }
}