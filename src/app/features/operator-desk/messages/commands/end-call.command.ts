import {PostboyGenericMessage} from '@artstesh/postboy';

export class EndCallCommand extends PostboyGenericMessage {
  static readonly ID = '00c9ba64-8316-4ddf-9d71-f1c399e6ba8e';

  constructor() {
    super();
  }
}
