import {Component, OnDestroy, OnInit, signal} from '@angular/core';
import {Subscription} from 'rxjs';
import {OpenModalCommand} from '../../messages/commands/open-modal.command';
import {AppPostboyService} from '../../../../shared/services/app-postboy.service';
import {CartStateEvent} from '../../messages/events/cart-state.event';
import {ClearCartCommand} from '../../messages/commands/clear-cart.command';
import {CartWidgetVm} from '../../models/cart-widget';
import {CartModelToWidgetExecutor} from '../../messages/executors/cart-model-to-widget.executor';

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

  constructor(private readonly postboy: AppPostboyService) {
  }

  ngOnInit(): void {
    this.subs.push(this.postboy.sub(CartStateEvent).subscribe(ev => {
      this.cart.set(this.postboy.exec(new CartModelToWidgetExecutor(ev.cart)));
      console.log(ev.cart);
    }))
  }

  placeOrder(): void {
    this.postboy.fire(new OpenModalCommand('confirm-discount'));
  }

  clearCart(): void {
    this.postboy.fire(new ClearCartCommand());
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }

}
