import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { HarnessesController } from './harnesses.controller';
import { HarnessesService } from './harnesses.service';

@Module({
  imports: [PrismaModule],
  controllers: [HarnessesController],
  providers: [HarnessesService],
  exports: [HarnessesService],
})
export class HarnessesModule {}
