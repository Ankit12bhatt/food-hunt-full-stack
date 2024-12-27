import { PartialType } from '@nestjs/mapped-types';
import { CreateLeftoverDto } from './create-leftover.dto';
export class UpdateLeftoverDto extends PartialType(CreateLeftoverDto) {}
