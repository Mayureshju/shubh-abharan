/**
 * The catalog's public surface. Import from here, never from `data/`.
 */

export * from "./types";
export { formatMoney, lowestPrice, hasPriceRange } from "./money";
export {
  getProduct,
  getProductsByIds,
  getCollection,
  getProductsBySlugs,
  listProducts,
  search,
} from "./repository";
export type { ListCriteria, SortOrder, CollectionWithProducts } from "./repository";
export { imageForRole, toProductCardProduct, relatedProducts } from "./derive";
