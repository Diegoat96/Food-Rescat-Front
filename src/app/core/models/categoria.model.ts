export interface Categoria {
  id: string;
  name: string;
}

// Etiquetas en español para las categorías. El backend ya entrega nombres en
// español (migración 20260917000000_translate_categories_to_spanish); este
// mapping queda como fallback seguro para datos legacy, devolviendo el nombre
// original cuando no matchea ninguna clave.
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
