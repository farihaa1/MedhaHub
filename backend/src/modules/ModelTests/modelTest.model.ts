import { Schema, model, HydratedDocument } from "mongoose";
import { IModelTest } from "./modelTest.interface";
import { ModelTestStatus, ModelTestVisibility } from "./modelTest.constant";
import { generateSlug } from "./modelTest.utils";

const modelTestSchema = new Schema<IModelTest>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },

    slug: {
      type: String,
      unique: true,
      index: true,
    },

    description: String,

    questions: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "Question",
        },
      ],
      required: true,
      validate: {
        validator: (value: Schema.Types.ObjectId[]) => value.length > 0,
        message: "At least one question is required.",
      },
    },

    settings: {
      duration: {
        type: Number,
        required: true,
        min: 1,
      },

      negativeMark: {
        type: Number,
        default: 0,
      },

      shuffleQuestions: {
        type: Boolean,
        default: false,
      },

      shuffleOptions: {
        type: Boolean,
        default: false,
      },
    },

    schedule: {
      startDate: Date,
      endDate: Date,
    },

    visibility: {
      type: String,
      enum: Object.values(ModelTestVisibility),
      default: ModelTestVisibility.PUBLIC,
    },

    isPremium: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      enum: Object.values(ModelTestStatus),
      default: ModelTestStatus.DRAFT,
    },

    tags: [String],

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

modelTestSchema.index({ status: 1 });
modelTestSchema.index({ visibility: 1 });
modelTestSchema.index({ isPremium: 1 });

modelTestSchema.pre("validate", function (this: HydratedDocument<IModelTest>) {
  if (!this.slug && this.title) {
    this.slug = generateSlug(this.title);
  }
});

export const ModelTest = model<IModelTest>("ModelTest", modelTestSchema);
