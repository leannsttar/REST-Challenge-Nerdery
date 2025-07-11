import { IsEmail, IsString, MinLength } from 'class-validator';

export class SignUpDto {
	@IsEmail()
	readonly email!: string;

	@IsString()
	readonly name!: string;

	@IsString()
	readonly role!: string;

	@IsString()
	@MinLength(4)
	readonly password!: string;
}
