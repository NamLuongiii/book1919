import { CATEGORIES } from "@/lib/constant";

export interface Source {
  id?: string;
  image_200x300: string;
  image_60x90: string;
  name: string;
  source: string;
  position: CATEGORIES;
  createdAt: any;
}
