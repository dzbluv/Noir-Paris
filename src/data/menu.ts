import { MenuCategory, TastingMenu } from '../types';

export interface EditorialDish {
  id: string;
  num: string;
  name: string;
  description: string;
  price: string;
  image: string;
  alt: string;
  tag: string;
  note?: string;
  aspectRatio?: 'vertical' | 'horizontal' | 'square' | 'macro';
}

export interface VocabularyItem {
  id: string;
  word: string;
  quote: string;
  detail: string;
  image: string;
  alt: string;
}

export interface PairingItem {
  title: string;
  subtitle: string;
  price: string;
  description: string;
}

/* =========================================================================
   02 / LES PREMIERS GESTES (Entrées & Premières créations)
   ========================================================================= */
export const FIRST_GESTURES_DISHES: EditorialDish[] = [
  {
    id: 'saint-jacques',
    num: '01',
    name: 'SAINT-JACQUES',
    description: 'Topinambour fumé · Noisette torréfiée · Huile de persil',
    price: '48 €',
    image: '/images/carte/saint-jacques.jpg',
    alt: 'Saint-Jacques nacrées de plongée, crème de topinambour fumé et noisettes torréfiées',
    tag: 'FUMÉ',
    note: 'Nacrée à 48°C à cœur, extraction végétale',
    aspectRatio: 'vertical'
  },
  {
    id: 'betterave',
    num: '02',
    name: 'BETTERAVE',
    description: 'Cassis · Vinaigre de vin rouge · Crème crue',
    price: '32 €',
    image: '/images/carte/betterave.jpg',
    alt: 'Betterave crapaudine confite sous la cendre, cassis et crème crue fermière',
    tag: 'FERMENTÉ',
    note: 'Crapaudine cuite 6 heures dans la braise',
    aspectRatio: 'horizontal'
  },
  {
    id: 'ceviche-daurade',
    num: '03',
    name: 'CEVICHE DE DAURADE',
    description: 'Agrumes · Fenouil · Huile de livèche',
    price: '36 €',
    image: '/images/carte/ceviche-daurade.jpg',
    alt: 'Ceviche de daurade royale de ligne, fenouil croquant et huile de livèche',
    tag: 'IODE',
    note: 'Pêche artisanale côtière, vivacité herbacée',
    aspectRatio: 'macro'
  }
];

/* =========================================================================
   03 / PROFONDEUR (Plats principaux)
   ========================================================================= */
export const PROFONDEUR_DISHES: EditorialDish[] = [
  {
    id: 'pigeon',
    num: '04',
    name: 'PIGEON',
    description: 'Betterave fumée · Jus corsé · Cassis',
    price: '52 €',
    image: '/images/carte/pigeon.jpg',
    alt: 'Pigeon de Bresse rosé cuit sur coffre au feu de bois, jus réduit et cassis sauvage',
    tag: 'RÉDUIT',
    note: 'Cuit rosé sur coffre au charbon de chêne, jus réduit 48h',
    aspectRatio: 'horizontal'
  },
  {
    id: 'homard-bleu',
    num: '05',
    name: 'HOMARD BLEU',
    description: 'Céleri · Agrume · Beurre fermenté',
    price: '64 €',
    image: '/images/carte/homard-bleu.jpg',
    alt: 'Homard bleu breton au beurre fermenté, céleri confit et condiment agrumes',
    tag: 'INFUSÉ',
    note: 'Homard breton saisi minute, beurre nourri aux levures vivantes',
    aspectRatio: 'vertical'
  },
  {
    id: 'agneau',
    num: '06',
    name: 'AGNEAU',
    description: 'Artichaut · Olive noire · Jus au thym',
    price: '56 €',
    image: '/images/carte/agneau.jpg',
    alt: 'Selle d agneau de pré-salé, artichaut poivrade braisé et jus infusé au thym sauvage',
    tag: 'TORRÉFIÉ',
    note: 'Agneau de Lozère maturé 18 jours, infusion de garrigue',
    aspectRatio: 'horizontal'
  }
];

/* =========================================================================
   04 / LA DERNIÈRE NOTE (Desserts)
   ========================================================================= */
export const DESSERT_DISHES: EditorialDish[] = [
  {
    id: 'chocolat-noir',
    num: '07',
    name: 'CHOCOLAT NOIR',
    description: 'Sarrasin · Café · Fleur de sel',
    price: '18 €',
    image: '/images/carte/chocolat-noir.jpg',
    alt: 'Ganache dense chocolat noir Grand Cru 75%, café d Éthiopie et sarrasin torréfié',
    tag: 'AMERTUME',
    note: 'Cacao d origine sauvage 75%, sorbet café filtre glacé',
    aspectRatio: 'macro'
  },
  {
    id: 'poire',
    num: '08',
    name: 'POIRE',
    description: 'Vanille fumée · Amande · Verjus',
    price: '18 €',
    image: '/images/carte/poire.jpg',
    alt: 'Poire pochée au verjus sauvage, voile d amande fraîche et gousse de vanille fumée',
    tag: 'DOUCEUR MINÉRALE',
    note: 'Infusion d amandes amères et acidité végétale',
    aspectRatio: 'vertical'
  }
];

