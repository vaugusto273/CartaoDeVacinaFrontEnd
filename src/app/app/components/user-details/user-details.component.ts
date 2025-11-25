import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  UserService,
  User,
  VaccinationRecord,
  Vaccine
} from '../../../services/user.service';

@Component({
  selector: 'app-user-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.css'
})
export class UserDetailsComponent implements OnInit {
  users: User[] = [];
  vaccines: Vaccine[] = [];

  selectedUserId: number | null = null;

  user?: User;
  records: VaccinationRecord[] = [];
  vaccineColumns: Vaccine[] = [];

  // doses fixas (1,2,3,4,5)
  doseLevels = [1, 2, 3, 4, 5];

  loading = true;
  errorMessage = '';

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loading = true;

    // 1) Carrega vacinas
    this.userService.getVaccines().subscribe({
      next: (vacs) => {
        this.vaccines = vacs;

        // 2) Depois carrega usuários
        this.userService.getUsers().subscribe({
          next: (users) => {
            this.users = users;
            if (users.length > 0) {
              this.selectedUserId = users[0].id;
              this.loadUserData(users[0].id);
            } else {
              this.loading = false;
              this.errorMessage = 'No users found.';
            }
          },
          error: (err) => {
            console.error('Error loading users:', err);
            this.loading = false;
            this.errorMessage = 'Failed to load users.';
          }
        });
      },
      error: (err) => {
        console.error('Error loading vaccines:', err);
        this.loading = false;
        this.errorMessage = 'Failed to load vaccines.';
      }
    });
  }

  onUserChange(userId: number): void {
    this.selectedUserId = userId;
    this.loadUserData(userId);
  }

  private loadUserData(userId: number): void {
    this.loading = true;
    this.errorMessage = '';
    this.user = undefined;
    this.records = [];
    this.vaccineColumns = [];

    // carrega dados do usuário
    this.userService.getUser(userId).subscribe({
      next: (user) => {
        this.user = user;
      },
      error: (err) => {
        console.error('Error loading user:', err);
        this.errorMessage = 'Failed to load user.';
        this.loading = false;
      }
    });

    // carrega registros de vacinação desse usuário
    this.userService.getVaccinationRecords(userId).subscribe({
      next: (records) => {
        this.records = records;

        // descobre quais vacinas esse usuário tem
        const vaccineIds = Array.from(new Set(records.map(r => r.vaccineID)));

        this.vaccineColumns = vaccineIds
          .map(id => this.vaccines.find(v => v.id === id))
          .filter((v): v is Vaccine => !!v);

        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading vaccination records:', err);
        this.errorMessage = 'Failed to load vaccination records.';
        this.loading = false;
      }
    });
  }

  // retorna o registro para uma célula (vacina, dose) – ou undefined se não tiver
  getRecordFor(vaccineId: number, dose: number): VaccinationRecord | undefined {
    return this.records.find(
      r => r.vaccineID === vaccineId && r.doseNumber === dose
    );
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString();
  }

  doseLabel(dose: number): string {
    switch (dose) {
      case 1: return '1st Dose';
      case 2: return '2nd Dose';
      case 3: return '3rd Dose';
      case 4: return '1st Booster';
      case 5: return '2nd Booster';
      default: return `Dose ${dose}`;
    }
  }
}
