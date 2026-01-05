import { forwardRef, Module } from '@nestjs/common';
import { ConnectionService } from './connection.service';
import { ConnectionResolver } from './connection.resolver';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [forwardRef(() => UsersModule)],
  providers: [ConnectionService, ConnectionResolver],
  exports: [ConnectionService],
})
export class ConnectionModule {}
