import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-call-status-panel',
  standalone: true,
  imports: [],
  templateUrl: './call-status-panel.html',
  styleUrl: './call-status-panel.scss',
})
export class CallStatusPanel {
  @Input() callTitle = 'Клиент подключён';
  @Input() customerName = 'Алексей Иванов';
  @Input() isVip = true;
  @Input() balance = '12 450 ₽';
  @Input() status = 'Обрабатывается';
  @Input() duration = '00:08:42';
}
