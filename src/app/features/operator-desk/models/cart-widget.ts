export interface CartWidgetVm {
  itemCount: number;
  discount: number;
  subtotal: number;
  total: number;
  items: Array<CartItemVm>;
}

export interface CartItemVm {
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}
