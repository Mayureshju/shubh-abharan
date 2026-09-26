import { connectDb } from "@/lib/db/connect";
import { CouponModel } from "@/lib/db/models";
import { saveCoupon } from "@/lib/actions/admin-ops";

const TYPE_LABEL: Record<string, string> = {
  percent: "Percent",
  fixed: "Fixed ₹",
  free_shipping: "Free shipping",
};

function date(value?: Date | null) {
  return value ? new Date(value).toLocaleDateString("en-IN") : "—";
}

export default async function AdminCoupons() {
  await connectDb();
  const coupons = await CouponModel.find().sort({ code: 1 }).lean();
  return (
    <>
      <header className="admin-head">
        <h1>Coupons</h1>
      </header>
      <div className="admin-split">
        <div className="admin-table-wrap">
          <table>
            <thead>
              <tr>
                <th scope="col">Code</th>
                <th scope="col">Type</th>
                <th scope="col" className="num">Value</th>
                <th scope="col">Valid</th>
                <th scope="col" className="num">Used</th>
              </tr>
            </thead>
            <tbody>
              {coupons.length === 0 ? (
                <tr>
                  <td colSpan={5} className="admin-empty">No coupons yet.</td>
                </tr>
              ) : (
                coupons.map((coupon) => (
                  <tr key={coupon.code}>
                    <td><strong>{coupon.code}</strong></td>
                    <td>{TYPE_LABEL[coupon.type] ?? coupon.type}</td>
                    <td className="num">{coupon.type === "free_shipping" ? "—" : coupon.type === "fixed" ? `₹${coupon.value / 100}` : `${coupon.value}%`}</td>
                    <td className="admin-muted">
                      {date(coupon.startsAt)} – {date(coupon.endsAt)}
                    </td>
                    <td className="num">{coupon.usedCount}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <form action={saveCoupon} className="admin-card admin-form">
          <h2>Add coupon</h2>
          <div className="admin-form-row">
            <label className="admin-field">
              <span>Code</span>
              <input name="code" required />
            </label>
            <label className="admin-field">
              <span>Type</span>
              <select name="type">
                <option value="percent">Percent</option>
                <option value="fixed">Fixed (₹)</option>
                <option value="free_shipping">Free shipping</option>
              </select>
            </label>
          </div>
          <div className="admin-form-row">
            <label className="admin-field">
              <span>Value</span>
              <input name="value" type="number" />
            </label>
            <label className="admin-field">
              <span>Minimum subtotal (₹)</span>
              <input name="minSubtotal" type="number" />
            </label>
          </div>
          <div className="admin-form-row">
            <label className="admin-field">
              <span>Starts</span>
              <input name="startsAt" type="datetime-local" />
            </label>
            <label className="admin-field">
              <span>Ends</span>
              <input name="endsAt" type="datetime-local" />
            </label>
          </div>
          <label className="admin-field">
            <span>Category slugs</span>
            <input name="categorySlugs" />
            <small>Optional, comma separated</small>
          </label>
          <label className="admin-field">
            <span>Product slugs</span>
            <input name="productSlugs" />
            <small>Optional, comma separated</small>
          </label>
          <div>
            <button className="admin-btn admin-btn-primary" type="submit">
              Save coupon
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
