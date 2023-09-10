import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

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
  space_id: string;
  invitation: string;
}
export class UpdateSpaceDto{
  @IsString()
  @IsNotEmpty()
  space_name: string;
}
