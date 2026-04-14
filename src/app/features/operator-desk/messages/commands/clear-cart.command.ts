import {PostboyGenericMessage} from '@artstesh/postboy';

export class ClearCartCommand extends PostboyGenericMessage {
  static readonly ID = 'b0a1fcaa-767b-43d6-9260-c68ec2d0f930';

  constructor() {
    super();
  }
}
