import { CheckCircle, AlertCircle } from "lucide-react";

interface ImportError {
  row: number;
  errors: string[];
}

interface Props {
  inserted: number;
  failed: number;
  errors: ImportError[];
}

/**
 * Renders the success summary and a detailed list of validation errors.
 */
export function ImportResults({ inserted, failed, errors }: Props) {
  return (
    <div className="rounded-xl border overflow-hidden bg-white shadow-sm">
      {/* Summary Cards */}
      <div className="p-4 grid grid-cols-2 gap-3">
        <div className="flex items-center gap-3 p-4 rounded-lg bg-green-50 border border-green-200">
          <CheckCircle className="text-green-600" size={24} />
          <div>
            <p className="text-xs text-green-700 font-medium">
              تم الاستيراد بنجاح
            </p>
            <p className="text-2xl font-bold text-green-800">{inserted}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-4 rounded-lg bg-red-50 border border-red-200">
          <AlertCircle className="text-red-600" size={24} />
          <div>
            <p className="text-xs text-red-700 font-medium">صفوف بها أخطاء</p>
            <p className="text-2xl font-bold text-red-800">{failed}</p>
          </div>
        </div>
      </div>

      {/* Detailed Error List */}
      {errors.length > 0 && (
        <div className="border-t">
          <div className="bg-muted/30 px-4 py-2">
            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              {/* Error Details (By Row) */}
              تفاصيل الأخطاء (حسب الصف في ملف الاكسل)
            </h4>
          </div>
          <div className="max-h-60 overflow-y-auto divide-y">
            {errors.map((e) => (
              <div
                key={e.row}
                className="px-4 py-3 hover:bg-slate-50 transition-colors"
              >
                <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-700 mb-1">
                  السطر {e.row}
                </span>
                <ul className="space-y-1">
                  {e.errors.map((msg, i) => (
                    <li
                      key={i}
                      className="text-sm text-slate-600 flex items-center gap-2"
                    >
                      <span className="w-1 h-1 rounded-full bg-red-400 shrink-0" />
                      {msg}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
