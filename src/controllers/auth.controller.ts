import { plainToInstance } from "class-transformer";
import { Request, Response } from "express";
import { SignUpDto } from "../dtos/auth/requests/signup.dto";
import { SignInDto } from "../dtos/auth/requests/signin.dto";
import { ForgotPasswordDto } from "../dtos/auth/requests/forgot-password.dto";
import { ResetPasswordDto } from "../dtos/auth/requests/reset-password.dto";
import { validate } from "class-validator";
import { AuthService } from "../services/auth.service";


export async function signup(req: Request, res: Response): Promise<void> {
  const dto = plainToInstance(SignUpDto, req.body);
  const errors = await validate(dto);

  if (errors.length > 0) {
    res.status(400).send({ message: "Validation failed", details: errors });
    return;
  }

  try {
    const result = await AuthService.signup(dto);

    res.status(200).json(result);
  } catch (error: unknown) {
    if (error instanceof Error) {
      const statusCode = (error as any).statusCode || 500;

      res.status(statusCode).json({
        message: error.message || "Internal server error",
        name: error.name,
      });
    } else {
      res.status(500).json({
        message: "Internal server error",
        name: "UnknownError",
      });
    }
  }
}

export async function signin(req: Request, res: Response): Promise<void> {
  const dto = plainToInstance(SignInDto, req.body);
  const errors = await validate(dto);

  if (errors.length > 0) {
    res.status(400).send({ message: "Validation failed", details: errors });
    return;
  }

  try {
    const result = await AuthService.signin(dto);
    res.status(200).json(result);
    } catch (error: unknown) {
    if (error instanceof Error) {
      const statusCode = (error as any).statusCode || 500;

      res.status(statusCode).json({
        message: error.message || "Internal server error",
        name: error.name,
      });
    } else {
      res.status(500).json({
        message: "Internal server error",
        name: "UnknownError",
      });
    }
  }
}

export async function signout(req: Request, res: Response): Promise<void> {
	const token = req.header('Authorization'.replace('Bearer', ''))
	if (token) {
		await AuthService.signout(token);
		res.status(200).json({ message: "logged out successfully!"})
	}
}

export async function forgotPassword(req: Request, res: Response): Promise<void> {
	const dto = plainToInstance(ForgotPasswordDto, req.body)
	const errors = await validate(dto);

	if (errors.length > 0) {
		res.status(400).json({
			message: "Validation failed",
			details: errors,
		})
		return;
	}

	try {
		const message = await AuthService.forgotPassword(dto.email)
		res.status(200).json({ message })
	} catch (error: unknown) {
	
		if (error instanceof Error) {
		res.status(500).json({
			message: error.message,
			name: error.name,
		});
		} else {
		res.status(500).json({
			message: "Internal server error",
			name: "UnknownError",
		});
		}
	}
}

export async function resetPassword(req: Request, res: Response): Promise<void> {
	const dto = plainToInstance(ResetPasswordDto, req.body);
	const errors = await validate(dto);

	if (errors.length > 0) {
				res.status(400).json({
			message: "Validation failed",
			details: errors,
		})
		return;
	}

	try {
		await AuthService.resetPassword(dto.token, dto.newPassword);
		res.status(200).json({
		message: "Password updated successfully",
		});
	} catch (error: unknown) {
    if (error instanceof Error) {
      const statusCode = (error as any).statusCode || 500;

      res.status(statusCode).json({
        message: error.message,
        name: error.name,
      });
    } else {
      res.status(500).json({
        message: "Internal server error",
        name: "UnknownError",
      });
    }
  }
}
