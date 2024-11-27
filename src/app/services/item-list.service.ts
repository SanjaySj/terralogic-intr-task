import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { endpoints } from '../constant';
import { Observable } from 'rxjs';
import { Item } from '../models/item-list.model';

@Injectable({
  providedIn: 'root'
})
export class ItemListService {

  constructor(private httpClient: HttpClient) { }

  getListOfUsers(): Observable<Item[]> {
    return this.httpClient.request<Item[]>('GET', endpoints.posts, {});
  }

  addPostRequest(body: Partial<Item>): Observable<Item> {
    return this.httpClient.request<Item>('POST', endpoints.posts, { body });
  }
}
