import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from '@nestjs/core'
import { Roles } from "src/@docoraters/getRoles.decorater";

@Injectable()
export class RoleGuard implements CanActivate{
    constructor(private reflector: Reflector){}
    canActivate(context: ExecutionContext): boolean  {
        const requiredRole= this.reflector.getAllAndOverride(Roles, [
            context.getHandler(),
            context.getClass()
        ])
        if(!requiredRole) return true;

        const {user} = context.switchToHttp().getRequest();
        return requiredRole.includes(user?.user_type)
    }
}