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

export interface Vaccine {
  id: number;
  vaccineName: string;
}

export interface User {
  id: number;
  name: string;
  age: number;
  gender: string;
  vaccinationRecords: VaccinationRecord[];
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly apiUrl = 'http://localhost:5132/api/user';
  private readonly recordsUrl = 'http://localhost:5132/api/users';
  private readonly vaccineUrl = 'http://localhost:5132/api/vaccine';

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

  getVaccines(): Observable<Vaccine[]> {
    return this.http.get<Vaccine[]>(this.vaccineUrl);
  }

  createUser(user: Partial<User>): Observable<User> {
    return this.http.post<User>(this.apiUrl, user);
  }

  createVaccine(vaccine: Partial<Vaccine>): Observable<Vaccine> {
    return this.http.post<Vaccine>(this.vaccineUrl, vaccine);
  }

  createVaccinationRecord(
    userId: number,
    record: Partial<VaccinationRecord>
  ): Observable<VaccinationRecord> {
    return this.http.post<VaccinationRecord>(
      `${this.recordsUrl}/${userId}/vaccinationrecords`,
      record
    );
  }
}
