import { IsNotEmpty, IsString, IsStrongPassword } from 'class-validator';

export class ResetPasswordDto {
    @IsNotEmpty()
    @IsString()
    readonly token!: string;

    @IsNotEmpty()
    @IsString()
    @IsStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1
    }, {
        message: "The password is too weak. It must be at least 8 characters long and contain one uppercase letter, one lowercase letter, one number, and one symbol"
    })
    readonly newPassword!: string;
}
