import mongoose, { Schema, Document, Model } from "mongoose";
import { ISession } from "@/types/index";

export interface ISessionDocument extends Omit<ISession, "_id">, Document {}

const SessionSchema = new Schema<ISessionDocument>(
  {
    mosqueId: {
      type: Schema.Types.ObjectId,
      ref: "Mosque",
      required: true,
      index: true,
    },
    activity: {
      type: String,
      enum: ["quran", "tarbiya", "tajweed", "maqraa", "playground"],
      required: true,
    },
    date: { type: Date, required: true, index: true },
    attendingSheikhIds: [{ type: Schema.Types.ObjectId, ref: "Sheikh" }],
    recordedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    presentStudentIds: [{ type: Schema.Types.ObjectId, ref: "Student" }],
    quranFrom: { surah: String, ayah: Number },
    quranTo: { surah: String, ayah: Number },
    lesson: { type: String },
    lessonBook: { type: String },
    explainingSheikh: { type: Schema.Types.ObjectId, ref: "Sheikh" },
    participatingStudents: [{ type: Schema.Types.ObjectId, ref: "Student" }],
    tajweedLesson: { type: String },
    playgroundTime: { type: String },
    speechTopic: { type: String },
    playgroundIssues: [{ type: String }],
    mvpStudents: [{ type: Schema.Types.ObjectId, ref: "Student" }],
    positives: { type: String },
    negatives: { type: String },
    notes: { type: String },
    photos: [{ type: String }],
  },
  { timestamps: true },
);

SessionSchema.index({ mosqueId: 1, activity: 1, date: -1 });

const Session: Model<ISessionDocument> =
  mongoose.models.Session ??
  mongoose.model<ISessionDocument>("Session", SessionSchema);

export default Session;
