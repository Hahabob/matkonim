import mongoose, { Document, Query, Schema, Types, model } from "mongoose";

interface IRecepie extends Document {
  _id: Types.ObjectId;
  title: string;
  content: string;
  createdBy: Types.ObjectId;
  CreatedAt: Date;
  updatedAt: Date;
}

const bookSchema = new Schema<IBook>(
  {
    title: {
      type: String,
      require: true,
      unique: true,
    },
    publishedYear: Number,
    genre: [String],
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

bookSchema.virtual("reviews", {
  ref: "Review",
  localField: "_id",
  foreignField: "book",
});

export type BookDocument = Document & IBook;
const Book = model<IBook>("Book", bookSchema);

export default Book;
