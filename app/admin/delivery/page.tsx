import Link from "next/link";
import { isValidObjectId } from "mongoose";
import { connectDb } from "@/lib/db/connect";
import { DeliveryCityModel, PincodeModel, SettingsModel } from "@/lib/db/models";
import { saveDeliveryCity, saveSettings } from "@/lib/actions/admin-ops";
import { formatMoney } from "@/lib/catalog/money";
import { StatusPill } from "@/components/admin/StatusPill";

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function rupees(paise: number) {
  return formatMoney({ amount: paise, currency: "INR" });
}

export default async function AdminDelivery({
  searchParams,
}: {
  searchParams: Promise<{ state?: string; q?: string; city?: string }>;
}) {
  await connectDb();
  const { state = "", q = "", city = "" } = await searchParams;

  const filter: Record<string, unknown> = {};
  if (state) filter.state = state;
  if (q.trim()) filter.name = new RegExp(escapeRegex(q.trim()), "i");

  const [states, cities, coverage, current, settings] = await Promise.all([
    DeliveryCityModel.distinct("state"),
    // A state has at most ~75 cities; across India, show the first 100.
    DeliveryCityModel.find(filter).sort({ state: 1, name: 1 }).limit(state ? 0 : 100).lean(),
    PincodeModel.aggregate<{ _id: { state: string; city: string }; total: number; active: number }>([
      { $match: state ? { state } : {} },
      {
        $group: {
          _id: { state: "$state", city: "$city" },
          total: { $sum: 1 },
          active: { $sum: { $cond: ["$isActive", 1, 0] } },
        },
      },
    ]),
    isValidObjectId(city) ? DeliveryCityModel.findById(city).lean() : null,
    SettingsModel.findOne({ key: "store" }).lean(),
  ]);
  const coverageBy = new Map(coverage.map((row) => [`${row._id.state}|${row._id.city}`, row]));
  const defaultCharge = settings?.defaultDeliveryCharge ?? 0;
  const keep = new URLSearchParams({ ...(state && { state }), ...(q && { q }) });

  return (
    <>
      <header className="admin-head">
        <div>
          <h1>Delivery</h1>
          <p className="admin-sub">Charges per city. A pincode is served when it and its city are switched on.</p>
        </div>
        <Link href="/admin/delivery/pincodes" className="admin-btn">
          Pincodes
        </Link>
      </header>
      <form method="get" className="admin-card admin-filters" role="search">
        <select name="state" defaultValue={state} aria-label="State">
          <option value="">All states</option>
          {states.sort().map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
        <input type="search" name="q" defaultValue={q} placeholder="Search city" aria-label="Search city" />
        <button type="submit" className="admin-btn admin-btn-primary">
          Filter
        </button>
        {(state || q) && (
          <Link href="/admin/delivery" className="admin-link">
            Clear
          </Link>
        )}
      </form>
      <div className="admin-split">
        <div className="admin-table-wrap">
          <table>
            <thead>
              <tr>
                <th scope="col">City</th>
                <th scope="col">State</th>
                <th scope="col" className="num">Pincodes on</th>
                <th scope="col" className="num">Charge</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              {cities.length === 0 ? (
                <tr>
                  <td colSpan={5} className="admin-empty">
                    {states.length === 0 ? (
                      <>
                        No pincodes imported yet. Run <code>npm run import:pincodes</code>.
                      </>
                    ) : (
                      "No cities match."
                    )}
                  </td>
                </tr>
              ) : (
                cities.map((entry) => {
                  const id = String(entry._id);
                  const counts = coverageBy.get(`${entry.state}|${entry.name}`);
                  const params = new URLSearchParams(keep);
                  params.set("city", id);
                  return (
                    <tr key={id}>
                      <td>
                        <Link
                          href={`/admin/delivery?${params}`}
                          className="admin-link"
                          aria-current={id === city ? "true" : undefined}
                        >
                          {entry.name}
                        </Link>
                      </td>
                      <td className="admin-muted">{entry.state}</td>
                      <td className="num">
                        <Link
                          href={`/admin/delivery/pincodes?${new URLSearchParams({ state: entry.state, city: entry.name })}`}
                          className="admin-link"
                        >
                          {counts ? `${counts.active} / ${counts.total}` : "0"}
                        </Link>
                      </td>
                      <td className="num">
                        {entry.charge != null ? rupees(entry.charge) : <span className="admin-muted">Default</span>}
                      </td>
                      <td>
                        <StatusPill
                          status={entry.isActive ? "active" : "cancelled"}
                          label={entry.isActive ? "Delivering" : "Off"}
                        />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        <div>
          {current && (
            <form action={saveDeliveryCity} className="admin-card admin-form" key={String(current._id)}>
              <h2>
                {current.name}, {current.state}
              </h2>
              <input type="hidden" name="id" value={String(current._id)} />
              <label className="admin-field">
                <span>Charge (₹)</span>
                <input
                  name="charge"
                  type="number"
                  min="0"
                  step="1"
                  defaultValue={current.charge != null ? current.charge / 100 : ""}
                />
                <small>Leave empty to use the default ({rupees(defaultCharge)})</small>
              </label>
              <label className="admin-check">
                <input name="isActive" type="checkbox" defaultChecked={current.isActive !== false} />
                Deliver to this city
              </label>
              <div>
                <button className="admin-btn admin-btn-primary" type="submit">
                  Save city
                </button>
              </div>
            </form>
          )}
          <form action={saveSettings} className="admin-card admin-form">
            <h2>Store settings</h2>
            <label className="admin-field">
              <span>Default delivery charge (₹)</span>
              <input name="defaultDeliveryCharge" type="number" min="0" step="1" defaultValue={defaultCharge / 100} />
              <small>Used by every city without its own charge</small>
            </label>
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
      </div>
    </>
  );
}
