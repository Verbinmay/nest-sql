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

  async truncate(): Promise<void> {
    return await this.usersRepository.clear();
  }

  // async findCountUsers(filter: object) {
  //   return await this.UserModel.countDocuments(filter);
  // }

  // async findUsers(a: { find: object; sort: any; skip: number; limit: number }) {
  //   const result: Array<User> = await this.UserModel.find(a.find)
  //     .sort(a.sort)
  //     .skip(a.skip)
  //     .limit(a.limit);

  //   return result;
  // }

  async findUserById(id: string): Promise<User> {
    const result: User | null = await this.usersRepository.findOne({
      where: { id: id },
    });
    return result;
  }

  async delete(id: string) {
    return await this.usersRepository.delete({ id: id });
  }

  async findUserByLoginOrEmail(loginOrEmail: string) {
    const result = await this.usersRepository
      .createQueryBuilder()
      .select('user')
      .from(User, 'user')
      .where('user.login = :loginOrEmail', { loginOrEmail })
      .orWhere('user.email = :loginOrEmail', { loginOrEmail })
      .getOne();

    return result;
  }

  async findUserByConfirmationCode(code: string) {
    const result: User | null = await this.usersRepository.findOneBy({
      confirmationCode: code,
    });
    return result;
  }

  async updateConfirmation(id: string) {
    try {
      const result = await this.usersRepository.findOneBy({ id: id });

      result.isConfirmed = true;

      await this.usersRepository.save(result);

      return true;
    } catch (e) {
      return false;
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
