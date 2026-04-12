import { Routes } from '@angular/router';
import { OperatorDeskPage } from './features/operator-desk/pages/operator-desk-page/operator-desk-page';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: OperatorDeskPage,
  },
  {
    path: '**',
    redirectTo: '',
  },
];
