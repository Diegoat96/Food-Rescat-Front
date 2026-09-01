import { Page } from '@playwright/test';

export interface CredencialesUsuario {
  nombre: string;
  email: string;
  password: string;
}

const sufijo = `${Date.now()}-${Math.floor(Math.random() * 1_000_000)}`;

export function usuarioUnico(prefijo: string): CredencialesUsuario {
  return {
    nombre: `Usuario E2E ${prefijo} ${sufijo}`,
    email: `${prefijo}-${sufijo}@ejemplo.test`,
    password: 'ClaveSegura123!',
  };
}

export async function registrar(page: Page, usuario: CredencialesUsuario, rol: string): Promise<void> {
  await page.goto('/auth/register');
  await page.getByLabel('Nombre completo').fill(usuario.nombre);
  await page.getByLabel('Correo electrónico').fill(usuario.email);
  await page.getByLabel('Contraseña').fill(usuario.password);
  await page.getByLabel('Tipo de cuenta').selectOption(rol);
  await page.getByRole('button', { name: 'Crear Cuenta' }).click();
}

export async function iniciarSesion(page: Page, email: string, password: string): Promise<void> {
  await page.goto('/auth/login');
  await page.getByLabel('Correo electrónico').fill(email);
  await page.getByLabel('Contraseña').fill(password);
  await page.getByRole('button', { name: 'Iniciar Sesión' }).click();
}

export async function cerrarSesion(page: Page): Promise<void> {
  await page.getByRole('button', { name: 'Cerrar Sesión' }).click();
}