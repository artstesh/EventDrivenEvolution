import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {AppPostboyService} from './shared/services/app-postboy.service';
import {PostboyNotificationMiddleware} from './shared/services/postboy-notification-middleware';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('EventDrivenEvolution');

  constructor(private postboy: AppPostboyService) {
    postboy.addMiddleware(new PostboyNotificationMiddleware(postboy));
  }
}
