import * as bcrypt from 'bcrypt';

export async function hashPassword(password:string):Promise<string>{
    const saltOrRounds = 10;
    const hash = await bcrypt.hash(password, saltOrRounds);
    return hash;
}

export async function isMatch(password:string,hash:string):Promise<boolean> {
    return await bcrypt.compare(password, hash);
}