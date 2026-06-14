import { ACTIVITIES } from "@/constants";
import { getSessionsList } from "@/queries/session.queries";

export default async function Page() {
  const sessions = await getSessionsList();
  if (!sessions) return null;

  return (
    <div dir="ltr">
      <pre dir="ltr">
        <code>{JSON.stringify(sessions, null, 2)}</code>
      </pre>
    </div>
  );
}
