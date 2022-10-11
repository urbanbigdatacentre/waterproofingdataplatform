import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  constructor(private http: HttpClient) {}

  search(query: string): Observable<any> {
    const url = environment.geocodeApiUrl;
    return this.http
      .get<any>(url, {
        observe: 'response',
        params: {
          q: query,
          limit: '5',
          lat: environment.brasilCenter[1] + '',
          lon: environment.brasilCenter[0] + ''
        }
      })
      .pipe(
        map(res => {
          return res.body;
        })
      );
  }
}