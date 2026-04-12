import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

export interface CartItemVm {
  name: string;
  quantity: number;
  unitPrice: string;
  totalPrice: string;
}

export interface CartWidgetVm {
  itemCount: number;
  discount: string;
  subtotal: string;
  total: string;
  items: CartItemVm[];
}

@Component({
  selector: 'app-cart-widget',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart-widget.component.html',
  styleUrl: './cart-widget.component.scss',
})
export class CartWidgetComponent {
  @Input() itemCount = 0;
  @Input() discount = '0 ₽';
  @Input() subtotal = '0 ₽';
  @Input() total = '0 ₽';
  @Input() items: CartItemVm[] = [];
}
