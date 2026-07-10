import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { RolesGuard } from './auth/guards/roles.guard';
import { CustomersModule } from './customers/customers.module';
import { SitesModule } from './sites/sites.module';
import { OrdersModule } from './orders/orders.module';
import { TeamsModule } from './teams/teams.module';
import { CitiesModule } from './cities/cities.module';
import { WorkersModule } from './workers/workers.module';
import { JobAssignmentsModule } from './job-assignments/job-assignments.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UsersModule,
    CustomersModule,
    SitesModule,
    OrdersModule,
    TeamsModule,
    CitiesModule,
    WorkersModule,
    JobAssignmentsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AppModule {}
