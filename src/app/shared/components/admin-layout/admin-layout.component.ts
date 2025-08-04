import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminHeaderComponent } from '../admin-header/admin-header.component';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, AdminHeaderComponent],
  template: `
    <div class="admin-layout" [attr.data-theme]="themeService.theme()">
      <app-admin-header></app-admin-header>
      <main class="admin-main">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styleUrls: ['./admin-layout.component.scss']
})
export class AdminLayoutComponent {
  constructor(public themeService: ThemeService) {}
} 