import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from './shared/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="bg-gray-50 min-h-[calc(100vh-3.5rem)]">
      <div class="max-w-3xl mx-auto px-4 py-16 text-center">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">StudyBuddy</h1>
        <p class="text-lg text-gray-600 mb-8">
          Vind studiegroepen, plan sessies en studeer samen met medestudenten.
        </p>

        @if (auth.isLoggedIn()) {
          <p class="text-gray-700 mb-6">
            Welkom terug, <span class="font-semibold">{{ auth.user()?.firstName }}</span>!
          </p>
        } @else {
          <div class="flex gap-4 justify-center">
            <a routerLink="/register"
              class="bg-red-600 text-white px-6 py-2 rounded font-medium hover:bg-red-700">
              Account aanmaken
            </a>
            <a routerLink="/login"
              class="border border-gray-300 text-gray-700 px-6 py-2 rounded font-medium hover:bg-gray-100">
              Inloggen
            </a>
          </div>
        }
      </div>
    </div>
  `,
})
export class HomeComponent {
  constructor(public auth: AuthService) {}
}
