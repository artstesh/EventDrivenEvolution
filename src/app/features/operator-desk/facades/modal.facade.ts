import { Injectable } from '@angular/core';
import { ModalService } from '../services/modal';
import { NotificationService } from '../services/notification';
import {ModalStateModel, ModalType} from '../models/modal.model';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ModalFacade {
  constructor(
    private readonly modalService: ModalService,
    private readonly notificationService: NotificationService,
  ) {}

  get modalState$(): Observable<ModalStateModel> {
    return this.modalService.modalState$;
  }

  get activeModal(): ModalType {
    return this.modalService.snapshot.activeModal;
  }

  open(modal: Exclude<ModalType, null>): ModalType {
    const opened = this.modalService.open(modal);

    this.notificationService.push({
      type: 'info',
      title: 'A modal is opened',
      message: `The modal "${modal}" is opened.`,
    });

    return opened.activeModal;
  }

  close(): void {
    this.modalService.close();
  }

  closeAll(): void {
    this.modalService.closeAll();
  }

  isOpen(modal: Exclude<ModalType, null>): boolean {
    return this.modalService.isOpen(modal);
  }
}
