import { Exclude, Expose, Type } from 'class-transformer';
import { UserDto } from './user.dto';

@Exclude()
export class AuthResponseDto {
  @Expose()
  @Type(() => UserDto)
  user!: UserDto;

  @Expose()
  token!: string;
}