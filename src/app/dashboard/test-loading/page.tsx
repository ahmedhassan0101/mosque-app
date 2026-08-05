export default async function TestLoadingPage() {
  await new Promise((resolve) => setTimeout(resolve, 3000));
  return <div>تم التحميل بنجاح!</div>;
}