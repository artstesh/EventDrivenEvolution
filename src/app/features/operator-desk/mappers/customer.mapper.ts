import { Injectable } from '@angular/core';
import { CustomerDto } from '../adapters/api/customer-api.adapter';
import { CustomerModel } from '../models/customer.model';
import { MoneyModel } from '../models/money.model';

export interface CustomerProfileVm {
  fullName: string;
  vipLabel: string;
  balance: string;
  loyaltyLevel: string;
  segment: string;
  lastOrderAt: string;
}

@Injectable({
  providedIn: 'root',
})
export class CustomerMapper {
  mapDtoToModel(dto: CustomerDto): CustomerModel {
    return {
      id: dto.id,
      fullName: dto.fullName,
      isVip: dto.isVip,
      balance: this.mapMoney(dto.balanceAmount, dto.balanceCurrency),
      loyaltyLevel: dto.loyaltyLevel,
      segment: dto.segment,
      lastOrderAt: dto.lastOrderAt,
    };
  }

  mapModelToProfileVm(model: CustomerModel): CustomerProfileVm {
    return {
      fullName: model.fullName,
      vipLabel: model.isVip ? 'VIP' : 'Обычный',
      balance: this.formatMoney(model.balance),
      loyaltyLevel: model.loyaltyLevel ?? 'Не указано',
      segment: model.segment ?? 'Не указан',
      lastOrderAt: model.lastOrderAt ? this.formatDate(model.lastOrderAt) : 'Нет данных',
    };
  }

  mapMoney(amount: number, currency: MoneyModel['currency']): MoneyModel {
    return {
      amount,
      currency,
    };
  }

  private formatMoney(money: MoneyModel): string {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: money.currency,
      maximumFractionDigits: 0,
    }).format(money.amount);
  }

  private formatDate(value: string): string {
    return new Intl.DateTimeFormat('ru-RU', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(new Date(value));
  }
}
