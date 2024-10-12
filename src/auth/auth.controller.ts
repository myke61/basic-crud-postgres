import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SetMetadata } from '@nestjs/common';
import { DataSource } from 'typeorm';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService,private dataSource: DataSource) {}

    @HttpCode(HttpStatus.OK)
    @Public()
    @Post('login')
    async signIn(@Body() signInDto: Record<string, any>) {
        let res: { access_token: string; };
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            res = await this.authService.signIn(signInDto.email, signInDto.password);
            await queryRunner.commitTransaction();
        } catch (error) {
            await queryRunner.rollbackTransaction();
        }finally{
            await queryRunner.release();
        }
        return res;
    }
}
