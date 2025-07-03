import { IsOptional, IsString, Matches } from 'class-validator';

export class BarbershopUpdateDto {
  @IsOptional()
  @IsString()
  readonly name?: string;
  @IsOptional()
  @IsString()
  readonly imageUrl?: string;
  @IsOptional()
  @IsString()
  @Matches(/^([0-1]\d|2[0-3]):([0-5]\d)$/, {
    message: 'Time must be in HH:mm format',
  })
  readonly timeOpen?: string;
  @IsOptional()
  @IsString()
  @Matches(/^([0-1]\d|2[0-3]):([0-5]\d)$/, {
    message: 'Time must be in HH:mm format',
  })
  readonly timeClose?: string;
  @IsString()
  @IsOptional()
  readonly number?: string;
  @IsOptional()
  @IsString()
  readonly street?: string;
  @IsOptional()
  @IsString()
  readonly complement?: string;
  @IsOptional()
  @IsString()
  readonly neighborhood?: string;
  @IsOptional()
  @IsString()
  readonly city?: string;
  @IsOptional()
  @IsString()
  readonly state?: string;
  @IsOptional()
  @IsString()
  readonly country?: string;
  @IsOptional()
  @IsString()
  readonly zipCode?: string;
}