import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService, User, VaccinationRecord } from '../../../services/user.service';

@Component({
  selector: 'app-user-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.css'
})
export class UserDetailsComponent implements OnInit {
  users: User[] = [];
  selectedUserId: number | null = null;

  user?: User;
  records: VaccinationRecord[] = [];
  vaccineColumns: number[] = [];

  loading = true;
  errorMessage = '';

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loading = true;

    // 1) Carrega todos os usuários
    this.userService.getUsers().subscribe({
      next: (users) => {
        this.users = users;
        if (users.length > 0) {
          // seleciona o primeiro usuário por padrão
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

    // Carrega dados do usuário
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

    // Carrega registros de vacinação
    this.userService.getVaccinationRecords(userId).subscribe({
      next: (records) => {
        this.records = records;
        // popula as “colunas” com as vacinas que este usuário realmente tem
        this.vaccineColumns = Array.from(new Set(records.map(r => r.vaccineID)));
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading vaccination records:', err);
        this.errorMessage = 'Failed to load vaccination records.';
        this.loading = false;
      }
    });
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString();
  }
}
