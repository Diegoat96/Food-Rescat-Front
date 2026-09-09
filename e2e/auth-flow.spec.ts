import { expect, test } from '@playwright/test';
import { cerrarSesion, iniciarSesion, registrar, usuarioUnico } from './helpers/auth';

test.describe('Registro y login', () => {
  test('registra un cliente y lo envía al login', async ({ page }) => {
    const usuario = usuarioUnico('cliente');
    await registrar(page, usuario);

    await expect(page).toHaveURL(/\/auth\/login/, { timeout: 15_000 });
  });

  test('cierra sesión y vuelve a iniciar sesión', async ({ page }) => {
    const usuario = usuarioUnico('cliente');
    await registrar(page, usuario);
    await expect(page).toHaveURL(/\/auth\/login/, { timeout: 15_000 });

    await iniciarSesion(page, usuario.email, usuario.password);
    await expect(page).toHaveURL(/\/cliente\/feed/, { timeout: 15_000 });
    await expect(page.getByPlaceholder('Buscar alimentos o comercio…')).toBeVisible();

    await cerrarSesion(page);
    await expect(page).toHaveURL(/\/auth\/login/);
  });

  test('muestra error con credenciales inválidas', async ({ page }) => {
    await page.goto('/auth/login');
    await page.getByLabel('Correo electrónico').fill('noexiste@ejemplo.test');
    await page.getByLabel('Contraseña').fill('ClaveSegura123!');
    await page.getByRole('button', { name: 'Iniciar Sesión' }).click();

    await expect(page.getByText('Credenciales inválidas')).toBeVisible({ timeout: 15_000 });
    await expect(page).toHaveURL(/\/auth\/login/);
  });
});
