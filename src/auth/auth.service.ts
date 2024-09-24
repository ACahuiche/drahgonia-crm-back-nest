import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../user/user.schema';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('User') private userModel: Model<User>, 
    private configService: ConfigService
  ) {}

  async login(userEmail: string, userPassword: string): Promise<{ token: string }> {
    const user = await this.userModel.findOne({ userEmail }).exec();

    if (!user || !(await bcrypt.compare(userPassword, user.userPassword))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { 
      userId: user._id, 
      isAdmin: user.isAdmin 
    };

    const token = jwt.sign(
      payload, 
      this.configService.get<string>('SECRET_KEY'), 
      { expiresIn: '1h' }
    );

    return { token };
  }

  verifyToken(token: string) {
    try {
      return jwt.verify(
        token, 
        this.configService.get<string>('SECRET_KEY')
      );
      
    } catch (e) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
