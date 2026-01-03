import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { GraphQLContext } from '../common/graphql.context';
import { User } from '../users/user.model';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const context = GqlExecutionContext.create(ctx);
    const gqlContext = context.getContext<GraphQLContext>();
    const req = gqlContext.req as Request & { user?: User };
    return req.user as User | null;
  },
);
