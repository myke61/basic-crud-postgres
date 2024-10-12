import { Injectable  } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { hashPassword} from '../auth/hash-functions/hash'
import { Role } from './enum/role.enum';
import { ResponseUserDto } from './dto/response-user.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) private userRepository:Repository<User>,
    ){}

    async create(createUserDto:CreateUserDto):Promise<ResponseUserDto>{
        let user = new User();
        user.firstname = createUserDto.firstname.toLowerCase();
        user.lastname = createUserDto.lastname.toLowerCase();
        user.email = createUserDto.email.toLowerCase();
        user.password = (await hashPassword(createUserDto.password)).toString();
        user.userType = Role.User;
        return await this.userRepository.save(user);
    }

    async findByEmail(email:string):Promise<User | undefined>{
        return await this.userRepository.findOneBy({email});
    }

    async update(user:User):Promise<User>{
        user.password = (await hashPassword(user.password)).toString();
        return await this.userRepository.save(user);
    }

    async findById(Id:string):Promise<User | undefined>{
        return await this.userRepository.findOneBy({Id});
    }

    async list():Promise<ResponseUserDto[]>{
        return await this.userRepository.find();
    }
}
