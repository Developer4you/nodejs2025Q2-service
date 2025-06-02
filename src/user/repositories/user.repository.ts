import { v4 as uuidv4 } from 'uuid';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { NotFoundException } from '@nestjs/common';

export class UserRepository {
  private users: User[] = [];

  findAll(): User[] {
    return this.users.map((user) => this.excludePassword(user));
  }

  findById(id: string): User | undefined {
    const user = this.users.find((u) => u.id === id);
    return user ? this.excludePassword(user) : undefined;
  }

  findByIdWithPassword(id: string): User | undefined {
    return this.users.find((u) => u.id === id);
  }

  create(dto: CreateUserDto): User {
    const timestamp = Date.now();
    const user: User = {
      id: uuidv4(),
      login: dto.login,
      password: dto.password,
      version: 1,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    this.users.push(user);
    return this.excludePassword(user);
  }

  updatePassword(id: string, newPassword: string): User {
    const index = this.users.findIndex((u) => u.id === id);
    if (index === -1) throw new NotFoundException('User not found');

    const timestamp = Date.now();
    this.users[index] = {
      ...this.users[index],
      password: newPassword,
      version: this.users[index].version + 1,
      updatedAt: timestamp,
    };

    return this.excludePassword(this.users[index]);
  }

  delete(id: string): boolean {
    const initialLength = this.users.length;
    this.users = this.users.filter((u) => u.id !== id);
    return this.users.length < initialLength;
  }

  private excludePassword(user: User): User {
    const { password, ...userWithoutPassword } = user;
    void password;
    return new User(userWithoutPassword);
  }
}
