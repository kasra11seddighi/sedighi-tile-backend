import { Schema, model, Document } from "mongoose";

export interface IContactMessage extends Document {
  name: string;
  email?: string;
  phone?: string;
  subject?: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const contactMessageSchema = new Schema<IContactMessage>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, trim: true },
    phone: { type: String, trim: true },
    subject: { type: String, trim: true },
    message: { type: String, required: true, trim: true },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const ContactMessage = model<IContactMessage>(
  "ContactMessage",
  contactMessageSchema,
);
