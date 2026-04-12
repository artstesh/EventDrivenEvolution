import { Injectable } from '@angular/core';

export type ModalType = 'confirm-discount' | 'order-history';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private openedModal: ModalType | null = null;

  open(modal: ModalType): ModalType {
    this.openedModal = modal;
    return this.openedModal;
  }

  close(): void {
    this.openedModal = null;
  }

  closeAll(): void {
    this.openedModal = null;
  }

  getOpenedModal(): ModalType | null {
    return this.openedModal;
  }

  isOpen(modal: ModalType): boolean {
    return this.openedModal === modal;
  }
}
