import {Component, Input} from '@angular/core';

export type StockBadgeState = 'available' | 'limited' | 'out';

@Component({
  selector: 'app-stock-badge',
  standalone: true,
  imports: [],
  templateUrl: './stock-badge.html',
  styleUrl: './stock-badge.scss',
})
export class StockBadge {
  @Input() state: StockBadgeState = 'available';
  @Input() label = 'Available';
}
