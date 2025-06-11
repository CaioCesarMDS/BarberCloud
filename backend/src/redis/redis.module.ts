import { Module, Global } from '@nestjs/common';
import { RedisService } from './redis.service';
import { RedisTransportService } from './redis-transport.service';
import { RedisTokenService } from './redis-token.service';

@Global()
@Module({
  providers: [RedisService, RedisTransportService, RedisTokenService],
  exports: [RedisService, RedisTransportService, RedisTokenService],
})
export class RedisModule {}
