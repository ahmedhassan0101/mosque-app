import * as XLSX from "xlsx";

const HEADERS = [
  "الاسم *",
  "الجنس * (male/female)",
  "تاريخ الميلاد (YYYY-MM-DD)",
  "المستوى * (beginner/intermediate/advanced)",
  "تليفون الطالب",
  "اسم ولي الأمر",
  "تليفون ولي الأمر *",
  "تليفون ولي الأمر 2",
  "العنوان",
  "الأنشطة * (quran,tarbiya,tajweed,maqraa,playground)",
  "متابعة العبادات (true/false)",
  "السورة الحالية",
  "رقم الآية",
  "ملاحظات",
];

const SAMPLE_ROW = [
  "أحمد محمد علي",
  "male",
  "2012-05-15",
  "beginner",
  "01012345678",
  "محمد علي",
  "01098765432",
  "",
  "القاهرة",
  "quran,tarbiya",
  "false",
  "الفاتحة",
  "1",
  "",
];

export function generateImportTemplate(): Buffer {
  // Creates a new workbook: XLSX.WorkBook
  const wb = XLSX.utils.book_new();

  // Data sheet
  // first row is headers, second row is sample data to show format and allowed values (except for activities which can be any of the allowed values in any combination)
  // XLSX.WorkSheet: Converts an array of arrays of JS data to a worksheet.
  const ws = XLSX.utils.aoa_to_sheet([HEADERS, SAMPLE_ROW]);

  // Column widths
  ws["!cols"] = HEADERS.map(() => ({ wch: 28 }));

  // Append a worksheet to a workbook
  XLSX.utils.book_append_sheet(wb, ws, "الطلاب");

  // Reference sheet — allowed values
  const refWs = XLSX.utils.aoa_to_sheet([
    ["الحقل", "القيم المسموحة"],
    ["الجنس", "male | female"],
    ["المستوى", "beginner | intermediate | advanced"],
    [
      "الأنشطة",
      "quran | tarbiya | tajweed | maqraa | playground (مفصولة بفاصلة)",
    ],
    ["متابعة العبادات", "true | false"],
  ]);
  // Column widths
  refWs["!cols"] = [{ wch: 20 }, { wch: 60 }];
  // Append second worksheet to a workbook
  XLSX.utils.book_append_sheet(wb, refWs, "القيم المرجعية");

  // Writes a workbook object to a buffer
  return Buffer.from(XLSX.write(wb, { type: "buffer", bookType: "xlsx" }));
}
