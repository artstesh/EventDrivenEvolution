import {CartItemModel} from './cart-item.model';

export class CartModel {
  get items(): CartItemModel[] {
    return this._items;
  }

  set items(value: CartItemModel[]) {
    this._items = value;
    this.recalculate();
  }
  get count(): number {
    return this._count;
  }
  get total(): number {
    return this._total;
  }

  get subtotal(): number {
    return this._subtotal;
  }

  get discount(): number {
    return this._discount;
  }

  set discount(value: number) {
    this._discount = value;
    this.calculateTotal();
  }

  private _count: number = 0;
  private _discount: number = 0;
  private _subtotal: number = 0;
  private _total: number = 0;

  private _items: CartItemModel[];

  public constructor(
    public id: string,
    items?: CartItemModel[],
    discount?: number) {
    this._items = items??[];
    this._discount = discount??0;
    this.recalculate();
  }

  public recalculate(): void {
    this.getItemCount();
    this.calculateTotal();
  }

  private calculateTotal(): void{
    this._subtotal = this._items.reduce((sum, item) => sum + item.totalPrice, 0);
    this._total = Math.max(0, this._subtotal - this._discount);
  }

  private getItemCount(): void {
    this._count = this._items.reduce((sum, item) => sum + item.quantity, 0);
  }
}
