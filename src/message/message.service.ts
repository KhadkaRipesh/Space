import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class MessageService {
  constructor(private readonly dataSource: DataSource) {}
}
