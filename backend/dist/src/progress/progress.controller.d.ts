import { ProgressService } from './progress.service';
import { UpdateProgressDto } from './dto/update-progress.dto';
export declare class ProgressController {
    private readonly progressService;
    constructor(progressService: ProgressService);
    findAll(req: any): unknown;
    findOne(req: any, topicId: number): unknown;
    upsert(req: any, topicId: number, dto: UpdateProgressDto): unknown;
}
