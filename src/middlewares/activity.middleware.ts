import { Injectable, NestMiddleware } from '@nestjs/common';
import { UserService } from 'src/user/user.service';

@Injectable()
export class ActivityMiddleware implements NestMiddleware {
  constructor(private readonly userService: UserService) {}
  async use(req: any, res: any, next: (error?: any) => void) {
    if (req.user) {
      req.user.lastActivity = new Date();
      await this.userService.updateUserActivity(req.user);
      console.log('Updated.');
    }
    next();
  }
}
