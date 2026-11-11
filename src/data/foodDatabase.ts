import type { FoodDatabaseItem, FoodItem } from '../types';

export const FOOD_DATABASE: FoodDatabaseItem[] = [
  // EGGS
  {
    id: 'egg_whole',
    name: 'Whole Egg',
    category: 'eggs',
    servingSize: 1,
    servingUnit: 'egg (50g)',
    caloriesPerServing: 72,
    proteinPerServing: 6.3,
    carbsPerServing: 0.4,
    fatsPerServing: 4.8,
    aliases: ['egg', 'eggs', 'whole egg', 'whole eggs', 'boiled egg', 'boiled eggs', 'ande', 'anda']
  },
  {
    id: 'egg_white',
    name: 'Egg White',
    category: 'eggs',
    servingSize: 1,
    servingUnit: 'white (33g)',
    caloriesPerServing: 17,
    proteinPerServing: 3.6,
    carbsPerServing: 0.2,
    fatsPerServing: 0.1,
    aliases: ['egg white', 'egg whites', 'white of egg', 'egg white only']
  },
  {
    id: 'omelette',
    name: 'Egg Omelette (1 egg + oil)',
    category: 'eggs',
    servingSize: 1,
    servingUnit: 'omelette (1 egg)',
    caloriesPerServing: 95,
    proteinPerServing: 6.5,
    carbsPerServing: 0.8,
    fatsPerServing: 7.2,
    aliases: ['omelette', 'omlet', 'omlete', 'egg omelette']
  },
  {
    id: 'scrambled_eggs',
    name: 'Scrambled Eggs (2 eggs)',
    category: 'eggs',
    servingSize: 1,
    servingUnit: 'portion (2 eggs)',
    caloriesPerServing: 180,
    proteinPerServing: 13,
    carbsPerServing: 1.5,
    fatsPerServing: 13.5,
    aliases: ['scrambled egg', 'scrambled eggs', 'scramble']
  },
  {
    id: 'egg_bhurji',
    name: 'Egg Bhurji (2 eggs)',
    category: 'eggs',
    servingSize: 1,
    servingUnit: 'plate (2 eggs)',
    caloriesPerServing: 210,
    proteinPerServing: 13.5,
    carbsPerServing: 4,
    fatsPerServing: 15,
    aliases: ['egg bhurji', 'anda bhurji', 'bhurji']
  },

  // CHICKEN
  {
    id: 'chicken_breast_raw',
    name: 'Chicken Breast (Raw/Boiled)',
    category: 'chicken',
    servingSize: 100,
    servingUnit: 'grams',
    caloriesPerServing: 165,
    proteinPerServing: 31,
    carbsPerServing: 0,
    fatsPerServing: 3.6,
    aliases: ['chicken breast', 'boiled chicken', 'raw chicken breast', 'skinless chicken breast', 'boneless chicken breast']
  },
  {
    id: 'chicken_breast_cooked',
    name: 'Grilled / Cooked Chicken Breast',
    category: 'chicken',
    servingSize: 100,
    servingUnit: 'grams',
    caloriesPerServing: 195,
    proteinPerServing: 30,
    carbsPerServing: 0,
    fatsPerServing: 7.5,
    aliases: ['grilled chicken', 'cooked chicken breast', 'roast chicken', 'chicken tikka']
  },
  {
    id: 'chicken_thigh',
    name: 'Chicken Thigh (Skinless)',
    category: 'chicken',
    servingSize: 100,
    servingUnit: 'grams',
    caloriesPerServing: 209,
    proteinPerServing: 26,
    carbsPerServing: 0,
    fatsPerServing: 10.9,
    aliases: ['chicken thigh', 'chicken thighs']
  },
  {
    id: 'chicken_curry',
    name: 'Chicken Curry (Homestyle)',
    category: 'chicken',
    servingSize: 1,
    servingUnit: 'katori / bowl (150g)',
    caloriesPerServing: 240,
    proteinPerServing: 22,
    carbsPerServing: 6,
    fatsPerServing: 14,
    aliases: ['chicken curry', 'murgh curry', 'curry chicken']
  },

  // DAIRY & ALTERNATIVES
  {
    id: 'paneer_raw',
    name: 'Paneer (Cottage Cheese)',
    category: 'dairy',
    servingSize: 100,
    servingUnit: 'grams',
    caloriesPerServing: 265,
    proteinPerServing: 18.3,
    carbsPerServing: 3.4,
    fatsPerServing: 20.8,
    aliases: ['paneer', 'cottage cheese', 'panir', 'raw paneer']
  },
  {
    id: 'low_fat_paneer',
    name: 'Low Fat Paneer',
    category: 'dairy',
    servingSize: 100,
    servingUnit: 'grams',
    caloriesPerServing: 160,
    proteinPerServing: 25,
    carbsPerServing: 4,
    fatsPerServing: 5,
    aliases: ['low fat paneer', 'diet paneer', 'skim paneer']
  },
  {
    id: 'paneer_bhurji',
    name: 'Paneer Bhurji',
    category: 'dairy',
    servingSize: 100,
    servingUnit: 'grams',
    caloriesPerServing: 280,
    proteinPerServing: 17,
    carbsPerServing: 5,
    fatsPerServing: 21,
    aliases: ['paneer bhurji', 'paneer burji']
  },
  {
    id: 'tofu_firm',
    name: 'Tofu (Firm / Soya Paneer)',
    category: 'dairy',
    servingSize: 100,
    servingUnit: 'grams',
    caloriesPerServing: 83,
    proteinPerServing: 10,
    carbsPerServing: 2.1,
    fatsPerServing: 4.8,
    aliases: ['tofu', 'soya paneer', 'bean curd', 'firm tofu']
  },
  {
    id: 'milk_toned',
    name: 'Toned Cow Milk',
    category: 'dairy',
    servingSize: 250,
    servingUnit: 'ml (1 glass)',
    caloriesPerServing: 150,
    proteinPerServing: 7.8,
    carbsPerServing: 12,
    fatsPerServing: 7.5,
    aliases: ['milk', 'cow milk', 'toned milk', 'doodh', 'glass of milk']
  },
  {
    id: 'greek_yogurt',
    name: 'Greek Yogurt (Plain / Low Fat)',
    category: 'dairy',
    servingSize: 100,
    servingUnit: 'grams',
    caloriesPerServing: 60,
    proteinPerServing: 10,
    carbsPerServing: 3.6,
    fatsPerServing: 0.4,
    aliases: ['greek yogurt', 'greek dahi', 'hung curd', 'high protein yogurt']
  },
  {
    id: 'curd_regular',
    name: 'Curd / Dahi (Homestyle)',
    category: 'dairy',
    servingSize: 150,
    servingUnit: 'katori (150g)',
    caloriesPerServing: 98,
    proteinPerServing: 4.5,
    carbsPerServing: 6.8,
    fatsPerServing: 6,
    aliases: ['curd', 'dahi', 'yogurt', 'plain curd']
  },

  // VEGETARIAN PROTEIN
  {
    id: 'soya_chunks_raw',
    name: 'Soya Chunks (Raw/Dry)',
    category: 'vegetarian',
    servingSize: 50,
    servingUnit: 'grams (dry)',
    caloriesPerServing: 172,
    proteinPerServing: 26,
    carbsPerServing: 16.5,
    fatsPerServing: 0.5,
    aliases: ['soya chunks', 'soya bean chunks', 'soya granules', 'nutrela', 'soya']
  },
  {
    id: 'rajma_cooked',
    name: 'Rajma / Kidney Beans (Cooked)',
    category: 'vegetarian',
    servingSize: 1,
    servingUnit: 'katori / bowl (150g)',
    caloriesPerServing: 160,
    proteinPerServing: 9.5,
    carbsPerServing: 28,
    fatsPerServing: 1.2,
    aliases: ['rajma', 'kidney beans', 'cooked rajma', 'rajma curry']
  },
  {
    id: 'chana_cooked',
    name: 'Chana / Chickpeas (Boiled/Curry)',
    category: 'vegetarian',
    servingSize: 1,
    servingUnit: 'katori / bowl (150g)',
    caloriesPerServing: 185,
    proteinPerServing: 10.2,
    carbsPerServing: 30,
    fatsPerServing: 2.5,
    aliases: ['chana', 'chickpeas', 'white chana', 'black chana', 'kala chana', 'chole']
  },
  {
    id: 'moong_dal_cooked',
    name: 'Moong Dal (Cooked with Tadka)',
    category: 'vegetarian',
    servingSize: 1,
    servingUnit: 'katori / bowl (150g)',
    caloriesPerServing: 145,
    proteinPerServing: 8.5,
    carbsPerServing: 20,
    fatsPerServing: 3.5,
    aliases: ['dal', 'moong dal', 'yellow dal', 'arhar dal', 'toor dal', 'masoor dal', 'katori dal']
  },
  {
    id: 'sprouts_moong',
    name: 'Moong Sprouts (Raw/Salad)',
    category: 'vegetarian',
    servingSize: 100,
    servingUnit: 'grams',
    caloriesPerServing: 35,
    proteinPerServing: 3.2,
    carbsPerServing: 6,
    fatsPerServing: 0.2,
    aliases: ['sprouts', 'moong sprouts', 'ankurit moong']
  },
  {
    id: 'besan_chilla',
    name: 'Besan Chilla (Gram Flour Pancake)',
    category: 'vegetarian',
    servingSize: 1,
    servingUnit: 'chilla (medium)',
    caloriesPerServing: 130,
    proteinPerServing: 6,
    carbsPerServing: 18,
    fatsPerServing: 4,
    aliases: ['besan chilla', 'chilla', 'cheela', 'gram flour pancake']
  },
  {
    id: 'roasted_chana',
    name: 'Roasted Chana (Bhuna Chana)',
    category: 'vegetarian',
    servingSize: 50,
    servingUnit: 'grams (handful)',
    caloriesPerServing: 185,
    proteinPerServing: 11,
    carbsPerServing: 29,
    fatsPerServing: 2.7,
    aliases: ['roasted chana', 'bhuna chana', 'roasted gram']
  },
  {
    id: 'peanuts',
    name: 'Peanuts / Groundnuts (Roasted)',
    category: 'vegetarian',
    servingSize: 30,
    servingUnit: 'grams (1 fistful)',
    caloriesPerServing: 170,
    proteinPerServing: 7.7,
    carbsPerServing: 4.8,
    fatsPerServing: 14.5,
    aliases: ['peanuts', 'peanut', 'groundnuts', 'moongphali']
  },

  // GRAINS
  {
    id: 'roti_chapati',
    name: 'Whole Wheat Roti / Chapati',
    category: 'grains',
    servingSize: 1,
    servingUnit: 'roti (approx 35g dough)',
    caloriesPerServing: 85,
    proteinPerServing: 3,
    carbsPerServing: 17,
    fatsPerServing: 0.5,
    aliases: ['roti', 'rotis', 'chapati', 'chapatis', 'phulka', 'phulkas']
  },
  {
    id: 'brown_bread',
    name: 'Brown Bread / Whole Wheat Bread',
    category: 'grains',
    servingSize: 1,
    servingUnit: 'slice (approx 30g)',
    caloriesPerServing: 70,
    proteinPerServing: 3.5,
    carbsPerServing: 12.5,
    fatsPerServing: 0.9,
    aliases: ['brown bread', 'bread', 'slice bread', 'whole wheat bread', 'slices of bread', 'slices brown bread']
  },
  {
    id: 'oats_rolled',
    name: 'Rolled Oats (Dry)',
    category: 'grains',
    servingSize: 50,
    servingUnit: 'grams',
    caloriesPerServing: 190,
    proteinPerServing: 6.5,
    carbsPerServing: 33,
    fatsPerServing: 3.5,
    aliases: ['oats', 'oatmeal', 'rolled oats']
  },
  {
    id: 'white_rice_cooked',
    name: 'White Rice (Cooked)',
    category: 'grains',
    servingSize: 150,
    servingUnit: 'cup / plate (150g)',
    caloriesPerServing: 195,
    proteinPerServing: 4.1,
    carbsPerServing: 43,
    fatsPerServing: 0.5,
    aliases: ['rice', 'white rice', 'cooked rice', 'chawal', 'cup rice', 'bowl rice']
  },
  {
    id: 'brown_rice_cooked',
    name: 'Brown Rice (Cooked)',
    category: 'grains',
    servingSize: 150,
    servingUnit: 'cup / plate (150g)',
    caloriesPerServing: 180,
    proteinPerServing: 4.5,
    carbsPerServing: 38,
    fatsPerServing: 1.4,
    aliases: ['brown rice', 'cooked brown rice']
  },

  // SUPPLEMENTS
  {
    id: 'whey_protein',
    name: 'Whey Protein Powder',
    category: 'supplements',
    servingSize: 1,
    servingUnit: 'scoop (30g)',
    caloriesPerServing: 120,
    proteinPerServing: 24,
    carbsPerServing: 2,
    fatsPerServing: 1.5,
    aliases: ['whey', 'whey protein', 'protein powder', 'scoop whey', 'protein shake', 'whey isolate']
  },
  {
    id: 'plant_protein',
    name: 'Plant / Pea Protein Powder',
    category: 'supplements',
    servingSize: 1,
    servingUnit: 'scoop (33g)',
    caloriesPerServing: 130,
    proteinPerServing: 25,
    carbsPerServing: 2.5,
    fatsPerServing: 2,
    aliases: ['plant protein', 'pea protein', 'vegan protein']
  },

  // INDIAN MEALS
  {
    id: 'dal_chawal_plate',
    name: 'Dal Chawal (1 cup rice + 1 cup dal)',
    category: 'indian_meals',
    servingSize: 1,
    servingUnit: 'plate',
    caloriesPerServing: 360,
    proteinPerServing: 13,
    carbsPerServing: 65,
    fatsPerServing: 4.5,
    aliases: ['dal chawal', 'dal rice', 'chawal dal']
  },
  {
    id: 'roti_sabzi',
    name: 'Roti with Mixed Sabzi (2 rotis + sabzi)',
    category: 'indian_meals',
    servingSize: 1,
    servingUnit: 'meal',
    caloriesPerServing: 290,
    proteinPerServing: 9,
    carbsPerServing: 48,
    fatsPerServing: 7,
    aliases: ['roti sabzi', 'sabzi roti', 'roti with sabzi']
  },
  {
    id: 'poha',
    name: 'Poha (Flattened Rice with Veggies)',
    category: 'indian_meals',
    servingSize: 1,
    servingUnit: 'medium plate (180g)',
    caloriesPerServing: 240,
    proteinPerServing: 4.5,
    carbsPerServing: 42,
    fatsPerServing: 6.5,
    aliases: ['poha', 'pohe', 'flattened rice']
  },
  {
    id: 'upma',
    name: 'Suji Upma (Semolina Savory Porridge)',
    category: 'indian_meals',
    servingSize: 1,
    servingUnit: 'medium plate (180g)',
    caloriesPerServing: 230,
    proteinPerServing: 5,
    carbsPerServing: 38,
    fatsPerServing: 6.8,
    aliases: ['upma', 'suji upma', 'rava upma']
  },
  {
    id: 'idli',
    name: 'Steamed Idli',
    category: 'indian_meals',
    servingSize: 1,
    servingUnit: 'piece',
    caloriesPerServing: 58,
    proteinPerServing: 2,
    carbsPerServing: 12,
    fatsPerServing: 0.2,
    aliases: ['idli', 'idlis', 'steamed idli']
  },
  {
    id: 'dosa_plain',
    name: 'Plain Dosa',
    category: 'indian_meals',
    servingSize: 1,
    servingUnit: 'dosa (medium)',
    caloriesPerServing: 165,
    proteinPerServing: 3.8,
    carbsPerServing: 28,
    fatsPerServing: 4.2,
    aliases: ['dosa', 'plain dosa', 'crispy dosa']
  },
  {
    id: 'khichdi',
    name: 'Moong Dal Khichdi',
    category: 'indian_meals',
    servingSize: 1,
    servingUnit: 'bowl (200g)',
    caloriesPerServing: 260,
    proteinPerServing: 9.5,
    carbsPerServing: 45,
    fatsPerServing: 4.5,
    aliases: ['khichdi', 'khichri', 'dal khichdi']
  },
  {
    id: 'veg_pulao',
    name: 'Vegetable Pulao',
    category: 'indian_meals',
    servingSize: 1,
    servingUnit: 'plate (200g)',
    caloriesPerServing: 280,
    proteinPerServing: 5.5,
    carbsPerServing: 52,
    fatsPerServing: 6,
    aliases: ['pulao', 'veg pulao', 'vegetable pulao', 'pilaf']
  },

  // FRUITS
  {
    id: 'banana',
    name: 'Banana',
    category: 'fruits',
    servingSize: 1,
    servingUnit: 'medium banana (118g)',
    caloriesPerServing: 105,
    proteinPerServing: 1.3,
    carbsPerServing: 27,
    fatsPerServing: 0.3,
    aliases: ['banana', 'bananas', 'kela']
  },
  {
    id: 'apple',
    name: 'Apple',
    category: 'fruits',
    servingSize: 1,
    servingUnit: 'medium apple (180g)',
    caloriesPerServing: 95,
    proteinPerServing: 0.5,
    carbsPerServing: 25,
    fatsPerServing: 0.3,
    aliases: ['apple', 'apples', 'seb']
  },
  {
    id: 'mango',
    name: 'Mango',
    category: 'fruits',
    servingSize: 1,
    servingUnit: 'cup sliced (165g)',
    caloriesPerServing: 99,
    proteinPerServing: 1.4,
    carbsPerServing: 25,
    fatsPerServing: 0.6,
    aliases: ['mango', 'aam', 'mangoes']
  },

  // NUTS
  {
    id: 'almonds',
    name: 'Almonds',
    category: 'nuts',
    servingSize: 10,
    servingUnit: 'pieces (approx 12g)',
    caloriesPerServing: 70,
    proteinPerServing: 2.6,
    carbsPerServing: 2.4,
    fatsPerServing: 6.1,
    aliases: ['almond', 'almonds', 'badam']
  },
  {
    id: 'walnuts',
    name: 'Walnuts',
    category: 'nuts',
    servingSize: 5,
    servingUnit: 'halves (approx 14g)',
    caloriesPerServing: 92,
    proteinPerServing: 2.1,
    carbsPerServing: 1.9,
    fatsPerServing: 9.1,
    aliases: ['walnut', 'walnuts', 'akhrot']
  }
];

