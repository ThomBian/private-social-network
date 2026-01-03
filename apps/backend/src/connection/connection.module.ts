import { Module } from '@nestjs/common';
import { ConnectionService } from './connection.service';
import { ConnectionResolver } from './connection.resolver';

@Module({
  imports: [],
  providers: [ConnectionService, ConnectionResolver],
  exports: [ConnectionService],
})
export class ConnectionModule {}
