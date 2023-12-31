import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class V1GetRestaurantByNameParamDto {
  @ApiProperty({
    description: 'Name of restaurant',
    example: 'Restaurant',
    type: 'string',
    format: 'string',
  })
  @IsString()
  name: string;
}
