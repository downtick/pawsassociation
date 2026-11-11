// Homepage photos: free Wikimedia Commons images, cropped to 4:3 and stripped
// of EXIF (sips -d all). CC BY / CC BY-SA require a credit line, which lives
// on /photo-credits (linked under the homepage grid and in the footer).
// Screened by eye: no faces, no business signage, animal matches its label.

export type Photo = {
  src: string;
  alt: string;
  title: string;
  author: string;
  license: string;
  licenseUrl?: string;
  source: string;
};

const BY2 = "https://creativecommons.org/licenses/by/2.0/";

export const HERO_PHOTOS: Photo[] = [
  {
    src: "/photos/hero-goat.jpg",
    alt: "Close-up of a friendly gray goat",
    title: "Goat in Brevard Zoo, Viera FL",
    author: "Rusty Clark",
    license: "CC BY 2.0",
    licenseUrl: BY2,
    source: "https://commons.wikimedia.org/wiki/File:Goat_in_Brevard_Zoo,_Viera_FL.jpg",
  },
  {
    src: "/photos/hero-alpaca.jpg",
    alt: "A young brown alpaca with a white face",
    title: "Mitzpe Ramon Little baby alpaca",
    author: "Neil Ward",
    license: "CC BY 2.0",
    licenseUrl: BY2,
    source: "https://commons.wikimedia.org/wiki/File:Mitzpe_Ramon_Little_baby_alpaca_(7704055954).jpg",
  },
  {
    src: "/photos/hero-kid.jpg",
    alt: "A baby goat resting in the grass",
    title: "Goat baby in Margarita Island",
    author: "Wilfredor",
    license: "CC0",
    source: "https://commons.wikimedia.org/wiki/File:Goat_baby_in_Margarita_Island.jpg",
  },
];

// Keyed by category slug; categories without an entry render text-only.
export const CATEGORY_PHOTOS: Record<string, Photo> = {
  "petting-zoos": {
    src: "/photos/petting-zoos.jpg",
    alt: "Young goats reaching for leaves at a petting zoo fence",
    title: "Košice ZOO 40",
    author: "Bubamara",
    license: "Public domain",
    source: "https://commons.wikimedia.org/wiki/File:Ko%C5%A1ice_ZOO_40.jpg",
  },
  "pony-rides": {
    src: "/photos/pony-rides.jpg",
    alt: "A black-and-white Shetland pony standing on grass",
    title: "Shetland pony (2)",
    author: "Ronnie Robertson",
    license: "CC BY-SA 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/2.0/",
    source: "https://commons.wikimedia.org/wiki/File:Shetland_pony_(2).jpg",
  },
  "beer-burros": {
    src: "/photos/beer-burros.jpg",
    alt: "A gray donkey looking at the camera",
    title: "Donkey (73054961)",
    author: "Francisco Gonzalez",
    license: "CC BY 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by/3.0/",
    source: "https://commons.wikimedia.org/wiki/File:Donkey_(73054961).jpeg",
  },
  "mobile-farms": {
    src: "/photos/mobile-farms.jpg",
    alt: "Three piglets nestled in straw",
    title: "Baby piglets",
    author: "Scott Bauer, U.S. Department of Agriculture",
    license: "Public domain",
    source: "https://commons.wikimedia.org/wiki/File:Baby_piglets.jpg",
  },
  "goat-yoga": {
    src: "/photos/goat-yoga.jpg",
    alt: "A young goat leaping through a field",
    title: "Baby goat jumping",
    author: "Wilfredor",
    license: "CC0",
    source: "https://commons.wikimedia.org/wiki/File:Baby_goat_jumping.jpg",
  },
  "reptile-exhibits": {
    src: "/photos/reptile-exhibits.jpg",
    alt: "Close-up of a bearded dragon's head",
    title: "Bearded Dragon Head",
    author: "Mbrickn",
    license: "CC BY 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by/4.0/",
    source: "https://commons.wikimedia.org/wiki/File:Bearded_Dragon_Head.jpg",
  },
};

export const ALL_PHOTOS: Photo[] = [...HERO_PHOTOS, ...Object.values(CATEGORY_PHOTOS)];
