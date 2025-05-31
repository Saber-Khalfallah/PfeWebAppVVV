import { PartialType } from '@nestjs/mapped-types';
import { CreateJobDto } from './create-job.dto'; // Import your CreateJobDto


export class UpdateJobDto extends PartialType(CreateJobDto) {

}