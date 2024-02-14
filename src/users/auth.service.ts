import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { scrypt as _scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';
import { throws } from 'assert';
import { NotFoundError } from 'rxjs';
const scrypt = promisify(_scrypt);
@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signup(email: string, password: string) {
    //see if the email is in use
    const users = await this.usersService.find(email);
    if (users.length) {
      throw new BadRequestException('email is in use');
    }
    //hashing the  users password
    //generate a salt
    const salt = randomBytes(8).toString('hex');
    // hash the salt and the password together
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    //Join the hashed result and the salt together
    const result = salt + '.' + hash.toString('hex');
    //create a new user and save it
    const user = await this.usersService.create(email, result);
    //return the user
    return user;
  }

  async signin(email: string, password: string) {
    const [user] = await this.usersService.find(email);
    if (!user) {
      throw new NotFoundException('user not found');
    }
    const [salt, storedHash] = user.password.split('.');
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    if (hash.toString('hex') !== storedHash) {
      throw new BadRequestException('bad password');
    }
    return user;
  }
}
