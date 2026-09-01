import { Component, Input, computed, inject } from '@angular/core';
import { FavoritosService } from '../../../../core/services/favoritos.service';

@Component({
  selector: 'app-favorito-button',
  standalone: true,
  templateUrl: './favorito-button.component.html',
  styleUrl: './favorito-button.component.css',
})
export class FavoritoButtonComponent {
  @Input({ required: true }) sucursalId!: string;

  private favoritosService = inject(FavoritosService);

  readonly favorito = computed(() => this.favoritosService.esFavorito(this.sucursalId));

  toggle(): void {
    this.favoritosService.toggle(this.sucursalId).subscribe();
  }
}