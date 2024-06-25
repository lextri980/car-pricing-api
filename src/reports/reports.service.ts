import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Report } from './reports.entity';
import { Repository } from 'typeorm';
import { CreateReportDto } from './dtos/create-report.dto';
import { User } from 'src/users/users.entity';

@Injectable()
export class ReportsService {
  constructor(@InjectRepository(Report) private repo: Repository<Report>) {}

  getList() {
    return this.repo.find();
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
