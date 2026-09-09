import { Component, Input } from '@angular/core';
import { FavoritoButtonComponent } from '../favorito-button/favorito-button.component';

export interface SucursalCardData {
  id: string;
  name: string;
  address: string;
  city?: string;
  rating?: number;
}

@Component({
  selector: 'app-sucursal-card',
  standalone: true,
  imports: [FavoritoButtonComponent],
  templateUrl: './sucursal-card.component.html',
  styleUrl: './sucursal-card.component.css',
})
export class SucursalCardComponent {
  @Input({ required: true }) sucursal!: SucursalCardData;

  iniciales(): string {
    const nombre = this.sucursal.name.trim();
    const partes = nombre.split(/\s+/);
    return (partes[0]?.[0] ?? '?').toUpperCase();
  }
}
