import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { GqlExecutionContext } from "@nestjs/graphql";
import { JwtService } from "src/jwt/jwt.service";
import { User } from "src/users/entities/user.entity";
import { UserService } from "src/users/users.service";
import { AllowedRoles } from "./role.decorator";



@Injectable()
export class AuthUserGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
        private readonly jwtService: JwtService,
        private readonly userService: UserService,
    ) { }
    async canActivate(context: ExecutionContext) {
        const roles = this.reflector.get<AllowedRoles>('roles', context.getHandler());
        // The resolver is public when it hits this guard
        if (!roles) {
            return true;
        }
        const gqlContext = GqlExecutionContext.create(context).getContext();
        const token = gqlContext['x-jwt'];

        if (!token) {
            return false;
        }

        if (token) {
            const decoded = this.jwtService.verify(token.toString());
            if (typeof decoded === 'object' && decoded.hasOwnProperty('id')) {
                const { user } = await this.userService.findUserById(decoded['id']);

                if (user) {
                    gqlContext['user'] = user;
                    if (roles.includes('any')) {
                        return true;
                    }
                    return roles.includes(user.role);
                }

            } else {
                return false
            }
        }
        return false;



    }
}