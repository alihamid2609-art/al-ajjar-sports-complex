import { Routes } from '@angular/router';
import { LegacyPageComponent } from './legacy-page.component';

export const routes: Routes = [
  { path: '', redirectTo: 'indoor-arena', pathMatch: 'full' },
  { path: 'indoor-arena', component: LegacyPageComponent, data: { page: 'index.html' } },
  { path: 'cricket-stadium', component: LegacyPageComponent, data: { page: 'homev2.html' } },
  { path: 'about', component: LegacyPageComponent, data: { page: 'about.html' } },
  { path: 'bookings', component: LegacyPageComponent, data: { page: 'event.html' } },
  { path: 'booking-details', component: LegacyPageComponent, data: { page: 'event-details.html' } },
  { path: 'teams', component: LegacyPageComponent, data: { page: 'community.html' } },
  { path: 'profile', component: LegacyPageComponent, data: { page: 'profile.html' } },
  { path: 'dashboard', component: LegacyPageComponent, data: { page: 'dashboard.html' } },
  { path: 'contact', component: LegacyPageComponent, data: { page: 'contact.html' } },
  { path: '**', redirectTo: 'indoor-arena' }
];
