import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PublicarPaqueteFormComponent } from '../../components/publicar-paquete-form/publicar-paquete-form.component';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [RouterLink, PublicarPaqueteFormComponent],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css',
})
export class InicioComponent {
  readonly metricas = [
    { label: 'Alimentos publicados hoy', valor: '12', icon: '📦' },
    { label: 'En pendientes', valor: '4', icon: '⏳' },
    { label: 'Kg rescatados hoy', valor: '38,5 kg', icon: '🥦' },
    { label: 'Publicaciones activas', valor: '8', icon: '🟢' },
  ];

  readonly ultimas = [
    {
      titulo: 'Verduras de temporada',
      categoria: 'Frutas y Verduras',
      hora: '10:30',
      estado: 'Activo',
    },
    { titulo: 'Pan artesanal', categoria: 'Panadería', hora: '09:15', estado: 'Activo' },
    { titulo: 'Bebidas sin azúcar', categoria: 'Bebidas', hora: '08:40', estado: 'Pendiente' },
  ];
}
