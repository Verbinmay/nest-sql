import { Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from '../entities/sql/user.entity';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) {}

  async save(user: User) {
    await this.usersRepository.create(user);
    return await this.usersRepository.save(user);
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
    const result = await this.usersRepository.delete({ id: id });
    return result;
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

  // async findUserByConfirmationCode(code: string) {
  //   const result: User | null = await this.UserModel.findOne({
  //     'emailConfirmation.confirmationCode': code,
  //   }).lean();
  //   return result;
  // }

  // async updateConfirmation(id: string) {
  //   try {
  //     const result = await this.UserModel.findById(id);

  //     if (!result) return false;

  //     result.emailConfirmation.isConfirmed = true;

  //     result.save();

  //     return true;
  //   } catch (e) {
  //     return false;
  //   }
  // }

  // async findUserByEmail(email: string) {
  //   try {
  //     return this.UserModel.findOne({
  //       email: email,
  //     });
  //   } catch (e) {
  //     return null;
  //   }
  // }

  // async updateConfirmationAndHash(a: { id: string; hash: string }) {
  //   try {
  //     const result = await this.UserModel.findById(a.id);

  //     if (!result) return false;

  //     result.emailConfirmation.isConfirmed = true;
  //     result.hash = a.hash;
  //     result.save();

  //     return true;
  //   } catch (e) {
  //     return false;
  //   }
  // }
}
