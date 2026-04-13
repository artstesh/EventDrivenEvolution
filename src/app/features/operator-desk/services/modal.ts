import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ModalStateModel, ModalType } from '../models/modal.model';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private readonly modalStateSubject = new BehaviorSubject<ModalStateModel>({
    activeModal: null,
  });

  readonly modalState$ = this.modalStateSubject.asObservable();

  get snapshot(): ModalStateModel {
    return this.modalStateSubject.value;
  }

  open(modal: Exclude<ModalType, null>): ModalStateModel {
    const updated = {
      activeModal: modal,
    };

    this.modalStateSubject.next(updated);
    return updated;
  }

  close(): ModalStateModel {
    const updated = {
      activeModal: null,
    };

    this.modalStateSubject.next(updated);
    return updated;
  }

  closeAll(): ModalStateModel {
    return this.close();
  }

  isOpen(modal: Exclude<ModalType, null>): boolean {
    return this.snapshot.activeModal === modal;
  }
}
