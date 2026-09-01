import { Schema, model, Document } from "mongoose";

interface IHeroSlide {
  image: string;
  alt: string;
}

interface IButton {
  text: string;
  link: string;
}

interface IHero {
  badge?: string;
  title?: string;
  highlightTitle?: string;
  description?: string;
  primaryButton?: IButton;
  secondaryButton?: IButton;
  slides: IHeroSlide[];
}

export interface IHome extends Document {
  hero: IHero;
  createdAt: Date;
  updatedAt: Date;
}

const heroSlideSchema = new Schema<IHeroSlide>(
  {
    image: { type: String, required: true },
    alt: { type: String, default: "" },
  },
  { _id: false },
);

const buttonSchema = new Schema<IButton>(
  {
    text: { type: String, required: true },
    link: { type: String, required: true },
  },
  { _id: false },
);

const heroSchema = new Schema<IHero>(
  {
    badge: String,
    title: String,
    highlightTitle: String,
    description: String,
    primaryButton: buttonSchema,
    secondaryButton: buttonSchema,
    slides: [heroSlideSchema],
  },
  { _id: false },
);

const homeSchema = new Schema<IHome>(
  {
    hero: heroSchema,
  },
  { timestamps: true },
);

export const Home = model<IHome>("Home", homeSchema);
