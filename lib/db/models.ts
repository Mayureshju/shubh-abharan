import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

function modelOf<T>(name: string, schema: Schema): Model<T> {
  // Cast rather than `mongoose.model<T>(…)`: the generic call sends Mongoose 9's
  // overloads into unbounded inference and tsc runs out of memory.
  return (mongoose.models[name] ?? mongoose.model(name, schema)) as unknown as Model<T>;
}

const MoneySchema = new Schema(
  {
    amount: { type: Number, required: true },
    currency: { type: String, required: true, default: "INR" },
  },
  { _id: false },
);

const ImageSchema = new Schema(
  {
    role: { type: String, required: true },
    src: String,
    alt: { type: String, required: true },
    aspect: { type: String, required: true },
    crop: String,
    position: String,
    dimension: String,
  },
  { _id: false },
);

const VariantSchema = new Schema(
  {
    key: { type: String, required: true },
    sku: String,
    options: { type: Schema.Types.Mixed, default: {} },
    price: { type: MoneySchema, default: null },
    salePrice: { type: MoneySchema, default: null },
    availability: { type: String, required: true, default: "available" },
  },
  { _id: false },
);

const OptionSchema = new Schema(
  {
    axis: { type: String, required: true },
    values: { type: [String], required: true },
  },
  { _id: false },
);

