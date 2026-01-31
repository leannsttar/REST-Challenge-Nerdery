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
        message: "La contraseña es muy débil. Debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un símbolo."
    })
    readonly newPassword!: string;
}
