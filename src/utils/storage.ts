import { Service, Order, Address, Review, Favorite } from '../types';

const KEYS = {
  SERVICES: 'wje_services',
  ORDERS: 'wje_orders',
  ADDRESSES: 'wje_addresses',
  REVIEWS: 'wje_reviews',
  FAVORITES: 'wje_favorites',
  SEEDED: 'wje_seeded',
};

function load<T>(key: string): T[] {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function save<T>(key: string, data: T[]): void {
  localStorage.setItem(key, JSON.stringify(data));
}

// Services
export function getServices(): Service[] {
  return load<Service>(KEYS.SERVICES);
}

export function saveServices(services: Service[]): void {
  save(KEYS.SERVICES, services);
}

export function getServiceById(id: string): Service | undefined {
  return getServices().find((s) => s.id === id);
}

// Orders
export function getOrders(): Order[] {
  return load<Order>(KEYS.ORDERS);
}

export function saveOrders(orders: Order[]): void {
  save(KEYS.ORDERS, orders);
}

export function addOrder(order: Order): void {
  const orders = getOrders();
  orders.unshift(order);
  saveOrders(orders);
}

export function updateOrder(orderId: string, updates: Partial<Order>): void {
  const orders = getOrders();
  const idx = orders.findIndex((o) => o.id === orderId);
  if (idx !== -1) {
    orders[idx] = { ...orders[idx], ...updates };
    saveOrders(orders);
  }
}

export function getOrderById(orderId: string): Order | undefined {
  return getOrders().find((o) => o.id === orderId);
}

// Addresses
export function getAddresses(): Address[] {
  return load<Address>(KEYS.ADDRESSES);
}

export function saveAddresses(addresses: Address[]): void {
  save(KEYS.ADDRESSES, addresses);
}

export function addAddress(addr: Address): void {
  const addrs = getAddresses();
  addrs.push(addr);
  saveAddresses(addrs);
}

export function updateAddress(id: string, updates: Partial<Address>): void {
  const addrs = getAddresses();
  const idx = addrs.findIndex((a) => a.id === id);
  if (idx !== -1) {
    addrs[idx] = { ...addrs[idx], ...updates };
    saveAddresses(addrs);
  }
}

export function deleteAddress(id: string): void {
  const addrs = getAddresses().filter((a) => a.id !== id);
  saveAddresses(addrs);
}

// Reviews
export function getReviews(): Review[] {
  return load<Review>(KEYS.REVIEWS);
}

export function addReview(review: Review): void {
  const reviews = getReviews();
  reviews.unshift(review);
  save(KEYS.REVIEWS, reviews);
}

// Favorites
export function getFavorites(): Favorite[] {
  return load<Favorite>(KEYS.FAVORITES);
}

export function saveFavorites(favorites: Favorite[]): void {
  save(KEYS.FAVORITES, favorites);
}

export function getFavoritesByAunt(auntId: string): Favorite[] {
  return getFavorites().filter((f) => f.auntId === auntId);
}

export function isFavorited(auntId: string): boolean {
  return getFavorites().some((f) => f.auntId === auntId);
}

export function addFavorite(favorite: Favorite): void {
  const favorites = getFavorites();
  if (!favorites.some((f) => f.auntId === favorite.auntId)) {
    favorites.unshift(favorite);
    saveFavorites(favorites);
  }
}

export function removeFavorite(auntId: string): void {
  const favorites = getFavorites().filter((f) => f.auntId !== auntId);
  saveFavorites(favorites);
}

export function toggleFavorite(auntId: string, auntData?: Omit<Favorite, 'id' | 'createdAt' | 'auntId'>): boolean {
  if (isFavorited(auntId)) {
    removeFavorite(auntId);
    return false;
  } else if (auntData) {
    addFavorite({
      id: 'FAV' + Date.now().toString(36).toUpperCase(),
      auntId,
      createdAt: new Date().toISOString(),
      ...auntData,
    });
    return true;
  }
  return false;
}

// Seed check
export function isSeeded(): boolean {
  return localStorage.getItem(KEYS.SEEDED) === 'true';
}

export function markSeeded(): void {
  localStorage.setItem(KEYS.SEEDED, 'true');
}
