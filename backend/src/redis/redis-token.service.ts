import { Injectable, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';
import { RedisService } from './redis.service';

@Injectable()
export class RedisTokenService implements OnModuleInit {
  private client!: Redis;

  constructor(private readonly redisService: RedisService) {}

  onModuleInit() {
    this.client = this.redisService.getClient()
  }

  async generateResetCode(email: string): Promise<string> {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const key = `reset:${email}`;
    await this.client.set(key, code, 'EX', 15 * 60);
    return code;
  }

  async getResetCode(email: string): Promise<string | null> {
    const key = `reset:${email}`;
    return await this.client.get(key);
  }

  async invalidateCode(email: string): Promise<void> {
    const key = `reset:${email}`;
    await this.client.del(key);
  }
}