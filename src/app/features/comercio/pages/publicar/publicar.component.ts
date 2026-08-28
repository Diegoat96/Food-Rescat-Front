import { Component } from '@angular/core';
import { PublicarPaqueteFormComponent } from '../../components/publicar-paquete-form/publicar-paquete-form.component';

@Component({
  selector: 'app-publicar',
  standalone: true,
  imports: [PublicarPaqueteFormComponent],
  templateUrl: './publicar.component.html',
  styleUrl: './publicar.component.css',
})
export class PublicarComponent {}
