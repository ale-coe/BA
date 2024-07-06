import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IFeedbackCategory } from '../interfaces/feeback-category.interface';
import { IFeedbackType } from '../interfaces/feeback-type.interface';
import { IPostFeedbackAttributes } from '@shared/post-feedback.attributes';
import { IPaginationAttributes } from '@shared/pagination.attributes';
import { IPutFeedbackAttribute } from '@shared/put-feedback.attributes';
import { TPaginatedFeedback } from '../../../admin/feedback-admin/interfaces/paginated-feedback.type';

@Injectable({
  providedIn: 'root',
})
export class FeedbackService {
  constructor(private readonly httpClient: HttpClient) {}

  getFeedback({ skip, take }: IPaginationAttributes = { take: 10, skip: 0 }) {
    return this.httpClient.get<TPaginatedFeedback>(
      `${environment.backendURI}/feedback`,
      {
        params: { skip, take },
      }
    );
  }

  getFeedbackTypes() {
    return this.httpClient.get<IFeedbackType[]>(
      `${environment.backendURI}/feedback/types`
    );
  }

  getFeedbackCategories() {
    return this.httpClient.get<IFeedbackCategory[]>(
      `${environment.backendURI}/feedback/categories`
    );
  }

  updateFeedback(body: IPutFeedbackAttribute) {
    return this.httpClient.put(`${environment.backendURI}/feedback`, body);
  }

  postFeedback(feedback: IPostFeedbackAttributes) {
    return this.httpClient.post(`${environment.backendURI}/feedback`, feedback);
  }
}
