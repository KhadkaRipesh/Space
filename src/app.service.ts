import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  ping() {
    return {
      health: 'ok',
      status: 200,
      docs: 'http://20.193.158.103:3000/api',
    };
  }
}
