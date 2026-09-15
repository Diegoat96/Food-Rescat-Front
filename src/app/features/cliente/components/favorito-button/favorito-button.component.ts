import { Component, EventEmitter, Input, Output, inject, signal } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { FavoritosService } from '../../../../core/services/favoritos.service';

@Component({
  selector: 'app-favorito-button',
  standalone: true,
  imports: [LucideAngularModule],
  templateUrl: './favorito-button.component.html',
  styleUrl: './favorito-button.component.css',
})
export class FavoritoButtonComponent {
  @Input({ required: true }) branchId!: string;

  private favoritosService = inject(FavoritosService);

  readonly procesando = signal(false);

  get esFavorito(): boolean {
    return this.favoritosService.esFavorito(this.branchId);
  }

  toggle(event: Event): void {
    event.stopPropagation();
    if (this.procesando()) {
      return;
    }
    this.procesando.set(true);
    this.favoritosService.toggle(this.branchId).subscribe({
      complete: () => this.procesando.set(false),
    });
  }
}
