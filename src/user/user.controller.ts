import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, Put } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ResponseUserDto } from './dto/response-user.dto';
import { DataSource } from 'typeorm';

@Controller('user')
export class UserController {
    constructor(private userService:UserService,private dataSource:DataSource){}

    @Get()
    async list():Promise<ApiResponse<ResponseUserDto[]>>{
        try {
            return await this.userService.list() as ApiResponse<ResponseUserDto[]>;
        } catch (error) {
            throw error(error);
        }
    }

    @Get(':id')
    async read(@Param() params: any):Promise<ApiResponse<ResponseUserDto>>{
        try {
            return await this.userService.findById(params.id) as ApiResponse<ResponseUserDto>;
        } catch (error) {
            throw error(error);
        }
    }

    @Post()
    async create(@Body() createUserDto:CreateUserDto):Promise<ApiResponse<ResponseUserDto>>{
        let res: ApiResponse<ResponseUserDto> | PromiseLike<ApiResponse<ResponseUserDto>>;

        const queryRunner = this.dataSource.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();
    
        try 
        {
            let checkuser = await this.userService.findByEmail(createUserDto.email);
            console.log(checkuser);
            res = await this.userService.create(createUserDto) as ApiResponse<ResponseUserDto>;
            if(checkuser){
                throw new HttpException(`${createUserDto.email} already exist!`, HttpStatus.BAD_REQUEST);
            }
            await queryRunner.commitTransaction();
        } catch (error) {
            await queryRunner.rollbackTransaction();
        }finally{
            await queryRunner.release();

        }

        return res;
    }

    @Put()
    async update(@Body() updateUserDto:UpdateUserDto):Promise<ApiResponse<ResponseUserDto>>{
        try {
            let findUser = await this.userService.findById(updateUserDto.Id);
            if(findUser == undefined){
                throw new HttpException("User doesn't exist!", HttpStatus.BAD_REQUEST);
            }
            findUser.firstname = updateUserDto.firstname;
            findUser.lastname = updateUserDto.lastname;
            findUser.password = updateUserDto.lastname;
            return await this.userService.update(findUser) as ApiResponse<ResponseUserDto>;
        } catch (error) {
            throw error(error);
        }
    }
}
