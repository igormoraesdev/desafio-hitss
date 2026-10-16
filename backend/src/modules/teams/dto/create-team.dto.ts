import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, Matches, MaxLength } from 'class-validator';

const HEX_COLOR = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
const NAME_MAX_LENGTH = 50;

const trim = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim() : value;

export class CreateTeamDto {
  @Transform(trim)
  @IsString({ message: 'name precisa ser do tipo string' })
  @IsNotEmpty({ message: 'name é obrigatório' })
  @MaxLength(NAME_MAX_LENGTH, {
    message: `name precisa ter no máximo ${NAME_MAX_LENGTH} caracteres`,
  })
  name: string;

  @Transform(trim)
  @IsString({ message: 'color precisa ser do tipo string' })
  @IsNotEmpty({ message: 'color é obrigatório' })
  @Matches(HEX_COLOR, { message: 'color precisa ser no formato hexadecimal' })
  color: string;
}
