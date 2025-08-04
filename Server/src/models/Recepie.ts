import mongoose, { Document, Schema, Types, model } from "mongoose";

interface Ingredient {
  name: string;
  quantity: string;
}

const ingredientSchema = new Schema<Ingredient>({
  name: { type: String, required: true },
  quantity: { type: String, required: true },
});

interface IRecepie extends Document {
  _id: Types.ObjectId;
  title: string;
  content: string;
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  likes: Types.ObjectId[];
  ingredients: Ingredient[];
  steps: string[];
  prepTime?: number;
  cookTime?: number;
  difficulty?: "easy" | "medium" | "hard";
}

const recepieSchema = new Schema<IRecepie>(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    content: {
      type: String,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: [],
      },
    ],
    ingredients: [ingredientSchema],
    steps: [
      {
        type: String,
        required: true,
      },
    ],
    prepTime: {
      type: Number,
    },
    cookTime: {
      type: Number,
    },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "medium",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

export type RecepieDocument = Document & IRecepie;
const Recepie = model<IRecepie>("Recepie", recepieSchema);

export default Recepie;
