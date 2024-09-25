import { Injectable, NotFoundException, BadRequestException  } from '@nestjs/common';
import { isValidObjectId } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.schema';
import * as bcrypt from 'bcryptjs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private userModel: Model<User>,
    private configService: ConfigService
  ) {}

  async create(user: User): Promise<User> {

    const hashedPassword = await bcrypt.hash(
      user.userPassword, 
      +this.configService.get<number>('BCRYPT_SALT_ROUNDS')
    );
    
    const newUser = new this.userModel({
      ...user,
      userPassword: hashedPassword,
    });
    return newUser.save();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findOne(id: string): Promise<User> {

    if (!isValidObjectId(id)) {
      throw new BadRequestException(`The id is incorrect`);
    }

    const user = await this.userModel.findById(id).exec();

    if(!user) {
      throw new NotFoundException('User no exist');
    }

    return user;
  }

  async update(id: string, user: User): Promise<User> {

    if (!isValidObjectId(id)) {
      throw new BadRequestException(`The id is incorrect`);
    }

    const userInfo = await this.userModel.findById(id).exec();

    if(!userInfo) {
      throw new NotFoundException('User no exist');
    }

    const hashedPassword = await bcrypt.hash(
      user.userPassword, 
      +this.configService.get<number>('BCRYPT_SALT_ROUNDS')
    );

    user.userPassword = hashedPassword;

    return this.userModel.findByIdAndUpdate(id, user, { new: true }).exec();
  }

  async delete(id: string): Promise<User> {

    if (!isValidObjectId(id)) {
      throw new BadRequestException(`The id is incorrect`);
    }

    const userInfo = await this.userModel.findById(id).exec();

    if(!userInfo) {
      throw new NotFoundException('User no exist');
    }

    return this.userModel.findByIdAndDelete(id).exec();
  }
}
