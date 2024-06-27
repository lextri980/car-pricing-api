import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  UseGuards,
  Param,
  Query,
  Req,
} from '@nestjs/common';
import { CreateReportDto } from './dtos/create-report.dto';
import { ReportsService } from './reports.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import { User } from 'src/users/users.entity';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { ReportDto } from './dtos/report.dto';
import { ApproveReportDto } from './dtos/approve-report.dto';
import { AdminGuard } from 'src/guards/admin.guard';
import { GetEstimateDto } from './dtos/get-estimate.dto';
import { Request } from 'express';

@Controller('reports')
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Get('/list')
  @UseGuards(AuthGuard)
  getReportList(@Query() query: GetEstimateDto) {
    return this.reportsService.getReportList(query);
  }

  @Get('/list-raw')
  @UseGuards(AuthGuard)
  getReportListNoQuery(@Req() req: Request) {
    return this.reportsService.getReportListNoQuery(req);
  }

  @Post('/create')
  @UseGuards(AuthGuard)
  @Serialize(ReportDto)
  createReport(@Body() body: CreateReportDto, @CurrentUser() user: User) {
    return this.reportsService.create(body, user);
  }

  @Patch('/approve/:id')
  @UseGuards(AdminGuard)
  approveReport(@Param('id') id: string, @Body() body: ApproveReportDto) {
    return this.reportsService.approveReport(id, body.approved);
  }
}
