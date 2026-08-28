import { Component } from '@angular/core';

@Component({
  selector: 'app-impacto-cliente',
  standalone: true,
  templateUrl: './impacto-cliente.component.html',
  styleUrl: './impacto-cliente.component.css',
})
export class ImpactoClienteComponent {
  readonly datos = [
    { valor: '2,340', label: 'alimentos rescatados' },
    { valor: '1,850 kg', label: 'de CO₂ evitado' },
    { valor: '890', label: 'personas alimentadas' },
  ];
}
