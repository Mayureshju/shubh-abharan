import Link from "next/link";
import { connectDb } from "@/lib/db/connect";
import { DeliveryCityModel, PincodeModel } from "@/lib/db/models";
import { setPincodesActive } from "@/lib/actions/admin-ops";
import { StatusPill } from "@/components/admin/StatusPill";

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export default async function AdminPincodes({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; state?: string; city?: string; status?: string }>;
}) {
  await connectDb();
  const { q = "", state = "", city = "", status = "" } = await searchParams;

  const filter: Record<string, unknown> = {};
  if (state) filter.state = state;
  if (city) filter.city = city;
  if (status === "on" || status === "off") filter.isActive = status === "on";
  const term = q.trim();
  if (/^\d+$/.test(term)) filter.pincode = new RegExp(`^${term}`);
  else if (term) filter.city = new RegExp(escapeRegex(term), "i");

  const [states, total, pincodes, citiesOff] = await Promise.all([
    DeliveryCityModel.distinct("state"),
    PincodeModel.countDocuments(filter),
    PincodeModel.find(filter).sort({ pincode: 1 }).limit(100).lean(),
    DeliveryCityModel.find({ isActive: false }, { state: 1, name: 1 }).lean(),
  ]);
  const cityOff = new Set(citiesOff.map((entry) => `${entry.state}|${entry.name}`));
  const filtered = Boolean(q || state || city || status);

  return (
    <>
      <header className="admin-head">
        <div>
          <h1>Pincodes</h1>
          <p className="admin-sub">
            {pincodes.length < total
              ? `Showing ${pincodes.length} of ${total.toLocaleString("en-IN")}. Narrow the search to see more.`
              : `${total.toLocaleString("en-IN")} pincodes`}
            {city && ` in ${city}`}
          </p>
        </div>
        <Link href="/admin/delivery" className="admin-btn">
          Cities
        </Link>
      </header>
      <form method="get" className="admin-card admin-filters" role="search">
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder="Search by pincode or city"
          aria-label="Search pincodes"
        />
        <select name="state" defaultValue={state} aria-label="State">
          <option value="">All states</option>
          {states.sort().map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
        <select name="status" defaultValue={status} aria-label="Status">
          <option value="">Any status</option>
          <option value="on">Delivering</option>
          <option value="off">Switched off</option>
        </select>
        {city && <input type="hidden" name="city" value={city} />}
        <button type="submit" className="admin-btn admin-btn-primary">
          Filter
        </button>
        {filtered && (
          <Link href="/admin/delivery/pincodes" className="admin-link">
            Clear
          </Link>
        )}
      </form>
      <div className="admin-table-wrap">
        <table>
          <thead>
            <tr>
              <th scope="col">Pincode</th>
              <th scope="col">City</th>
              <th scope="col">State</th>
              <th scope="col">Status</th>
              <th scope="col">
                <span className="sr-only">Action</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {pincodes.length === 0 ? (
              <tr>
                <td colSpan={5} className="admin-empty">
                  {filtered ? "No pincodes match." : "No pincodes imported yet. Run npm run import:pincodes."}
                </td>
              </tr>
            ) : (
              pincodes.map((entry) => {
                const blockedByCity = cityOff.has(`${entry.state}|${entry.city}`);
                return (
                  <tr key={entry.pincode}>
                    <td>{entry.pincode}</td>
                    <td>{entry.city}</td>
                    <td className="admin-muted">{entry.state}</td>
                    <td>
                      {!entry.isActive ? (
                        <StatusPill status="cancelled" label="Off" />
                      ) : blockedByCity ? (
                        <StatusPill status="pending_payment" label="City off" />
                      ) : (
                        <StatusPill status="active" label="Delivering" />
                      )}
                    </td>
                    <td>
                      <form action={setPincodesActive}>
                        <input type="hidden" name="pincodes" value={entry.pincode} />
                        <input type="hidden" name="active" value={entry.isActive ? "false" : "true"} />
                        <button
                          type="submit"
                          className="admin-btn admin-btn-sm"
                          aria-label={
                            entry.isActive ? `Stop delivering to ${entry.pincode}` : `Deliver to ${entry.pincode}`
                          }
                        >
                          {entry.isActive ? "Switch off" : "Switch on"}
                        </button>
                      </form>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      <form action={setPincodesActive} className="admin-card admin-form">
        <h2>Switch pincodes in bulk</h2>
        <label className="admin-field">
          <span>Pincodes</span>
          <textarea name="pincodes" rows={4} />
          <small>Paste six-digit pincodes separated by commas, spaces, or new lines</small>
        </label>
        <div className="admin-actions">
          <button className="admin-btn admin-btn-primary" type="submit" name="active" value="true">
            Deliver to these
          </button>
          <button className="admin-btn" type="submit" name="active" value="false">
            Stop delivering
          </button>
        </div>
      </form>
    </>
  );
}
