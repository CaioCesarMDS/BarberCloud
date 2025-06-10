import { Module, Global } from '@nestjs/common';
import { RedisService } from './redis.service';
import { RedisTransportService } from './redis-transport.service';

@Global()
@Module({
  providers: [RedisService, RedisTransportService],
  exports: [RedisService, RedisTransportService],
})
export class RedisModule {}