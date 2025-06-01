import { BadRequestException } from '@nestjs/common';
import { validate as uuidValidate } from 'uuid';

export function validateUUID(id: string): void {
  if (!uuidValidate(id)) {
    throw new BadRequestException('Invalid UUID format');
  }
}
