import { Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from '../entities/sql/user.entity';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) {}

  async create(user: User) {
    await this.usersRepository.create(user);
    return await this.usersRepository.save(user);
  }
  async update(user: User) {
    return await this.usersRepository.save(user);
  }

  async deleteAll() {
    return await this.usersRepository.delete({});
  }

  async findUserById(id: string): Promise<User> {
    try {
      const result: User | null = await this.usersRepository.findOne({
        where: { id: id },
      });
      return result;
    } catch (error) {
      return null;
    }
  }

  async delete(userId: string) {
    return await this.usersRepository.delete(userId);
  }

  async findUserByLoginOrEmail(loginOrEmail: string) {
    try {
      const result = await this.usersRepository
        .createQueryBuilder()
        .select('user')
        .from(User, 'user')
        .where('user.login = :loginOrEmail', { loginOrEmail })
        .orWhere('user.email = :loginOrEmail', { loginOrEmail })
        .getOne();

      return result;
    } catch (error) {
      return null;
    }
  }

  async findUserByConfirmationCode(code: string) {
    try {
      const result: User | null = await this.usersRepository.findOneBy({
        confirmationCode: code,
      });
      return result;
    } catch (error) {
      return null;
    }
  }

  async findUserByEmail(email: string) {
    return this.usersRepository.findOneBy({
      email: email,
    });
  }

  async findUsersByLogin(login: string) {
    return this.usersRepository.findBy({
      login: login,
    });
  }
}
