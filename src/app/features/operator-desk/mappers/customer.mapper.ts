import { Injectable } from '@angular/core';
import { CustomerModel } from '../models/customer.model';
import {CustomerDto} from '../adapters/api/models/customer-dto';
import {Currency} from '../adapters/api/models/currency.enum';

export interface CustomerProfileVm {
  fullName: string;
  vipLabel: string;
  balance: number;
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
      balance: dto.balanceAmount,
      loyaltyLevel: dto.loyaltyLevel,
      segment: dto.segment,
      lastOrderAt: dto.lastOrderAt,
    };
  }

  mapModelToProfileVm(model: CustomerModel): CustomerProfileVm {
    return {
      fullName: model.fullName,
      vipLabel: model.isVip ? 'VIP' : 'Standard',
      balance: model.balance,
      loyaltyLevel: model.loyaltyLevel ?? 'Unknown',
      segment: model.segment ?? 'Unknown',
      lastOrderAt: model.lastOrderAt ? this.formatDate(model.lastOrderAt) : 'No data',
    };
  }

  private formatDate(value: string): string {
    return new Intl.DateTimeFormat('ru-RU', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(new Date(value));
  }
}
