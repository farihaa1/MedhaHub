import { Schema, model } from "mongoose";
import { ISubject } from "./subject.interface";
import { SubjectSlug } from "./subject.constrain";

const subjectSchema = new Schema<ISubject>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      enum: Object.values(SubjectSlug),
    },

    url: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

export const Subject = model<ISubject>("Subject", subjectSchema);
