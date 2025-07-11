import { SignUpDto } from '../dtos/auth/requests/signup.dto';
import { plainToInstance } from 'class-transformer';
import { UserDto } from '../dtos/auth/responses/user.dto';
import { Conflict } from 'http-errors'

import prisma  from '../prisma';

export class AuthService {

  static async signup(body: SignUpDto): Promise<UserDto> {
    const exists = await prisma.user.findUnique({ where: { email: body.email } });

    if (exists) {
      throw new Conflict('User with this email already exists');
    }

    const user = await prisma.user.create({ data: body });

    return plainToInstance(UserDto, user, {
      excludeExtraneousValues: true,
    });
  }
}
