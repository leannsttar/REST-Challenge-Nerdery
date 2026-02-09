import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { validateBody } from "../utils/validate"

import { SignUpDto } from "../dtos/auth/requests/signup.dto"
import { SignInDto } from "../dtos/auth/requests/signin.dto";
import { ForgotPasswordDto } from "../dtos/auth/requests/forgot-password.dto";
import { ResetPasswordDto } from "../dtos/auth/requests/reset-password.dto";

export async function signup(req: Request, res: Response): Promise<void> {
  const dto = await validateBody(SignUpDto, req.body )

  const result = await AuthService.signup(dto)

  res.status(201).json(result)
}

export async function signin(req: Request, res: Response): Promise<void> {
  const dto = await validateBody(SignInDto, req.body)

  const result = await AuthService.signin(dto);
  res.status(200).json(result)
}

export async function signout(req: Request, res: Response): Promise<void> {
  // extraer el token
  const token = req.headers.authorization?.split(" ")[1]

  if (token) {
    await AuthService.signout(token)
  }

  res.status(200).json({ message: "logged out successfully!" })
}

export async function forgotPassword(req: Request, res: Response): Promise<void> {
  const dto = await validateBody(ForgotPasswordDto, req.body)
  
  const message= await AuthService.forgotPassword(dto.email)
  
  res.status(200).json({message })
}

export async function resetPassword(req: Request, res: Response): Promise<void> {
  const dto = await validateBody(ResetPasswordDto, req.body)

  await AuthService.resetPassword(dto.token, dto.newPassword)

  res.status(200).json({
    message: "Password updated successfully"
  })
}