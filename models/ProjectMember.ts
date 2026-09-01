import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProjectMember extends Document {
  projectId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  role: "OWNER" | "ADMIN" | "MEMBER";
}

const projectMemberSchema = new Schema<IProjectMember>(
  {
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },

    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    role: {
      type: String,
      enum: ["OWNER", "ADMIN", "MEMBER"],
      default: "MEMBER",
    },
  },
  {
    timestamps: true,
  }
);

projectMemberSchema.index(
  { projectId: 1, userId: 1 },
  { unique: true }
);

const ProjectMember: Model<IProjectMember> =
  mongoose.models.ProjectMember ||
  mongoose.model<IProjectMember>(
    "ProjectMember",
    projectMemberSchema
  );

export default ProjectMember;