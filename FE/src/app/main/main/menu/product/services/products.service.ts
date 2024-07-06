import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IGetProductQueryAttributes } from '@shared/get-product-query.attributes';
import { IPostProductAttributes } from '@shared/post-product.attributes';
import { IPutProductAttributes } from '@shared/put-product.attributes';
import { IPostBuyProductAttributes } from '@shared/post-buy-product.attributes';
import { environment } from 'src/environments/environment';
import {
  IProduct,
  TPaginatedProducts,
} from '../interfaces/paginated-products.type';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  constructor(private readonly httpClient: HttpClient) {}

  getProducts({ includeHidden, skip, take }: IGetProductQueryAttributes) {
    return this.httpClient.get<TPaginatedProducts>(
      `${environment.backendURI}/products`,
      { params: { includeHidden, skip, take } }
    );
  }

  updateProduct(body: IPutProductAttributes) {
    return this.httpClient.put(`${environment.backendURI}/products`, body);
  }

  addProduct(product: IPostProductAttributes) {
    return this.httpClient.post<IProduct>(
      `${environment.backendURI}/products`,
      product
    );
  }

  buyProduct(body: IPostBuyProductAttributes) {
    return this.httpClient.post<number>(
      `${environment.backendURI}/products/buy`,
      body
    );
  }
}
