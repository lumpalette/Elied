const CATEGORY_LABELS = {
  tshirts: 'Playeras',
  blouses: 'Blusas',
  pants: 'Pantalones',
  dresses: 'Vestidos',
  accessories: 'Accesorios',
};

const DESCRIPTIONS = {
  tshirts: 'Playera de algodón suave, corte relajado y confeccionada para durar. Ideal para el uso diario, se combina con cualquier outfit casual.',
  blouses: 'Blusa ligera y cómoda, de caída suave y acabado cuidado. Perfecta para el día a día o para darle un toque más arreglado a tu look.',
  pants: 'Pantalón cómodo de corte clásico, hecho con tela resistente que conserva forma y color. Una pieza básica que no pasa de moda.',
  dresses: 'Vestido sencillo y versátil, con tela fresca y buen caído. Se siente cómodo todo el día y funciona igual para salir que para el diario.',
  accessories: 'Accesorio pensado para completar tu outfit sin complicarlo. Detalles simples, materiales duraderos y fáciles de combinar.',
};

const PRODUCTS = [
  { id: 1, name: 'Blusa de Seda Estampada', price: 549, tone: 1, category: 'blouses' },
  { id: 2, name: 'Playera Cuello Redondo', price: 249, tone: 2, category: 'tshirts' },
  { id: 3, name: 'Set de Anillos Dorados', price: 299, tone: 3, category: 'accessories' },
  { id: 4, name: 'Jeans Rectos Tiro Alto', price: 899, tone: 4, category: 'pants' },
  { id: 5, name: 'Vestido Maxi Floral', price: 1299, tone: 5, category: 'dresses' },
  { id: 6, name: 'Camiseta Oversize Algodón', price: 349, tone: 6, category: 'tshirts' },
  { id: 7, name: 'Bolso Bandolera de Cuero', price: 799, tone: 7, category: 'accessories' },
  { id: 8, name: 'Blusa Campesina de Lino', price: 459, tone: 8, category: 'blouses' },
  { id: 9, name: 'Pantalón Cargo Ajustable', price: 749, tone: 8, category: 'pants' },
  { id: 10, name: 'Vestido Midi de Lino', price: 999, tone: 7, category: 'dresses' },
  { id: 11, name: 'Gafas de Sol Ojo de Gato', price: 399, tone: 6, category: 'accessories' },
  { id: 12, name: 'Playera Estampado Vintage', price: 299, tone: 5, category: 'tshirts' },
  { id: 13, name: 'Camisa de Botones XL', price: 649, tone: 4, category: 'blouses' },
  { id: 14, name: 'Pantalón de Vestir Plisado', price: 1099, tone: 3, category: 'pants' },
  { id: 15, name: 'Vestido de Noche de Satín', price: 1599, tone: 2, category: 'dresses' },
  { id: 16, name: 'Cinturón Trenzado Fino', price: 199, tone: 1, category: 'accessories' },
];

function formatPrice(price) {
  return `$${price} MXN`;
}