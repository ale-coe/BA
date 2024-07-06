import { Injectable } from '@nestjs/common';

@Injectable()
export class QueueService {
  public imageQueueIsRunning = false;
  public imageQueue: {
    userId: number;
    imageId: number;
    file: Express.Multer.File;
  }[] = [];

  addToQueue(userId: number, imageId: number, file: Express.Multer.File) {
    this.imageQueue.push({ userId, imageId, file });
  }
}
