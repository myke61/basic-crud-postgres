import { BaseEntity } from 'base/baseEntity';
import { Entity, Column } from 'typeorm';
import { Role } from '../enum/role.enum';

@Entity()
export class User extends BaseEntity{
    @Column({length:30})
    firstname:string;

    @Column({length:30})
    lastname:string;

    @Column({length:30})
    email:string;
    
    @Column()
    password:string;

    @Column()
    userType:Role
}