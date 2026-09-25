// src/models/monthlyReport.model.ts
import {
  PROGRESS_TRENDS,
  type ProgressTrendType,
  TAJWEED_RATINGS,
  type TajweedRatingType,
} from "@/constants";
import { Schema, model, models, Types, Document, Model } from "mongoose";

export interface IMonthlyReport {
  studentId: Types.ObjectId;
  mosqueId: Types.ObjectId;
  month: string; // Format: "YYYY-MM"
  progressTrend: ProgressTrendType; // 'up', 'stable', 'down'
  surahFrom: string;
  ayahFrom: number;
  surahTo: string;
  ayahTo: number;
  tajweed: TajweedRatingType; // 'excellent', 'very_good', 'good', 'needs_practice'
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IMonthlyReportDocument extends IMonthlyReport, Document {}

const monthlyReportSchema = new Schema<IMonthlyReportDocument>(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: "Student",
      required: true,
      index: true,
    },
    mosqueId: {
      type: Schema.Types.ObjectId,
      ref: "Mosque",
      required: true,
      index: true,
    },
    month: { type: String, required: true },
    progressTrend: {
      type: String,
      enum: PROGRESS_TRENDS.values, // ['up', 'stable', 'down']
      required: true,
    },
    surahFrom: { type: String, required: true, trim: true },
    ayahFrom: { type: Number, required: true },
    surahTo: { type: String, required: true, trim: true },
    ayahTo: { type: Number, required: true },
    tajweed: {
      type: String,
      enum: TAJWEED_RATINGS.values, // ['excellent', 'very_good', 'good', 'needs_practice']
      required: true,
    },
    notes: { type: String, trim: true },
  },
  { timestamps: true },
);

// Compound Index to ensure uniqueness of monthly reports per student per month
monthlyReportSchema.index({ studentId: 1, month: 1 }, { unique: true });

const MonthlyReport: Model<IMonthlyReportDocument> =
  models.MonthlyReport ??
  model<IMonthlyReportDocument>("MonthlyReport", monthlyReportSchema);

export default MonthlyReport;
