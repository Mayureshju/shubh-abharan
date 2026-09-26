/**
 * The catalog's public surface. Import from here, never from `data/`.
 */

export * from "./types";
export {
  CATEGORY_LABELS,
  CATEGORY_ORDER,
  AVAILABILITY_LABELS,
  AVAILABILITY_ORDER,
  SORT_LABELS,
  SORT_ORDER,
  categoryLabel,
} from "./labels";
export { formatMoney, lowestPrice, hasPriceRange } from "./money";
export {
  getProduct,
  getProductById,
  getProductsByIds,
  getCollection,
  getProductsBySlugs,
  listProducts,
  listCategories,
  listCollections,
  listTags,
  search,
} from "./repository";
export type { ListCriteria, SortOrder } from "./criteria";
export type { CollectionWithProducts, CategoryRecord, TagRecord } from "./repository";
export { imageForRole, toProductCardProduct, relatedProducts } from "./derive";
