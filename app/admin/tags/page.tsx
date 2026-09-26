import Link from "next/link";
import { connectDb } from "@/lib/db/connect";
import { ProductModel, TagModel } from "@/lib/db/models";
import { saveTag } from "@/lib/actions/admin-catalog";
import { StatusPill } from "@/components/admin/StatusPill";

export default async function AdminTags({
  searchParams,
}: {
  searchParams: Promise<{ slug?: string }>;
}) {
  await connectDb();
  const { slug } = await searchParams;
  const [tags, counts] = await Promise.all([
    TagModel.find().sort({ name: 1 }).lean(),
    ProductModel.aggregate<{ _id: string; count: number }>([
      { $unwind: "$tags" },
      { $group: { _id: "$tags", count: { $sum: 1 } } },
    ]),
  ]);
  const countBySlug = new Map(counts.map((row) => [row._id, row.count]));
  const current = tags.find((entry) => entry.slug === slug);

  return (
    <>
      <header className="admin-head">
        <h1>Tags</h1>
        {current && (
          <Link href="/admin/tags" className="admin-btn">
            New tag
          </Link>
        )}
      </header>
      <div className="admin-split">
        <div className="admin-table-wrap">
          <table>
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Slug</th>
                <th scope="col">Status</th>
                <th scope="col" className="num">Products</th>
              </tr>
            </thead>
            <tbody>
              {tags.length === 0 ? (
                <tr>
                  <td colSpan={4} className="admin-empty">No tags yet.</td>
                </tr>
              ) : (
                tags.map((tag) => (
                  <tr key={tag.slug}>
                    <td>
                      <Link
                        href={`/admin/tags?slug=${tag.slug}`}
                        className="admin-link"
                        aria-current={tag.slug === slug ? "true" : undefined}
                      >
                        {tag.name}
                      </Link>
                    </td>
                    <td className="admin-muted">{tag.slug}</td>
                    <td>
                      <StatusPill
                        status={tag.isActive === false ? "hidden" : "active"}
                        label={tag.isActive === false ? "Hidden" : "Active"}
                      />
                    </td>
                    <td className="num">{countBySlug.get(tag.slug) ?? 0}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <form action={saveTag} className="admin-card admin-form" key={current?.slug ?? "new"}>
          <h2>{current ? `Edit ${current.name}` : "New tag"}</h2>
          <input type="hidden" name="existingSlug" value={current?.slug ?? ""} />
          <div className="admin-form-row">
            <label className="admin-field">
              <span>Name</span>
              <input name="name" required defaultValue={current?.name ?? ""} />
            </label>
            <label className="admin-field">
              <span>Slug</span>
              <input name="slug" defaultValue={current?.slug ?? ""} pattern="[a-z0-9-]*" />
              <small>Leave empty to generate from the name</small>
            </label>
          </div>
          <label className="admin-field">
            <span>SEO title</span>
            <input name="seoTitle" defaultValue={current?.seoTitle ?? ""} maxLength={70} />
            <small>Used on /shop?tag={current?.slug ?? "…"}. Keep it under 60 characters.</small>
          </label>
          <label className="admin-field">
            <span>SEO description</span>
            <textarea name="seoDescription" rows={3} defaultValue={current?.seoDescription ?? ""} maxLength={200} />
            <small>Keep it under 160 characters.</small>
          </label>
          <label className="admin-check">
            <input name="isActive" type="checkbox" defaultChecked={current ? current.isActive !== false : true} />
            Active (shown in shop filters)
          </label>
          <div>
            <button className="admin-btn admin-btn-primary" type="submit">
              Save tag
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