/* =========================================================================
   05 / LES ACCORDS
   ========================================================================= */
export const PAIRINGS_LIST: PairingItem[] = [
  {
    title: 'VINS',
    subtitle: 'Sélection au verre',
    price: 'À partir de 14 €',
    description: 'Des terroirs vivants, de micro-parcelles confidentielles du Jura, de Bourgogne et de la Loire vinifiées sans intrant.'
  },
  {
    title: 'ACCORDS',
    subtitle: '5 verres',
    price: '75 €',
    description: 'Une trajectoire sensorielle pensée pour répondre à la minéralité, à l acidité et à la profondeur fumée de chaque assiette.'
  },
  {
    title: 'SANS ALCOOL',
    subtitle: 'Créations maison',
    price: '45 €',
    description: 'Extractions de bourgeons de pin, verjus fumé au foin, kéfirs botaniques et distillations d aromates pressés à froid.'
  }
];

/* =========================================================================
   MICRO-VOCABULAIRE GASTRONOMIQUE
   ========================================================================= */
export const MICRO_VOCABULARY = [
  'FUMÉ',
  'FERMENTÉ',
  'TORRÉFIÉ',
  'CONFIT',
  'INFUSÉ',
  'RÉDUIT',
  'MATURÉ',
  'TEXTURE',
  'TEMPÉRATURE',
  'CONTRASTE'
];

/* =========================================================================
   ORIGINAL FEATURE: LE VOCABULAIRE DE NOIR
   Signature interactive module for TA2B
   ========================================================================= */
export const LE_VOCABULAIRE_DE_NOIR: VocabularyItem[] = [
  {
    id: 'matiere',
    word: 'MATIÈRE',
    quote: 'La texture précède parfois le goût.',
    detail: 'Travailler la rugosité de la pierre, le soyeux d un beurre émulsionné, le croustillant de graines toastées à cœur.',
    image: '/images/carte/saint-jacques.jpg',
    alt: 'Matière brute de cuisine gastronomique'
  },
  {
    id: 'geste',
    word: 'GESTE',
    quote: 'Chaque mouvement compte lorsqu il devient invisible.',
    detail: 'La découpe au millimètre, la gestuelle précise du dressage au passe, la retenue nécessaire à l harmonie du plat.',
    image: '/images/carte/hero-culinary.jpg',
    alt: 'Geste minutieux du chef'
  },
  {
    id: 'temps',
    word: 'TEMPS',
    quote: 'Certaines saveurs commencent bien avant le service.',
    detail: 'Des fermentations de plusieurs semaines, des bouillons réduits 48 heures, le repos des chairs sous la braise tiède.',
    image: '/images/carte/betterave.jpg',
    alt: 'Le temps de macération et de cuisson'
  },
  {
    id: 'temperature',
    word: 'TEMPÉRATURE',
    quote: 'La chaleur révèle, le froid concentre.',
    detail: 'Jouer des contrastes thermiques au sein d une même bouchée : une écume tiède sur un poisson vivifié au givre végétal.',
    image: '/images/carte/homard-bleu.jpg',
    alt: 'Maîtrise millimétrée de la température'
  },
  {
    id: 'contraste',
    word: 'CONTRASTE',
    quote: 'De l ombre naît la vibration de la lumière.',
    detail: 'L amertume tranchée par une acidité noble, l iode sauvage adouci par la rondeur noisettée d une racine oubliée.',
    image: '/images/carte/ceviche-daurade.jpg',
    alt: 'Contraste d ombre et de couleur'
  },
  {
    id: 'profondeur',
    word: 'PROFONDEUR',
    quote: 'Une sauce n est pas un liquide, c est une mémoire concentrée.',
    detail: 'Des sucs caramélisés au binchotan, patiemment déglacés et réduits jusqu à une brillance miroitante.',
    image: '/images/carte/pigeon.jpg',
    alt: 'Profondeur d un jus de viande corsé'
  },
  {
    id: 'persistance',
    word: 'PERSISTANCE',
    quote: 'Le goût qui demeure quand la table est débarrassée.',
    detail: 'La longueur en bouche qui se prolonge en écho, gravant le souvenir d un moment suspendu dans le silence.',
    image: '/images/carte/chocolat-noir.jpg',
    alt: 'Persistance aromatique en fin de repas'
  }
];

