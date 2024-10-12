import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { isMatch } from '../auth/hash-functions/hash'
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(private userService:UserService,private jwtService:JwtService){}

    async signIn(email:string,password:string):Promise<{ access_token: string }>{
        const user = await this.userService.findByEmail(email);
        if(!(await isMatch(password,user.password))){
            throw new UnauthorizedException();
        }

        const payload = { sub: user.Id, username: user.email };
        return { access_token: await this.jwtService.signAsync(payload)};
    }
}