// Natural language numbers mapping
const WORD_TO_NUMBER: Record<string, number> = {
  a: 1, an: 1, one: 1, two: 2, three: 3, four: 4, five: 5,
  six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
  eleven: 11, twelve: 12, dozen: 12, fifteen: 15, twenty: 20,
  half: 0.5, quarter: 0.25, couple: 2, few: 3
};

export function parseNaturalLanguageMeal(input: string): {
  items: FoodItem[];
  unmatchedPhrases: string[];
} {
  const items: FoodItem[] = [];
  const unmatchedPhrases: string[] = [];

  if (!input || typeof input !== 'string' || !input.trim()) {
    return { items, unmatchedPhrases };
  }

  // Split into candidate food phrases using commas, newlines, semicolons, and connectors
  const rawSegments = input
    .split(/[,;\n+]|\band\b|\bwith\b|\bplus\b|\balong with\b/i)
    .map(s => s.trim())
    .filter(s => s.length > 0);

  for (const segment of rawSegments) {
    const cleanSeg = segment.toLowerCase().replace(/[^\w\s\d./]/g, ' ').trim();
    if (!cleanSeg) continue;

    let quantity = 1;
    let unitFound = '';

    // Check fractional format like "1/2", "3/4", "1/4"
    const fractionMatch = cleanSeg.match(/(\d+)\s*\/\s*(\d+)/);
    const gramMatch = cleanSeg.match(/(\d+(?:\.\d+)?)\s*(?:g|gm|gms|grams)\b/);
    const mlMatch = cleanSeg.match(/(\d+(?:\.\d+)?)\s*(?:ml|milliliters|millilitres)\b/);
    const scoopMatch = cleanSeg.match(/(\d+(?:\.\d+)?)\s*(?:scoop|scoops)\b/);
    const sliceMatch = cleanSeg.match(/(\d+(?:\.\d+)?)\s*(?:slice|slices)\b/);
    const cupMatch = cleanSeg.match(/(\d+(?:\.\d+)?)\s*(?:cup|cups|katori|katoris|bowl|bowls|glass|glasses)\b/);
    const pieceMatch = cleanSeg.match(/(\d+(?:\.\d+)?)\s*(?:piece|pieces|roti|rotis|chapatis|eggs|egg|idli|idlis)\b/);
    const leadingNumMatch = cleanSeg.match(/^(\d+(?:\.\d+)?)\b/);

    if (fractionMatch) {
      const num = parseFloat(fractionMatch[1]);
      const den = parseFloat(fractionMatch[2]);
      if (den > 0) quantity = num / den;
    } else if (gramMatch) {
      quantity = parseFloat(gramMatch[1]);
      unitFound = 'g';
    } else if (mlMatch) {
      quantity = parseFloat(mlMatch[1]);
      unitFound = 'ml';
    } else if (scoopMatch) {
      quantity = parseFloat(scoopMatch[1]);
      unitFound = 'scoop';
    } else if (sliceMatch) {
      quantity = parseFloat(sliceMatch[1]);
      unitFound = 'slice';
    } else if (cupMatch) {
      quantity = parseFloat(cupMatch[1]);
      unitFound = 'cup';
    } else if (pieceMatch) {
      quantity = parseFloat(pieceMatch[1]);
      unitFound = 'piece';
    } else if (leadingNumMatch) {
      quantity = parseFloat(leadingNumMatch[1]);
    } else {
      const words = cleanSeg.split(/\s+/);
      for (const w of words) {
        if (WORD_TO_NUMBER[w] !== undefined) {
          quantity = WORD_TO_NUMBER[w];
          break;
        }
      }
    }

    // Safety bounds for quantity
    if (!Number.isFinite(quantity) || quantity <= 0) {
      quantity = 1;
    }
    quantity = Math.min(10000, quantity);

    // Try matching food item against database
    let bestMatch: FoodDatabaseItem | null = null;
    let longestMatchLen = 0;

    for (const food of FOOD_DATABASE) {
      for (const alias of food.aliases) {
        if (cleanSeg.includes(alias)) {
          if (alias.length > longestMatchLen) {
            longestMatchLen = alias.length;
            bestMatch = food;
          }
        }
      }
    }

    if (bestMatch) {
      let multiplier = quantity;

      if (unitFound === 'g' && bestMatch.servingUnit.includes('grams')) {
        multiplier = quantity / (bestMatch.servingSize || 100);
      } else if (unitFound === 'ml' && bestMatch.servingUnit.includes('ml')) {
        multiplier = quantity / (bestMatch.servingSize || 250);
      } else if (unitFound === 'g' && !bestMatch.servingUnit.includes('grams')) {
        multiplier = quantity / 100;
      }

      const cal = Math.round(bestMatch.caloriesPerServing * multiplier);
      const pro = Math.round((bestMatch.proteinPerServing * multiplier) * 10) / 10;
      const carb = Math.round((bestMatch.carbsPerServing * multiplier) * 10) / 10;
      const fat = Math.round((bestMatch.fatsPerServing * multiplier) * 10) / 10;

      items.push({
        id: `food_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
        name: bestMatch.name,
        quantity: Math.round(quantity * 10) / 10,
        unit: unitFound || bestMatch.servingUnit,
        calories: Math.max(1, cal),
        protein: Math.max(0, pro),
        carbs: Math.max(0, carb),
        fats: Math.max(0, fat),
        isEstimated: false
      });
    } else {
      unmatchedPhrases.push(segment);
      items.push({
        id: `est_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
        name: segment.trim(),
        quantity: Math.round(quantity * 10) / 10,
        unit: unitFound || 'serving (estimated)',
        calories: Math.max(10, Math.round(180 * quantity)),
        protein: Math.max(0, Math.round(5 * quantity)),
        carbs: Math.max(0, Math.round(22 * quantity)),
        fats: Math.max(0, Math.round(8 * quantity)),
        isEstimated: true
      });
    }
  }

  return { items, unmatchedPhrases };
}

