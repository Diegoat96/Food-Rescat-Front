import { Component } from '@angular/core';
import { VerificacionCajaComponent } from '../../components/verificacion-caja/verificacion-caja.component';
import { TablaEntregasComponent } from '../../components/tabla-entregas/tabla-entregas.component';

@Component({
  selector: 'app-pendientes',
  standalone: true,
  imports: [VerificacionCajaComponent, TablaEntregasComponent],
  templateUrl: './pendientes.component.html',
  styleUrl: './pendientes.component.css',
})
export class PendientesComponent {}