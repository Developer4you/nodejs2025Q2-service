import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { UserRepository } from './repositories/user.repository';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Injectable()
export class UserService {
  constructor(private readonly repository: UserRepository) {}

  create(dto: CreateUserDto): User {
    return this.repository.create(dto);
  }

  findAll(): User[] {
    return this.repository.findAll();
  }

  findById(id: string): User {
    const user = this.repository.findById(id);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  updatePassword(id: string, dto: UpdatePasswordDto): User {
    const user = this.repository.findByIdWithPassword(id);
    if (!user) throw new NotFoundException('User not found');

    if (user.password !== dto.oldPassword) {
      throw new ForbiddenException('Old password is incorrect');
    }

    return this.repository.updatePassword(id, dto.newPassword);
  }

  delete(id: string): void {
    const success = this.repository.delete(id);
    if (!success) throw new NotFoundException('User not found');
  }
}
