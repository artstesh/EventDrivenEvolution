export type ModalType = 'confirm-discount' | 'order-history'| 'operator-session' | null;

export interface ModalStateModel {
  activeModal: ModalType;
}
