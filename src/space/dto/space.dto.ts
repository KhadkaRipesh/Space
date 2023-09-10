import { IsEmail, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateSpaceDto {
  @IsString()
  @IsNotEmpty()
  space_name: string;
}
export class ShareSpaceDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
export class AcceptInvitationDto {
  @IsUUID()
  @IsNotEmpty()
  space_id: string;

  @IsNotEmpty()
  @IsString()
  invitation: string;
}
export class UpdateSpaceDto{
  @IsString()
  @IsNotEmpty()
  space_name: string;
}
