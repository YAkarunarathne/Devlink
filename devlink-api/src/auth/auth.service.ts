import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private users: UsersService,
    private jwt: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.users.findByEmail(dto.email);
    if (existing) throw new ConflictException('Email already registered');

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = await this.users.create(dto.name, dto.email, passwordHash); // saving user to db

    const { passwordHash: _, ...result } = user; // remove password before returning
    return result;
  }

  async login(dto: LoginDto) {
    const user = await this.users.findByEmail(dto.email);
    const valid = user && (await bcrypt.compare(dto.password, user.passwordHash));
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    const token = this.jwt.sign({ sub: user.id, email: user.email });
    return { access_token: token };
  }
}