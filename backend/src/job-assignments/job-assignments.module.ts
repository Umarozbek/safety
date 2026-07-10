import { Module } from '@nestjs/common';
import { JobAssignmentsService } from './job-assignments.service';
import { JobAssignmentsController } from './job-assignments.controller';

@Module({
  providers: [JobAssignmentsService],
  controllers: [JobAssignmentsController]
})
export class JobAssignmentsModule {}
