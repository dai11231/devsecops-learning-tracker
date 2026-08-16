import { IsEnum, IsNotEmpty } from 'class-validator';
import { ProgressStatus } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProgressDto {
  @ApiProperty({ enum: ProgressStatus })
  @IsEnum(ProgressStatus)
  @IsNotEmpty()
  status: ProgressStatus;
}
