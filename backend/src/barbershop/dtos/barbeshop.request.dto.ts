import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class BarbershopRequestDto {
  @IsNotEmpty()
  @IsString()
  readonly name!: string;
  @IsNotEmpty()
  @IsString()
  readonly imageUrl!: string;
  @IsNotEmpty()
  @IsString()
  @Matches(/^([0-1]\d|2[0-3]):([0-5]\d)$/, {
    message: 'Time must be in HH:mm format',
  })
  readonly timeOpen!: string;
  @IsNotEmpty()
  @IsString()
  @Matches(/^([0-1]\d|2[0-3]):([0-5]\d)$/, {
    message: 'Time must be in HH:mm format',
  })
  readonly timeClose!: string;
  @IsString()
  @IsNotEmpty()
  readonly number!: string;
  @IsNotEmpty()
  @IsString()
  readonly street!: string;
  @IsNotEmpty()
  @IsString()
  readonly complement!: string;
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
