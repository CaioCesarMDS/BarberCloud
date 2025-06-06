import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAddressDto {
  @IsNotEmpty()
  @IsString()
  readonly number!: string;
  @IsNotEmpty()
  @IsString()
  readonly street!: string;
  @IsNotEmpty()
  @IsString()
  readonly neighborhood!: string;
  @IsNotEmpty()
  @IsString()
  readonly city!: string;
  @IsNotEmpty()
  @IsString()
  readonly state!: string;
  @IsNotEmpty()
  @IsString()
  readonly country!: string;
  @IsNotEmpty()
  @IsString()
  readonly zipCode!: string;
}
