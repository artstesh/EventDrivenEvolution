import { Injectable } from '@angular/core';
import { ModalService, ModalType } from '../services/modal';
import { NotificationService } from '../services/notification';

@Injectable({
  providedIn: 'root',
})
export class ModalFacade {
  constructor(
    private readonly modalService: ModalService,
    private readonly notificationService: NotificationService,
  ) {}

  open(modal: ModalType): ModalType {
    const opened = this.modalService.open(modal);

    this.notificationService.push({
      type: 'info',
      title: 'Открыто окно',
      message: `Модальное окно "${modal}" открыто.`,
    });

    return opened;
  }

  close(): void {
    this.modalService.close();
  }

  closeAll(): void {
    this.modalService.closeAll();
  }

  isOpen(modal: ModalType): boolean {
    return this.modalService.isOpen(modal);
  }
}
