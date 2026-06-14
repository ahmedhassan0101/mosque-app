import { SheikhsClient } from "@/temp/sheikhs/SheikhsClient";
import { getSheikhsList } from "@/temp/services/sheikh.service";

export const metadata = { title: "إدارة المشايخ" };

export default async function SheikhsPage() {
  const sheikhs = await getSheikhsList();

  return <SheikhsClient sheikhs={sheikhs} />;
}
