import { Routes } from '@angular/router';
import { UserDetailsComponent } from './app/components/user-details/user-details.component';

export const routes: Routes = [
  { path: '', component: UserDetailsComponent },
  { path: '**', redirectTo: '' }
];