/* =========================================================================
   06 / CE SOIR & FORMATS
   ========================================================================= */
export const CE_SOIR_DATA = {
  label: '06 / CE SOIR',
  title: 'CE SOIR',
  lead: 'Une expérience pensée pour suivre le rythme du service.',
  formats: [
    {
      name: 'MENU NOIR',
      tempo: '7 temps',
      price: '120 €',
      desc: 'La partition complète de la soirée, du premier geste à la dernière note.'
    },
    {
      name: 'ACCORDS',
      tempo: '5 verres',
      price: '75 €',
      desc: 'Vins d auteur et fermentations vivantes minutieusement appariés.'
    }
  ],
  serviceInfo: [
    { label: 'HORAIRES', val: 'MARDI — SAMEDI · 19:00 — 23:30' },
    { label: 'DISPOSITION', val: '12 TABLES · SERVICE DU SOIR' },
    { label: 'ADRESSE', val: '12 RUE FICTIVE, 75001 PARIS' }
  ],
  seasonalNote: 'La composition du menu évolue selon les saisons, les arrivages et l inspiration du moment.'
};

/* =========================================================================
   COMPATIBILITY EXPORTS (Preserved for existing legacy code)
   ========================================================================= */
export const menuCategories: MenuCategory[] = [
  {
    id: 'entrees',
    name: 'Premiers Gestes',
    frenchName: 'Les Premiers Gestes',
    description: 'Topinambour fumé, noisette torréfiée, betterave crapaudine et poissons de ligne.',
    items: FIRST_GESTURES_DISHES.map(d => ({
      id: d.id,
      name: d.name,
      subtitle: d.description,
      description: d.note || '',
      price: parseInt(d.price, 10) || 38,
      highlight: true
    }))
  },
  {
    id: 'plats',
    name: 'Profondeur',
    frenchName: 'Plats Principaux',
    description: 'Cuissons d exception au feu de bois, sucs réduits et saveurs franches.',
    items: PROFONDEUR_DISHES.map(d => ({
      id: d.id,
      name: d.name,
      subtitle: d.description,
      description: d.note || '',
      price: parseInt(d.price, 10) || 52,
      highlight: true
    }))
  },
  {
    id: 'desserts',
    name: 'Dernière Note',
    frenchName: 'Desserts',
    description: 'Subtilité des amers, du sarrasin grillé et de la vanille fumée.',
    items: DESSERT_DISHES.map(d => ({
      id: d.id,
      name: d.name,
      subtitle: d.description,
      description: d.note || '',
      price: parseInt(d.price, 10) || 18
    }))
  },
  {
    id: 'boissons',
    name: 'Accords & Boissons',
    frenchName: 'Les Accords',
    description: 'Vins vivants, cépages oubliés et élixirs botaniques sans alcool.',
    items: PAIRINGS_LIST.map(p => ({
      id: p.title.toLowerCase().replace(/\s+/g, '-'),
      name: p.title,
      subtitle: p.subtitle,
      description: p.description,
      price: parseInt(p.price.replace(/[^\d]/g, ''), 10) || 45
    }))
  }
];

export const tastingMenus: TastingMenu[] = [
  {
    id: 'menu-noir',
    name: 'Menu NOIR',
    services: 7,
    price: 120,
    winePairingPrice: 75,
    description: 'Une expérience gastronomique contemporaine en sept temps pensée autour du produit, du geste et du temps.',
    courses: [
      { courseName: '01 · PROLOGUE', dish: 'Bouillon de mousse de chêne', description: 'Infusion chaude de sous-bois et genièvre sauvage' },
      { courseName: '02 · NACRE', dish: 'Saint-Jacques d Erquy', description: 'Topinambour fumé, noisette torréfiée, chlorophylle' },
      { courseName: '03 · TERRE', dish: 'Betterave Crapaudine', description: 'Cassis sauvage, vinaigre de vin rouge et crème crue fermière' },
      { courseName: '04 · IODE', dish: 'Homard Bleu Breton', description: 'Céleri rôti, agrume confit et beurre fermenté' },
      { courseName: '05 · BRAISE', dish: 'Pigeon de Bresse', description: 'Betterave fumée, sucs réduits et cassis sauvage' },
      { courseName: '06 · MINÉRAL', dish: 'Poire Pochée au Verjus', description: 'Vanille fumée et amandes sauvages toastées' },
      { courseName: '07 · ÉPILOGUE', dish: 'Chocolat Noir Grand Cru', description: 'Sarrasin grillé, granité café filtre et fleur de sel fumée' }
    ]
  }
];
