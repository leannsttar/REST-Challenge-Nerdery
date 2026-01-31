import { IsEmail, IsString, IsStrongPassword, IsNotEmpty } from 'class-validator';

export class SignUpDto {
	@IsNotEmpty()
	@IsEmail()
	readonly email!: string;

	@IsNotEmpty()
	@IsString()
	readonly name!: string;

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
    readonly password!: string;
}
