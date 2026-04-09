import { SheikhsClient } from "@/components/sheikhs/SheikhsClient";
import { getSheikhsList } from "@/lib/services/sheikh.service";

export const metadata = { title: "إدارة المشايخ" };

export default async function SheikhsPage() {
  const sheikhs = await getSheikhsList();

  return <SheikhsClient sheikhs={sheikhs} />;
}
