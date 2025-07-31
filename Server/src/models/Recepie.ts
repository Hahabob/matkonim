import mongoose, { Document, Query, Schema, Types, model } from "mongoose";

interface IRecepie extends Document {
  _id: Types.ObjectId;
  title: string;
  content: string;
  createdBy: Types.ObjectId;
  CreatedAt: Date;
  updatedAt: Date;
}

const recepieSchema = new Schema<IRecepie>(
  {
    title: {
      type: String,
      require: true,
      unique: true,
    },
    content: {
      type: String,
      require: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

export type RecepieDocument = Document & IRecepie;
const Recepie = model<IRecepie>("Book", recepieSchema);

export default Recepie;
