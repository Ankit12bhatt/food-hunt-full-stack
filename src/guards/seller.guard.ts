import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class SellerRoleGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    if (!request.user) {
      throw new UnauthorizedException();
    }
    try {
      console.log('guard 2 seller', request.user);
      if (request.user.role === 'seller') return true;
    } catch {
      throw new UnauthorizedException();
    }
  }
}
