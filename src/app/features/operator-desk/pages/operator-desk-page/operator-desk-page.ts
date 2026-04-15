import {Component, OnDestroy, OnInit} from '@angular/core';
import {OperatorDeskShell} from '../../components/operator-desk-shell/operator-desk-shell';
import {ToastCenter} from '../../components/toast-center/toast-center';
import {PushNotificationCommand} from '../../messages/commands/push-notification.command';
import {AppPostboyService} from '../../../../shared/services/app-postboy.service';
import {OperatorDeskMessageRegister} from '../../services/operator-desk-message.register';
import {ClearCartCommand} from '../../messages/commands/clear-cart.command';
import {EndCallCommand} from '../../messages/commands/end-call.command';

@Component({
  selector: 'app-operator-desk-page',
  standalone: true,
  imports: [OperatorDeskShell, ToastCenter],
  providers: [OperatorDeskMessageRegister],
  templateUrl: './operator-desk-page.html',
  styleUrl: './operator-desk-page.scss',
})
export class OperatorDeskPage implements OnInit, OnDestroy {

  constructor(
    private readonly postboy: AppPostboyService,
    private readonly register: OperatorDeskMessageRegister
  ) {
    register.up();
  }

  async ngOnInit(): Promise<void> {
    this.postboy.fire(new PushNotificationCommand('info', 'The workspace is ready', 'Operator Panel is loaded'));
    this.postboy.sub(EndCallCommand).subscribe(() => this.onEndCall());
  }

  onEndCall(): void {
    this.postboy.fire(new ClearCartCommand());
  }

  ngOnDestroy(): void {
    this.register.down();
  }
}
