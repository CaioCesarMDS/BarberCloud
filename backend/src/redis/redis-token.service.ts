import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisTokenService {
  private redis = new Redis();

  async generateResetCode(email: string): Promise<string> {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const key = `reset:${email}`;
    await this.redis.set(key, code, 'EX', 15 * 60);
    return code;
  }

  async getResetCode(email: string): Promise<string | null> {
    const key = `reset:${email}`;
    return await this.redis.get(key);
  }

  async invalidateCode(email: string): Promise<void> {
    const key = `reset:${email}`;
    await this.redis.del(key);
  }
}