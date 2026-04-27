import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) { //Create a JWT authentication strategy using Passport.
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extract token from request
      secretOrKey: process.env.JWT_SECRET ?? 'fallback_secret', // secret that verfy the token
    });
  }

  async validate(payload: { sub: string; email: string }) { //uns after the JWT token is successfully verified
    return { id: payload.sub, email: payload.email };
  }
}