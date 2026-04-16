import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="bg-white border-b border-gray-200">
      <div class="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <div class="flex items-center gap-6">
          <a routerLink="/" class="text-lg font-bold text-gray-900">StudyBuddy</a>
          <a routerLink="/courses" routerLinkActive="text-red-600"
            class="text-sm text-gray-700 hover:text-gray-900 font-medium">
            Vakken
          </a>
          <a routerLink="/study-groups" routerLinkActive="text-red-600"
            class="text-sm text-gray-700 hover:text-gray-900 font-medium">
            Studiegroepen
          </a>
          <a routerLink="/study-sessions" routerLinkActive="text-red-600"
            class="text-sm text-gray-700 hover:text-gray-900 font-medium">
            Studiesessies
          </a>
          @if (auth.isLoggedIn()) {
            <a routerLink="/dashboard" routerLinkActive="text-red-600"
              class="text-sm text-gray-700 hover:text-gray-900 font-medium">
              Mijn overzicht
            </a>
          }
          <a routerLink="/about" routerLinkActive="text-red-600"
            class="text-sm text-gray-700 hover:text-gray-900 font-medium">
            About
          </a>
        </div>

        <div class="flex items-center gap-4">
          @if (auth.isLoggedIn()) {
            <span class="text-sm text-gray-600">
              {{ auth.user()?.firstName }} {{ auth.user()?.lastName }}
            </span>
            <button
              (click)="auth.logout()"
              class="text-sm text-red-600 hover:text-red-800 font-medium">
              Uitloggen
            </button>
          } @else {
            <a routerLink="/login" routerLinkActive="text-red-600"
              class="text-sm text-gray-700 hover:text-gray-900 font-medium">
              Inloggen
            </a>
            <a routerLink="/register"
              class="text-sm bg-red-600 text-white px-4 py-1.5 rounded font-medium hover:bg-red-700">
              Registreren
            </a>
          }
        </div>
      </div>
    </nav>
  `,
})
export class NavbarComponent {
  constructor(public auth: AuthService) {}
}
