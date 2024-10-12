import { Column, PrimaryGeneratedColumn } from 'typeorm';

export class BaseEntity{
    @PrimaryGeneratedColumn('uuid')
    Id:string;

    @Column()
    createdDate:Date = new Date(Date.now());
} 