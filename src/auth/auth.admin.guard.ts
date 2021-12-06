import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";




@Injectable()
export class AuthAdminGuard implements CanActivate {
    canActivate(context: ExecutionContext){
        const gqlContext = GqlExecutionContext.create(context).getContext();
        const admin = gqlContext['admin'];
        console.log(admin)
        if(!admin){
            return false;
        }

        return true;
    }
}