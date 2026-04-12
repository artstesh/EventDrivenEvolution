import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-customer-profile-widget',
  standalone: true,
  imports: [],
  templateUrl: './customer-profile-widget.html',
  styleUrl: './customer-profile-widget.scss',
})
export class CustomerProfileWidget {
  @Input() fullName = 'Алексей Иванов';
  @Input() isVip = true;
  @Input() balance = '12 450 ₽';
  @Input() loyaltyLevel = 'Высокая';
  @Input() segment = 'Premium';
  @Input() lastOrderAt = '2 дня назад';
}
