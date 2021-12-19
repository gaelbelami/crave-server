import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { GqlExecutionContext } from "@nestjs/graphql";
import { User } from "src/users/entities/user.entity";
import { AllowedRoles } from "./role.decorator";



@Injectable()
export class AuthUserGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) { }
    canActivate(context: ExecutionContext) {
        const roles = this.reflector.get<AllowedRoles>('roles', context.getHandler());
        // The resolver is public when it hits this guard
        if (!roles) {
            return true;
        }
        const gqlContext = GqlExecutionContext.create(context).getContext();
        // There is a metadata: Expecting a user:
        const user: User = gqlContext['user'];
        // If no user, return false
        if (!user) {
            return false;
        }
        // Have a user and the resolver is public
        if (roles.includes('any')) {
            return true;
        }
        return roles.includes(user.role);
    }
}