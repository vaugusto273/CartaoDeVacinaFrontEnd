import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface VaccinationRecord {
  id: number;
  userID: number;
  vaccineID: number;
  doseNumber: number;
  applicationDate: string;
  notes?: string;
}

export interface User {
  id: number;
  name: string;
  vaccinationRecords: VaccinationRecord[];
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly apiUrl = 'http://localhost:5132/api/user';
  private readonly recordsUrl = 'http://localhost:5132/api/users';

  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  getUser(value: string | number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${value}`);
  }

  getVaccinationRecords(userId: number): Observable<VaccinationRecord[]> {
    return this.http.get<VaccinationRecord[]>(
      `${this.recordsUrl}/${userId}/vaccinationrecords`
    );
  }
}
