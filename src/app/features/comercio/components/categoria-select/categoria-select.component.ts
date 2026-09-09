import { Component, OnInit, forwardRef, inject, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { CategoriasService } from '../../../../core/services/categorias.service';

@Component({
  selector: 'app-categoria-select',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './categoria-select.component.html',
  styleUrl: './categoria-select.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CategoriaSelectComponent),
      multi: true,
    },
  ],
})
export class CategoriaSelectComponent implements ControlValueAccessor, OnInit {
  private categoriasService = inject(CategoriasService);

  readonly categorias = this.categoriasService.categorias;
  readonly value = signal<string>('');

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  ngOnInit(): void {
    if (this.categorias().length === 0) {
      this.categoriasService.cargar().subscribe();
    }
  }

  writeValue(value: string): void {
    this.value.set(value ?? '');
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {}

  onSelect(event: Event): void {
    const categoriaId = (event.target as HTMLSelectElement).value;
    this.value.set(categoriaId);
    this.onChange(categoriaId);
    this.onTouched();
  }
}
