import { ConflictException } from '@nestjs/common';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compareSync, genSalt, hash } from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
    constructor(private readonly jwtService: JwtService, private readonly prisma: PrismaService) { }

    async login(loginDto: LoginDto) {
        const { username, password } = loginDto
        const user = await this.prisma.user.findUnique({ where: { username } })
        if (!user) throw new ForbiddenException('Wrong Password or username')
        const matchPassword = compareSync(password, user.password)
        if (!matchPassword) throw new ForbiddenException('Wrong Password or username')
        const payload = {
            sub: user.id,
            username: user.username,
            name: user.name
        };
        return {
            token: this.jwtService.sign(payload, {
                secret: process.env.JWT_SECRET
            })
        };
    }

    async register(registerDto: RegisterDto) {
        const { username } = registerDto
        const existingUser = await this.prisma.user.findUnique({ where: { username } })
        if (existingUser) throw new ConflictException('User with that username already exists')
        registerDto.password = await this.encryptPassword(registerDto.password)
        const user = await this.prisma.user.create({ data: registerDto })
        const payload = {
            sub: user.id,
            username: user.username,
            name: user.name
        };

        return {
            token: this.jwtService.sign(payload, {
                secret: process.env.JWT_SECRET
            })
        };
    }

    private async encryptPassword(password) {
        const salt = await genSalt()
        password = await hash(password, salt)
        return password
    }
}
