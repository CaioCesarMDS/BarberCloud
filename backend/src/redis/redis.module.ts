import { Global, Module } from '@nestjs/common';
import { RedisTokenService } from './redis-token.service';
import { RedisTransportService } from './redis-transport.service';
import { RedisService } from './redis.service';

@Global()
@Module({
  providers: [RedisService, RedisTransportService, RedisTokenService],
  exports: [RedisService, RedisTransportService, RedisTokenService],
})
export class RedisModule {}
