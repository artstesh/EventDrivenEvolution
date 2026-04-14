import {CustomerModel} from '../../models/customer.model';
import {CustomerDto} from '../../adapters/api/models/customer-dto';
import {PostboyExecutionHandler, PostboyExecutor} from '@artstesh/postboy';

export class CustomerFromDtoExecutor extends PostboyExecutor<CustomerModel> {
  static readonly ID = '2a5f2b24-387d-4562-9cf5-518554cf072c';

  constructor(public dto: CustomerDto) {
    super();
  }
}

export class CustomerFromDtoExecutorHandler extends PostboyExecutionHandler<CustomerModel, CustomerFromDtoExecutor> {

  handle(executor: CustomerFromDtoExecutor): CustomerModel {
    return {
      id: executor.dto.id,
      fullName: executor.dto.fullName,
      isVip: executor.dto.isVip,
      balance: executor.dto.balanceAmount,
      loyaltyLevel: executor.dto.loyaltyLevel,
      segment: executor.dto.segment,
      lastOrderAt: executor.dto.lastOrderAt,
    };
  }
}
