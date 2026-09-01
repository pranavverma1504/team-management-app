import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProject extends Document {
  name: string;
  description: string;
  coverImage?: string;
  ownerId: mongoose.Types.ObjectId;
}

const projectSchema = new Schema<IProject>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    coverImage: {
      type: String,
      default: "",
    },

    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Project: Model<IProject> =
  mongoose.models.Project ||
  mongoose.model<IProject>("Project", projectSchema);

export default Project;