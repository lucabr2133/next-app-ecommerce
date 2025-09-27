export interface GameDetail {
  id: number;
  slug: string;
  name: string;
  name_original: string;
  description: string;
  description_raw: string;
  released: string | null;
  updated: string;
  background_image: string | null;
  website: string;
  rating: number;
  rating_top: number;
  ratings: Rating[];
  platforms: PlatformInfo[];
  stores: StoreInfo[];
  developers: Developer[];
  publishers: Publisher[];
  genres: Genre[];
  tags: Tag[];
  esrb_rating: EsrbRating | null;
}

export interface Rating {
  id: number;
  title: string;
  count: number;
  percent: number;
}

export interface PlatformInfo {
  platform: {
    id: number;
    name: string;
    slug: string;
  };
  released_at: string | null;
  requirements?: {
    minimum?: string;
    recommended?: string;
  };
}

export interface StoreInfo {
  id: number;
  url: string;
  store: {
    id: number;
    name: string;
    slug: string;
    domain: string;
  };
}

export interface Developer {
  id: number;
  name: string;
  slug: string;
}

export interface Publisher {
  id: number;
  name: string;
  slug: string;
}

export interface Genre {
  id: number;
  name: string;
  slug: string;
}

export interface Tag {
  id: number;
  name: string;
  slug: string;
  language: string;
}

export interface EsrbRating {
  id: number;
  name: string;
  slug: string;
}
