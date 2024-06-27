import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/users.entity';
import { Repository } from 'typeorm';
import { CreateReportDto } from './dtos/create-report.dto';
import { GetEstimateDto } from './dtos/get-estimate.dto';
import { Report } from './reports.entity';
import { Request } from 'express';

@Injectable()
export class ReportsService {
  constructor(@InjectRepository(Report) private repo: Repository<Report>) {}

  async getReportList(query: GetEstimateDto) {
    return this.repo
      .createQueryBuilder()
      .select('*')
      .where(`make = :make`, {
        make: query.make,
      })
      .getRawMany();
  }

  async getReportListNoQuery(req?: Request) {
    const report = await this.repo
      .createQueryBuilder('report')
      .leftJoinAndSelect('report.user', 'user')
      .where('report.userId = :userId', {
        userId: req.currentUser.id,
      })
      .getMany();
    return report;
  }

  create(reportDto: CreateReportDto, user: User) {
    const report = this.repo.create(reportDto);
    report.user = user;

    return this.repo.save(report);
  }

  async approveReport(id: string, isApprove: boolean) {
    const report = await this.repo.findOne({
      where: {
        id: parseInt(id),
      },
    });
    if (!report) {
      throw new NotFoundException('Report not found');
    }

    report.approved = isApprove;
    return this.repo.save(report);
  }
}
