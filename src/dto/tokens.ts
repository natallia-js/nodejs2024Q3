import { ApiProperty } from '@nestjs/swagger';

export class Tokens {
  @ApiProperty({
    description: 'Access token',
    nullable: false,
    required: true,
  })
  accessToken: string;
  
  @ApiProperty({
    description: 'Refresh token',
    nullable: false,
    required: true,
  })
  refreshToken: string;
  
  constructor(tokens: Partial<Tokens>) {
    Object.assign(this, tokens);
  }
}
  