const CategorySchema = new Schema(
  {
    slug: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    tags: { type: [String], default: [] },
    productOrder: { type: [String], default: [] },
    seoTitle: { type: String, default: null },
    seoDescription: { type: String, default: null },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

const TagSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    seoTitle: { type: String, default: null },
    seoDescription: { type: String, default: null },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

const ProductSchema = new Schema(
  {
    key: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    categorySlug: { type: String, required: true, index: true },
    tags: { type: [String], default: [] },
    newArrival: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
    isSize: { type: Boolean, default: false },
    sizes: { type: [String], default: [] },
    options: { type: [OptionSchema], default: [] },
    variants: { type: [VariantSchema], required: true },
    images: { type: [ImageSchema], required: true },
    collections: { type: [String], default: [] },
    occasions: { type: [String], default: [] },
    materialLine: { type: String, default: null },
    description: { type: String, default: null },
    care: { type: String, default: null },
    attributes: { type: [{ label: String, value: String, _id: false }], default: [] },
    labels: { type: [String], default: [] },
    relatedSlugs: { type: [String], default: [] },
    componentSlugs: { type: [String], default: [] },
    seoTitle: { type: String, default: null },
    seoDescription: { type: String, default: null },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

const CollectionSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String, default: null },
    tagline: { type: String, default: null },
    tags: { type: [String], default: [] },
    productOrder: { type: [String], default: [] },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

const CouponSchema = new Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true },
    type: { type: String, required: true, enum: ["percent", "fixed", "free_shipping"] },
    value: { type: Number, required: true },
    minSubtotal: { type: Number, default: null },
    startsAt: { type: Date, default: null },
    endsAt: { type: Date, default: null },
    usageLimit: { type: Number, default: null },
    perUserLimit: { type: Number, default: null },
    usedCount: { type: Number, default: 0 },
    productSlugs: { type: [String], default: [] },
    categorySlugs: { type: [String], default: [] },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

const PriceRuleSchema = new Schema(
  {
    name: { type: String, required: true },
    type: { type: String, required: true, enum: ["percent_hike", "fixed_hike"] },
    value: { type: Number, required: true },
    startsAt: { type: Date, required: true },
    endsAt: { type: Date, required: true },
    scope: { type: String, required: true, enum: ["all", "categories", "products"] },
    categorySlugs: { type: [String], default: [] },
    productSlugs: { type: [String], default: [] },
    excludeOnSale: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

const DeliveryAreaSchema = new Schema(
  {
    name: { type: String, required: true },
    pincodes: { type: [String], required: true },
    charge: { type: MoneySchema, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

const SettingsSchema = new Schema(
  {
    key: { type: String, required: true, unique: true, default: "store" },
    freeDeliveryMin: { type: Number, default: null },
    codEnabled: { type: Boolean, default: true },
    currency: { type: String, default: "INR" },
  },
  { timestamps: true },
);

const UserSchema = new Schema(
  {
    clerkUserId: { type: String, required: true, unique: true },
    email: String,
    name: String,
    role: { type: String, required: true, default: "customer" },
    addresses: { type: [Schema.Types.Mixed], default: [] },
  },
  { timestamps: true },
);

const CartLineSchema = new Schema(
  {
    productId: { type: String, required: true },
    variantId: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false },
);

const CartSchema = new Schema(
  {
    clerkUserId: { type: String, required: true, unique: true },
    lines: { type: [CartLineSchema], default: [] },
  },
  { timestamps: true },
);

const WishlistSchema = new Schema(
  {
    clerkUserId: { type: String, required: true, unique: true },
    entries: {
      type: [
        {
          productId: { type: String, required: true },
          variantId: String,
        },
      ],
      default: [],
    },
  },
  { timestamps: true },
);

const OrderLineSchema = new Schema(
  {
    productId: { type: String, required: true },
    variantId: { type: String, required: true },
    slug: { type: String, required: true },
    name: { type: String, required: true },
    sizeLabel: String,
    imageSrc: String,
    quantity: { type: Number, required: true },
    unitPayable: { type: MoneySchema, required: true },
  },
  { _id: false },
);

const OrderSchema = new Schema(
  {
    clerkUserId: { type: String, required: true, index: true },
    email: String,
    lines: { type: [OrderLineSchema], required: true },
    pricing: {
      subtotal: { type: Number, required: true },
      discount: { type: Number, required: true },
      shipping: { type: Number, required: true },
      total: { type: Number, required: true },
      currency: { type: String, required: true, default: "INR" },
      couponCode: String,
      shippingWaived: { type: Boolean, default: false },
    },
    shippingAddress: {
      name: String,
      phone: String,
      line1: String,
      line2: String,
      city: String,
      state: String,
      pincode: { type: String, required: true },
    },
    deliveryAreaName: String,
    payment: {
      method: { type: String, required: true, enum: ["razorpay", "cod"] },
      status: { type: String, required: true },
      razorpayOrderId: String,
      razorpayPaymentId: String,
    },
    status: { type: String, required: true, index: true },
    timeline: { type: [{ status: String, at: Date, _id: false }], default: [] },
  },
  { timestamps: true },
);

const ProcessedEventSchema = new Schema(
  {
    provider: { type: String, required: true },
    eventId: { type: String, required: true, unique: true },
  },
  { timestamps: true },
);

export type CategoryDoc = InferSchemaType<typeof CategorySchema> & { _id: mongoose.Types.ObjectId };
export type TagDoc = InferSchemaType<typeof TagSchema> & { _id: mongoose.Types.ObjectId };
export type ProductDoc = InferSchemaType<typeof ProductSchema> & { _id: mongoose.Types.ObjectId };
export type CollectionDoc = InferSchemaType<typeof CollectionSchema> & { _id: mongoose.Types.ObjectId };
export type CouponDoc = InferSchemaType<typeof CouponSchema> & { _id: mongoose.Types.ObjectId };
export type PriceRuleDoc = InferSchemaType<typeof PriceRuleSchema> & { _id: mongoose.Types.ObjectId };
export type DeliveryAreaDoc = InferSchemaType<typeof DeliveryAreaSchema> & { _id: mongoose.Types.ObjectId };
export type SettingsDoc = InferSchemaType<typeof SettingsSchema> & { _id: mongoose.Types.ObjectId };
export type UserDoc = InferSchemaType<typeof UserSchema> & { _id: mongoose.Types.ObjectId };
export type CartDoc = InferSchemaType<typeof CartSchema> & { _id: mongoose.Types.ObjectId };
export type WishlistDoc = InferSchemaType<typeof WishlistSchema> & { _id: mongoose.Types.ObjectId };
type OrderShape = InferSchemaType<typeof OrderSchema>;
// `pricing` and `payment` are always written at checkout; InferSchemaType marks
// nested objects optional, so restate them as present.
export type OrderDoc = Omit<OrderShape, "pricing" | "payment"> & {
  _id: mongoose.Types.ObjectId;
  pricing: NonNullable<OrderShape["pricing"]>;
  payment: NonNullable<OrderShape["payment"]>;
};

export const CategoryModel = modelOf<CategoryDoc>("Category", CategorySchema);
export const TagModel = modelOf<TagDoc>("Tag", TagSchema);
export const ProductModel = modelOf<ProductDoc>("Product", ProductSchema);
export const CollectionModel = modelOf<CollectionDoc>("Collection", CollectionSchema);
export const CouponModel = modelOf<CouponDoc>("Coupon", CouponSchema);
export const PriceRuleModel = modelOf<PriceRuleDoc>("PriceRule", PriceRuleSchema);
export const DeliveryAreaModel = modelOf<DeliveryAreaDoc>("DeliveryArea", DeliveryAreaSchema);
export const SettingsModel = modelOf<SettingsDoc>("Settings", SettingsSchema);
export const UserModel = modelOf<UserDoc>("User", UserSchema);
export const CartModel = modelOf<CartDoc>("Cart", CartSchema);
export const WishlistModel = modelOf<WishlistDoc>("Wishlist", WishlistSchema);
export const OrderModel = modelOf<OrderDoc>("Order", OrderSchema);
export const ProcessedEventModel = modelOf<{ provider: string; eventId: string }>(
  "ProcessedEvent",
  ProcessedEventSchema,
);
