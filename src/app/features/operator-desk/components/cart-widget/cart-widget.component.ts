import {Component, OnDestroy, OnInit, signal} from '@angular/core';
import {ModalFacade} from '../../facades/modal.facade';
import {CartFacade} from '../../facades/cart.facade';
import {Subscription} from 'rxjs';
import {CartMapper} from '../../mappers/cart.mapper';

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
  imports: [],
  templateUrl: './cart-widget.component.html',
  styleUrl: './cart-widget.component.scss',
})
export class CartWidgetComponent implements OnInit, OnDestroy {
  private subs: Subscription[] = [];
  cart = signal<CartWidgetVm | null>(null);

  constructor(private readonly modalFacade: ModalFacade,
              private readonly cartFacade: CartFacade,
              private readonly cartMapper: CartMapper) {
  }

  ngOnInit(): void {
    this.subs.push(this.cartFacade.cart.subscribe(cart =>
      this.cart.set(this.cartMapper.mapModelToWidgetVm(cart))))
  }

  placeOrder(): void {
    this.modalFacade.open('confirm-discount');
  }

  clearCart(): void {
    this.cartFacade.clearCart();
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }

}
