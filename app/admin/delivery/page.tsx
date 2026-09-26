import { connectDb } from "@/lib/db/connect";
import { DeliveryAreaModel, SettingsModel } from "@/lib/db/models";
import { saveDeliveryArea, saveSettings } from "@/lib/actions/admin-ops";
import { formatMoney } from "@/lib/catalog/money";

export default async function AdminDelivery() {
  await connectDb();
  const [areas, settings] = await Promise.all([
    DeliveryAreaModel.find().sort({ name: 1 }).lean(),
    SettingsModel.findOne({ key: "store" }).lean(),
  ]);
  return (
    <>
      <header className="admin-head">
        <h1>Delivery</h1>
      </header>
      <div className="admin-split">
        <div>
          <div className="admin-table-wrap">
            <table>
              <thead>
                <tr>
                  <th scope="col">Area</th>
                  <th scope="col">Pincodes</th>
                  <th scope="col" className="num">Charge</th>
                </tr>
              </thead>
              <tbody>
                {areas.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="admin-empty">No delivery areas yet.</td>
                  </tr>
                ) : (
                  areas.map((area) => (
                    <tr key={String(area._id)}>
                      <td>{area.name}</td>
                      <td className="admin-muted" style={{ whiteSpace: "normal" }}>
                        {area.pincodes.join(", ")}
                      </td>
                      <td className="num">{formatMoney({ amount: area.charge.amount, currency: "INR" })}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <form action={saveSettings} className="admin-card admin-form">
            <h2>Store settings</h2>
            <label className="admin-field">
              <span>Free delivery above (₹)</span>
              <input
                name="freeDeliveryMin"
                type="number"
                defaultValue={settings?.freeDeliveryMin != null ? settings.freeDeliveryMin / 100 : ""}
              />
            </label>
            <label className="admin-check">
              <input name="codEnabled" type="checkbox" defaultChecked={settings?.codEnabled !== false} />
              Offer cash on delivery
            </label>
            <div>
              <button className="admin-btn admin-btn-primary" type="submit">
                Save settings
              </button>
            </div>
          </form>
        </div>
        <form action={saveDeliveryArea} className="admin-card admin-form">
          <h2>Add delivery area</h2>
          <label className="admin-field">
            <span>Area name</span>
            <input name="name" required />
          </label>
          <label className="admin-field">
            <span>Pincodes</span>
            <textarea name="pincodes" rows={4} />
            <small>Comma or newline separated</small>
          </label>
          <label className="admin-field">
            <span>Charge (₹)</span>
            <input name="charge" type="number" />
          </label>
          <div>
            <button className="admin-btn admin-btn-primary" type="submit">
              Save area
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
