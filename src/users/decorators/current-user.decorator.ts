import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const currentUser = createParamDecorator(
  (data: never, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    console.log(context);
    console.log(request.session.userId);
    return 'hi there';
  },
);
