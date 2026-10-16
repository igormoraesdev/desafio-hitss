import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, Matches, MaxLength } from 'class-validator';
import { trim } from 'src/common/utils/string';

const HEX_COLOR = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
const NAME_MAX_LENGTH = 50;

export class CreateTeamDto {
  @ApiProperty({
    description: 'Nome do time. Único, espaços nas pontas são removidos.',
    maxLength: NAME_MAX_LENGTH,
    example: 'Frontend',
  })
  @Transform(trim)
  @IsString({ message: 'name precisa ser do tipo string' })
  @IsNotEmpty({ message: 'name é obrigatório' })
  @MaxLength(NAME_MAX_LENGTH, {
    message: `name precisa ter no máximo ${NAME_MAX_LENGTH} caracteres`,
  })
  name: string;

  @ApiProperty({
    description: 'Cor em hexadecimal, com 3 ou 6 dígitos.',
    pattern: HEX_COLOR.source,
    example: '#3b82f6',
  })
  @Transform(trim)
  @IsString({ message: 'color precisa ser do tipo string' })
  @IsNotEmpty({ message: 'color é obrigatório' })
  @Matches(HEX_COLOR, { message: 'color precisa ser no formato hexadecimal' })
  color: string;
}
