// src/models/session.model.ts
import { Schema, model, models, Types, Document, Model } from "mongoose";
import { type SessionContent, type ISession } from "@/types";
import { ACTIVITIES, BEHAVIORS } from "@/constants";

// ─── Interface ────────────────────────────────────────────────────────────────

export interface ISessionDocument extends ISession, Document {}

// ─── Content Sub-schema ───────────────────────────────────────────────────────

const contentSchema = new Schema<SessionContent>(
  {
    title: { type: String, maxlength: 200, trim: true },
    book: { type: String, maxlength: 200, trim: true },
    fromSurah: { type: String, trim: true },
    fromAyah: { type: Number, min: 1 },
    toSurah: { type: String, trim: true },
    toAyah: { type: Number, min: 1 },
  },
  { _id: false },
);

// ─── Main Schema ──────────────────────────────────────────────────────────────

const sessionSchema = new Schema<ISessionDocument>(
  {
    mosqueId: {
      type: Types.ObjectId,
      ref: "Mosque",
      required: true,
      index: true,
    },
    groupId: {
      type: Types.ObjectId,
      ref: "Group",
      required: true,
    },
    activity: {
      type: String,
      enum: ACTIVITIES.values,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    teacherId: {
      type: Types.ObjectId,
      ref: "Teacher",
      required: true,
    },
    recordedBy: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    attendedStudentIds: [
      {
        type: Types.ObjectId,
        ref: "Student",
      },
    ],
    content: {
      type: contentSchema,
      default: {},
    },
    behaviorTags: [{ type: String, enum: BEHAVIORS.values }],
    notes: { type: String, maxlength: 1000 },
  },
  { timestamps: true },
);

// ─── Indexes ──────────────────────────────────────────────────────────────────

/** Dashboard queries: "all sessions for this mosque this month" */
sessionSchema.index({ mosqueId: 1, date: -1 });

/** Activity filter: "all quran sessions this month" */
sessionSchema.index({ mosqueId: 1, activity: 1, date: -1 });

/** Teacher history: "all sessions taught by teacher X" */
sessionSchema.index({ teacherId: 1, date: -1 });

/**
 * Student attendance lookup: "all sessions where student X attended"
 * Used on the student profile page.
 * MongoDB supports querying array fields with a standard index.
 */
sessionSchema.index({ attendedStudentIds: 1 });

// ─── Model ────────────────────────────────────────────────────────────────────

const Session: Model<ISessionDocument> =
  models.Session ?? model<ISessionDocument>("Session", sessionSchema);

export default Session;
