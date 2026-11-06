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

const TAG_LABELS = {
  new: 'Nuevo',
  sale: 'Oferta',
};

// Origen del producto. Un producto con "seller" fue publicado por un cliente (C2C);
// sin "seller" es un producto regular de la tienda (B2C).
const SOURCE_LABELS = {
  store: 'Tienda Elied',
  community: 'Comunidad',
};

const MAX_QTY = 10

// Promociones activas. La clave es el código de descuento.
// type: 'percent' (value = %), 'bogo' (2x1) o 'shipping' (envío gratis).
// category (opcional): limita la promoción a una categoría.
const PROMOS = {
  ELIED10: {
    tag: 'Toda la tienda',
    title: '10% de descuento',
    description: 'Obtén 10% menos en todos los productos de tu carrito.',
    note: 'Válido en toda la tienda.',
    type: 'percent',
    value: 10,
  },
  PLAYERA2X1: {
    tag: '2x1',
    title: '2x1 en playeras',
    description: 'Lleva dos playeras del mismo modelo y paga solo una.',
    note: 'Se descuenta una playera por cada par del mismo modelo.',
    type: 'bogo',
    category: 'tshirts',
  },
  ACCESORIOS15: {
    tag: 'Accesorios',
    title: '15% en accesorios',
    description: 'Anillos, bolsos, gafas y cinturones con 15% menos.',
    note: 'Solo aplica a productos de la categoría Accesorios.',
    type: 'percent',
    value: 15,
    category: 'accessories',
  },
  ENVIOGRATIS: {
    tag: 'Envío',
    title: 'Envío gratis',
    description: 'Sin importar el monto de tu compra, el envío corre por nuestra cuenta.',
    note: 'Normalmente el envío es gratis a partir de $999 MXN.',
    type: 'shipping',
  },
};

const PRODUCTS = [
  { id: 1,  name: 'Blusa de Seda Estampada',    price: 549,  tone: 1, category: 'blouses' },
  { id: 2,  name: 'Playera Cuello Redondo',     price: 249,  tone: 2, category: 'tshirts', tag: 'new' },
  { id: 3,  name: 'Set de Anillos Dorados',     price: 299,  tone: 3, category: 'accessories', seller: 'Mariana R.' },
  { id: 4,  name: 'Jeans Rectos Tiro Alto',     price: 899,  oldPrice: 1099, tone: 4, category: 'pants', tag: 'sale' },
  { id: 5,  name: 'Vestido Maxi Floral',        price: 1299, tone: 5, category: 'dresses' },
  { id: 6,  name: 'Camiseta Oversize Algodón',  price: 349,  tone: 6, category: 'tshirts' },
  { id: 7,  name: 'Bolso Bandolera de Cuero',   price: 799,  tone: 7, category: 'accessories', seller: 'Poeoquito' },
  { id: 8,  name: 'Blusa Campesina de Lino',    price: 459,  tone: 8, category: 'blouses', tag: 'new' },
  { id: 9,  name: 'Pantalón Cargo Ajustable',   price: 749,  tone: 8, category: 'pants', seller: 'Sofía M.' },
  { id: 10, name: 'Vestido Midi de Lino',       price: 999,  tone: 7, category: 'dresses' },
  { id: 11, name: 'Gafas de Sol Ojo de Gato',   price: 399,  oldPrice: 499,  tone: 6, category: 'accessories', tag: 'sale' },
  { id: 12, name: 'Playera Estampado Vintage',  price: 299,  oldPrice: 399,  tone: 5, category: 'tshirts', tag: 'sale', seller: 'Daniel P.' },
  { id: 13, name: 'Camisa de Botones XL',       price: 649,  tone: 4, category: 'blouses', seller: 'Camila V.' },
  { id: 14, name: 'Pantalón de Vestir Plisado', price: 1099, tone: 3, category: 'pants' },
  { id: 15, name: 'Vestido de Noche de Satín',  price: 1599, tone: 2, category: 'dresses', tag: 'new' },
  { id: 16, name: 'Cinturón Trenzado Fino',     price: 199,  tone: 1, category: 'accessories' },
];

function formatPrice(price) {
  return `$${price} MXN`;
}

// true si el producto lo publicó un cliente (C2C).
function isCommunity(product) {
  return Boolean(product.seller);
}

function sellerLabel(product) {
  return isCommunity(product) ? `Publicado por ${product.seller}` : 'Vendido por Elied';
}
