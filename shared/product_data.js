const BASE_DESC =
  'Playera de algodón suave, corte relajado y confeccionada para durar. ' +
  'Ideal para el uso diario, se puede combinar con cualquier outfit casual.';

const PRODUCTS = [
  { id: 1,  name: 'Ejemplo 1',  price: 549, tone: 1, description: BASE_DESC },
  { id: 2,  name: 'Ejemplo 2',  price: 279, tone: 2, description: BASE_DESC },
  { id: 3,  name: 'Ejemplo 3',  price: 399, tone: 3, description: BASE_DESC },
  { id: 4,  name: 'Ejemplo 4',  price: 689, tone: 4, description: BASE_DESC },
  { id: 5,  name: 'Ejemplo 5',  price: 899, tone: 5, description: BASE_DESC },
  { id: 6,  name: 'Ejemplo 6',  price: 749, tone: 6, description: BASE_DESC },
  { id: 7,  name: 'Ejemplo 7',  price: 599, tone: 7, description: BASE_DESC },
  { id: 8,  name: 'Ejemplo 8',  price: 329, tone: 8, description: BASE_DESC },
  { id: 9,  name: 'Ejemplo 9',  price: 329, tone: 8, description: BASE_DESC },
  { id: 10, name: 'Ejemplo 10', price: 329, tone: 7, description: BASE_DESC },
  { id: 11, name: 'Ejemplo 11', price: 329, tone: 6, description: BASE_DESC },
  { id: 12, name: 'Ejemplo 12', price: 329, tone: 5, description: BASE_DESC },
  { id: 13, name: 'Ejemplo 13', price: 329, tone: 4, description: BASE_DESC },
  { id: 14, name: 'Ejemplo 14', price: 329, tone: 3, description: BASE_DESC },
  { id: 15, name: 'Ejemplo 15', price: 329, tone: 2, description: BASE_DESC },
  { id: 16, name: 'Ejemplo 16', price: 329, tone: 1, description: BASE_DESC },
];

function formatPrice(price) {
  return `$${price} MXN`;
}