import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";



export const AuthAdmin = createParamDecorator (
    (data:unknown, context: ExecutionContext) => {
         const gqlContext = GqlExecutionContext.create(context).getContext();
        const admin = gqlContext['admin'];
        return admin;
    }
)