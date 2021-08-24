import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IDriverLocation } from './models/driverlocation.entity';

import { catchError, map, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({providedIn: 'root'})
export class LocationService {
  baseUrl: string; // = 'https://localhost:5001/api/locations/'

  constructor(
    private http: HttpClient
  ) {
    this.baseUrl = 'https://localhost:5001/api/locations';
    // this.baseUrl = 'https://katsubiapi20210505084701.azurewebsites.net/api/locations';
  }

  updateCurrenLocation(loc: IDriverLocation): any {
    let token = `eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImpraW1Ad2F2ZW5ldC5jbG91ZCIsImdpdmVuX25hbWUiOiJKdXN0aW4gS2ltIiwibmJmIjoxNjIxOTk0ODA5LCJleHAiOjE2MjI1OTk2MDksImlhdCI6MTYyMTk5NDgwOSwiaXNzIjoiaHR0cHM6Ly9rYXRzdWJpZGIuZGF0YWJhc2Uud2luZG93cy5uZXQifQ.SkIZvlwZg7-N1xQiYwP0g4gMykzMdUqqCjr6FFpaPXKf6-C_KS2ihjYZnBlWw1NGDi1hWUU613ny7Uktx22u2g`;
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `Bearer ${token}`);
    // console.log(this.baseUrl);
    return this.http.post(this.baseUrl, loc, {headers})
      .pipe(
        tap(_ => console.log('[AppService] ' + this.baseUrl)),
        // tap(loc => console.log(loc)),
        catchError(err => {console.log(err); return throwError(err);})
      );
  }
}
