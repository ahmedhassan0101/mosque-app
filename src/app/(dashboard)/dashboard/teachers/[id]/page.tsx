import { getTeacherById } from "@/lib/data/teacher.data";

export const metadata = { title: "تفاصيل المعلم" };

//  const dynamic = "force-dynamic"; // this page needs to be dynamic to fetch the teacher's data
// export const revalidate = 0; // disable caching for this page to always show the latest data
// export const fetchCache = "force-no-store"; // another way to disable caching for data fetching in this page
//  انا مش متأكد أي طريقة أفضل، ممكن تجربهم وتشوف أي وحدة تشتغل بشكل أفضل مع بيانات المعلمين في تطبيقك.
// كل اللي فوق دامن اقتراحات  الفى اس كود .. انا مش فاهم فيهم كتير، بس المهم إنك تضمن إن بيانات المعلم بتتحدث بشكل فوري لما يتم تعديلها في قاعدة البيانات.

type TeacherProfileProps = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: TeacherProfileProps) {
  const { id } = await params;
  const teacher = await getTeacherById(id);
  return { title: teacher?.name ?? "المعلم" };
}
export default async function TeacherProfilePage({
  params,
}: TeacherProfileProps) {
  const { id } = await params;
  console.log("🚀 ~ TeacherProfilePage ~ id:", id);

  return <div>TeacherProfilePage: this is teacher {id} </div>;
}
