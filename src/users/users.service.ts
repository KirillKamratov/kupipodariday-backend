import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  async findUserByCredentials(credentials): Promise<User[]> {
    const user = await this.userRepository.find({
      where: [{ email: credentials }, { username: credentials }],
    });
    if (user.length > 0) {
      return user;
    } else return undefined;
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const newUser = await this.userRepository.create(createUserDto);
    const isUsernameAlreadyExist = await this.findUserByCredentials(
      createUserDto.username,
    );
    if (isUsernameAlreadyExist)
      throw new ForbiddenException(
        `Имя пользователя ${createUserDto.username} уже используется`,
      );
    const isEmailAlreadyExists = await this.findUserByCredentials(
      createUserDto.email,
    );
    if (isEmailAlreadyExists)
      throw new ForbiddenException(
        `Пользователь с таким эмейлом - ${createUserDto.email} уже зарегистрирован`,
      );
    const { password, ...result } = newUser;
    const hashPassword = await bcrypt.hash(password, 10);

    return this.userRepository.save({ ...result, password: hashPassword });
  }

  async findOne(id: number): Promise<User> {
    return this.userRepository.findOne({
      where: {
        id: id,
      },
    });
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findUserByName(username: string) {
    const user = await this.userRepository.findOne({
      where: {
        username: username,
      },
    });
    if (!user) {
      throw new NotFoundException('Пользователь с таким именем не найден!');
    }
    return user;
  }

  async findUserByEmail(email: string) {
    const user = await this.userRepository.findOne({
      where: {
        email: email,
      },
    });
    if (!user) {
      throw new NotFoundException('Пользователь с таким Эмейлом не найден!');
    }
    return user;
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
    createUserDto: CreateUserDto,
  ) {
    const isUsernameAlreadyExist = await this.findUserByCredentials(
      createUserDto.username,
    );
    if (isUsernameAlreadyExist) {
      throw new ForbiddenException(
        `Имя пользователя ${createUserDto.username} уже используется`,
      );
    }
    const isEmailAlreadyExists = await this.findUserByCredentials(
      createUserDto.email,
    );
    if (isEmailAlreadyExists)
      throw new ForbiddenException(
        `Пользователь с таким эмейлом - ${createUserDto.email} уже зарегистрирован`,
      );
    if (updateUserDto.password) {
      const hashPassword = await bcrypt.hash(updateUserDto.password, 10);
      return await this.userRepository.update(id, {
        ...updateUserDto,
        password: hashPassword,
        updatedAt: new Date(),
      });
    } else {
      return await this.userRepository.update(id, {
        ...updateUserDto,
        updatedAt: new Date(),
      });
    }
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    await this.userRepository.delete(id);
    return user;
  }
}
