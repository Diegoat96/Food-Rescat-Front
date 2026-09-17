export interface Categoria {
  id: string;
  name: string;
}

// Etiquetas en español para las categorías que hoy envía el backend en inglés.
// Fallback frontend: si el backend migra a español los datos, el mapping sigue
// devolviendo el nombre original cuando no matchea.
export const CATEGORY_LABELS_ES: Record<string, string> = {
  Bakery: 'Panadería',
  Dairy: 'Lácteos',
  'Fruits and vegetables': 'Frutas y verduras',
  Other: 'Otro',
  'Prepared food': 'Comida preparada',
};

export function categoryLabel(name: string | null | undefined): string {
  if (!name) {
    return '';
  }
  const etiqueta = CATEGORY_LABELS_ES[name];
  if (etiqueta) {
    return etiqueta;
  }
  const clave = Object.keys(CATEGORY_LABELS_ES).find(
    (k) => k.toLowerCase() === name.toLowerCase(),
  );
  return clave ? CATEGORY_LABELS_ES[clave] : name;
}
