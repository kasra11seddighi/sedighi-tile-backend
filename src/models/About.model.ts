import { Schema, model, Document } from "mongoose";

interface IAboutHero {
  badge?: string;
  titleBefore?: string;
  titleHighlight?: string;
  titleAfter?: string;
  description?: string;
}

interface IAboutStat {
  icon?: string;
  value: string;
  label: string;
}

interface IAboutStory {
  badge?: string;
  title?: string;
  paragraph1?: string;
  paragraph2?: string;
  image?: string;
  experienceValue?: string;
  experienceLabel?: string;
}

interface IAboutValueItem {
  icon?: string;
  title: string;
  description: string;
}

interface IAboutValues {
  badge?: string;
  title?: string;
  items: IAboutValueItem[];
}

interface IAboutCTA {
  title?: string;
  description?: string;
}

export interface IAbout extends Document {
  hero: IAboutHero;
  stats: IAboutStat[];
  story: IAboutStory;
  values: IAboutValues;
  cta: IAboutCTA;
  createdAt: Date;
  updatedAt: Date;
}

const heroSchema = new Schema<IAboutHero>(
  {
    badge: String,
    titleBefore: String,
    titleHighlight: String,
    titleAfter: String,
    description: String,
  },
  { _id: false },
);

const statSchema = new Schema<IAboutStat>(
  {
    icon: String,
    value: { type: String, required: true },
    label: { type: String, required: true },
  },
  { _id: false },
);

const storySchema = new Schema<IAboutStory>(
  {
    badge: String,
    title: String,
    paragraph1: String,
    paragraph2: String,
    image: String,
    experienceValue: String,
    experienceLabel: String,
  },
  { _id: false },
);

const valueItemSchema = new Schema<IAboutValueItem>(
  {
    icon: String,
    title: { type: String, required: true },
    description: { type: String, required: true },
  },
  { _id: false },
);

const valuesSchema = new Schema<IAboutValues>(
  {
    badge: String,
    title: String,
    items: [valueItemSchema],
  },
  { _id: false },
);

const ctaSchema = new Schema<IAboutCTA>(
  {
    title: String,
    description: String,
  },
  { _id: false },
);

const aboutSchema = new Schema<IAbout>(
  {
    hero: heroSchema,
    stats: [statSchema],
    story: storySchema,
    values: valuesSchema,
    cta: ctaSchema,
  },
  { timestamps: true },
);

export const About = model<IAbout>("About", aboutSchema);
