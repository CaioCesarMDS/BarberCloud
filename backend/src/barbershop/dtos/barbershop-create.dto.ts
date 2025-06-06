import { IsNotEmpty, IsString } from 'class-validator';

export class BarbershopCreateDto {
  @IsNotEmpty()
  @IsString()
  readonly name!: string;

  @IsNotEmpty()
  @IsString()
  readonly description?: string;
}
