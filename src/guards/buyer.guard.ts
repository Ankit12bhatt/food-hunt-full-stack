import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class BuyerRoleGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    if (!request.user) {
      throw new UnauthorizedException();
    }
    try {
      console.log('guard 2 buyer', request.user);
      if (request.user.role === 'buyer') return true;
    } catch {
      throw new UnauthorizedException();
    }
  }
}
