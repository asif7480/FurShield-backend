import mongoose from 'mongoose';

const careArticleSchema = new mongoose.Schema({
  title: String,
  category: { type: String, enum: ["feeding", "hygiene", "exercise", "general"] },
  content: String,
}, { timestamps: true });

export default mongoose.model("CareArticle", careArticleSchema);
