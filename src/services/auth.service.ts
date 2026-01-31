import { SignUpDto } from "../dtos/auth/requests/signup.dto";
import { SignInDto } from "../dtos/auth/requests/signin.dto";
import { AuthResponseDto } from "../dtos/auth/responses/auth-response.dto";
import { plainToInstance } from "class-transformer";
import { UserDto } from "../dtos/auth/responses/user.dto";
import { Conflict, Unauthorized } from "http-errors";
import createError from "http-errors";

import prisma from "../prisma";
import bcrypt from "bcrypt";
import jwt, {JwtPayload} from "jsonwebtoken";

import { Role } from "@prisma/client";


export class AuthService {
  private static generateToken(userId: number, email: string): string {
    return jwt.sign(
      { id: userId, email }, 
      process.env.JWT_SECRET || 'secret', 
      { expiresIn: '1h' }
    );
  }

  static async signup(body: SignUpDto): Promise<UserDto> {
    const exists = await prisma.user.findUnique({
      where: { email: body.email },
    });

    if (exists) {
      throw new Conflict("User with this email already exists");
    }

    const hashedPassword = await bcrypt.hash(body.password, 10);

    const user = await prisma.user.create({
      data: {
        email: body.email,
        name: body.name,
        password: hashedPassword,
        role: Role.CLIENT,
      },
    });

    return plainToInstance(UserDto, user, {
      excludeExtraneousValues: true,
    });
  }

  static async signin(body: SignInDto): Promise<AuthResponseDto> {
    const user = await prisma.user.findUnique({
      where: { email: body.email },
    });

    if (!user) {
      throw new Unauthorized("Invalid credentials");
    }

    const isPasswordCorrect = await bcrypt.compare(body.password, user.password);

    if (!isPasswordCorrect) {
      throw new Unauthorized("Invalid credentials")
    }

    const token = this.generateToken(user.id, user.email);  

    return plainToInstance(AuthResponseDto, {user, token}, {
      excludeExtraneousValues: true
    })
  }

  static async signout(token: string): Promise<void> {
    //save token in the revoked table
    await prisma.revokedTokens.create({
      data: { token },
    });
  }

  static async isTokenRevoked(token: string): Promise<boolean> {
    const found = await prisma.revokedTokens.findUnique({
      where: { token },
    });
    return found ? true : false; 
  }

  static async forgotPassword(email: string): Promise<string>{
    const user = await prisma.user.findUnique({
      where: {email}
    })

    const message = "Si el correo existe, se ha enviado un link de recuperación.";

    if (!user) return message

    const resetToken = jwt.sign(
      { sub: user.id, type: "reset"},
      process.env.JWT_SECRET || "secret",
      {expiresIn: "15m"}
    )

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetPasswordToken: resetToken
      }
    })

    // Simulación del email
    console.log("\n========================================================");
    console.log("📨 [MOCK EMAIL SERVICE] - Reset Password Email Sent");
    console.log(`👤 To User: ${user.email}`);
    console.log(`🔑 Token: ${resetToken}`);
    console.log("🔗 Link simulado: http://localhost:3000/reset-password?token=" + resetToken);
    console.log("========================================================\n");

    return message;
  }

  static async resetPassword(token: string, newPassword: string): Promise<void> {
    let decoded: JwtPayload;

    try {
      decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "secret"
      ) as JwtPayload;
    } catch (err) {
      throw createError.BadRequest("Invalid or expired token");
    }

    if (decoded.type !== "reset" || !decoded.sub) {
      throw createError.BadRequest("Invalid token type");
    }

    const userId = Number(decoded.sub);

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });


    if (!user || user.resetPasswordToken !== token) {
      throw createError.BadRequest("Invalid or expired token");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetPasswordToken: null,
      },
    });
  }
}