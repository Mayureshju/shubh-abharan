import { connectDb } from "@/lib/db/connect";
import { PriceRuleModel } from "@/lib/db/models";
import { savePriceRule } from "@/lib/actions/admin-ops";

function date(value?: Date | null) {
  return value ? new Date(value).toLocaleDateString("en-IN") : "—";
}

export default async function AdminPriceRules() {
  await connectDb();
  const rules = await PriceRuleModel.find().sort({ startsAt: -1 }).lean();
  return (
    <>
      <header className="admin-head">
        <h1>Price rules</h1>
      </header>
      <div className="admin-split">
        <div className="admin-table-wrap">
          <table>
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Change</th>
                <th scope="col">Applies to</th>
                <th scope="col">Period</th>
              </tr>
            </thead>
            <tbody>
              {rules.length === 0 ? (
                <tr>
                  <td colSpan={4} className="admin-empty">No price rules yet.</td>
                </tr>
              ) : (
                rules.map((rule) => (
                  <tr key={String(rule._id)}>
                    <td>{rule.name}</td>
                    <td>{rule.type === "percent_hike" ? `+${rule.value}%` : `+₹${rule.value / 100}`}</td>
                    <td>{rule.scope}</td>
                    <td className="admin-muted">
                      {date(rule.startsAt)} – {date(rule.endsAt)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <form action={savePriceRule} className="admin-card admin-form">
          <h2>Add price rule</h2>
          <label className="admin-field">
            <span>Name</span>
            <input name="name" required />
          </label>
          <div className="admin-form-row">
            <label className="admin-field">
              <span>Type</span>
              <select name="type">
                <option value="percent_hike">Percent hike</option>
                <option value="fixed_hike">Fixed hike (₹)</option>
              </select>
            </label>
            <label className="admin-field">
              <span>Value</span>
              <input name="value" type="number" />
            </label>
          </div>
          <div className="admin-form-row">
            <label className="admin-field">
              <span>Starts</span>
              <input name="startsAt" type="datetime-local" required />
            </label>
            <label className="admin-field">
              <span>Ends</span>
              <input name="endsAt" type="datetime-local" required />
            </label>
          </div>
          <label className="admin-field">
            <span>Applies to</span>
            <select name="scope">
              <option value="all">All products</option>
              <option value="categories">Categories</option>
              <option value="products">Products</option>
            </select>
          </label>
          <label className="admin-field">
            <span>Category slugs</span>
            <input name="categorySlugs" />
            <small>Used when applying to categories</small>
          </label>
          <label className="admin-field">
            <span>Product slugs</span>
            <input name="productSlugs" />
            <small>Used when applying to products</small>
          </label>
          <label className="admin-check">
            <input name="excludeOnSale" type="checkbox" /> Exclude products on sale
          </label>
          <div>
            <button className="admin-btn admin-btn-primary" type="submit">
              Save rule
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
