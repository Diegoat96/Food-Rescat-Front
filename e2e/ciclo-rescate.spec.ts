import { expect, test } from '@playwright/test';
import { cerrarSesion, iniciarSesion, registrar, usuarioUnico } from './helpers/auth';

test.describe('Ciclo completo de rescate', () => {
  test('comercio publica, cliente reserva y comercio verifica en caja', async ({ browser }) => {
    const comercio = usuarioUnico('comercio');
    const cliente = usuarioUnico('cliente');
    const producto = `Paquete E2E ${Date.now()}`;

    // --- Comercio: crear cuenta, sucursal y publicar paquete ---
    const ctxComercio = await browser.newContext();
    const comercioPage = await ctxComercio.newPage();

    await registrar(comercioPage, comercio, 'COMERCIO');
    await expect(comercioPage).toHaveURL(/\/comercio\/inicio/, { timeout: 15_000 });

    await comercioPage.goto('/comercio/sucursales');
    await comercioPage.getByRole('button', { name: '+ Nueva sucursal' }).click();
    await comercioPage.getByLabel('Nombre de sucursal').fill('Sucursal E2E');
    await comercioPage.getByLabel('Dirección').fill('Av. Centro 123');
    await comercioPage.getByLabel('Latitud').fill('14.6349');
    await comercioPage.getByLabel('Longitud').fill('-90.5069');
    await comercioPage.getByRole('button', { name: 'Crear sucursal' }).click();
    await expect(comercioPage.getByText('Sucursal E2E').first()).toBeVisible({ timeout: 15_000 });

    await comercioPage.goto('/comercio/publicar');
    await comercioPage.getByLabel('Producto').fill(producto);
    await comercioPage.locator('app-categoria-select select').selectOption({ index: 1 });
    await comercioPage.getByLabel('Cantidad de stock').fill('3');
    await comercioPage.locator('#horaLimiteRecogida').selectOption('22:00');
    await comercioPage.getByLabel('Precio', { exact: true }).fill('50');
    await comercioPage.getByLabel('Precio con descuento').fill('15');
    await comercioPage.getByRole('button', { name: 'Publicar' }).click();
    await expect(comercioPage.getByText('¡Paquete publicado!')).toBeVisible({ timeout: 15_000 });

    await cerrarSesion(comercioPage);
    await ctxComercio.close();

    // --- Cliente: reservar el paquete y capturar el código de verificación ---
    const ctxCliente = await browser.newContext();
    const clientePage = await ctxCliente.newPage();

    await registrar(clientePage, cliente, 'CLIENTE');
    await expect(clientePage).toHaveURL(/\/cliente\/feed/, { timeout: 15_000 });

    await clientePage.getByPlaceholder('Buscar alimentos o comercio…').fill(producto);
    const tarjeta = clientePage.locator('app-paquete-card', { hasText: producto });
    await expect(tarjeta).toBeVisible({ timeout: 15_000 });
    await tarjeta.getByRole('button', { name: 'Reservar' }).click();

    const modal = clientePage.locator('app-ticket-rescate-modal');
    await expect(modal.getByText('¡Rescate confirmado!')).toBeVisible({ timeout: 15_000 });
    const codigo = (await modal.locator('p.font-mono.text-3xl').textContent())?.trim() ?? '';
    expect(codigo).toMatch(/^[A-Za-z0-9-]+$/);

    await cerrarSesion(clientePage);
    await ctxCliente.close();

    // --- Comercio: verificar el código en caja y completar la entrega ---
    const ctxVerificacion = await browser.newContext();
    const verificacionPage = await ctxVerificacion.newPage();

    await iniciarSesion(verificacionPage, comercio.email, comercio.password);
    await expect(verificacionPage).toHaveURL(/\/comercio\/inicio/, { timeout: 15_000 });

    await verificacionPage.goto('/comercio/pendientes');
    await expect(verificacionPage.getByText(producto)).toBeVisible({ timeout: 15_000 });
    await expect(verificacionPage.getByText(codigo)).toBeVisible();

    await verificacionPage.getByPlaceholder('RC-XXXX').fill(codigo);
    await verificacionPage.getByRole('button', { name: 'Verificar' }).click();
    await expect(verificacionPage.getByText(/Entrega completada/)).toBeVisible({ timeout: 15_000 });
    await expect(verificacionPage.getByText('Rescatado').first()).toBeVisible({ timeout: 15_000 });

    await ctxVerificacion.close();
  });
});