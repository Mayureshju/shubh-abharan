import { redirect } from "next/navigation";
import { connectDb } from "@/lib/db/connect";
import { SettingsModel } from "@/lib/db/models";

export default async function AdminSettings() {
  await connectDb();
  await SettingsModel.findOne({ key: "store" }).lean();
  redirect("/admin/delivery");
}
