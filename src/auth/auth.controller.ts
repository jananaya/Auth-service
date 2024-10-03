import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';
import { ApiBody, ApiResponse } from '@nestjs/swagger';
import { CreateSessionPipe } from './create-session.pipe';
import { JwtResponseDto } from './dtos/jwt-response.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly createSessionPipe: CreateSessionPipe,
  ) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: HttpStatus.OK, type: JwtResponseDto })
  async login(
    @Body() loginDto: LoginDto,
    @Req() req: Request,
  ): Promise<JwtResponseDto> {
    const createSessionDto = this.createSessionPipe.transform(req);

    return this.authService.login(loginDto, createSessionDto);
  }
}
