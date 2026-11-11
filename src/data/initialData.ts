import type { Achievement, SkincareProduct } from '../types';

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'ach_first_blood',
    title: 'FIRST BLOOD',
    description: 'Complete your first physical training trial',
    iconName: 'Flame',
    xpReward: 100,
    category: 'workout'
  },
  {
    id: 'ach_iron_will',
    title: 'IRON WILL',
    description: 'Maintain a 7-day uninterrupted streak',
    iconName: 'Shield',
    xpReward: 250,
    category: 'discipline'
  },
  {
    id: 'ach_protein_king',
    title: 'PROTEIN MASTER',
    description: 'Hit daily protein targets 7 days consecutively',
    iconName: 'Beef',
    xpReward: 200,
    category: 'nutrition'
  },
  {
    id: 'ach_hydration_master',
    title: 'HYDRATION TITAN',
    description: 'Reach 100% daily water goals for 14 consecutive days',
    iconName: 'Droplet',
    xpReward: 300,
    category: 'discipline'
  },
  {
    id: 'ach_pushup_warrior',
    title: 'PUSH-UP WARRIOR',
    description: 'Accumulate 500 lifetime completed push-ups',
    iconName: 'Award',
    xpReward: 400,
    category: 'workout'
  },
  {
    id: 'ach_the_grind',
    title: 'THE GRIND',
    description: 'Conquer Phase 1: Complete 30 full days of the Primal System',
    iconName: 'Zap',
    xpReward: 500,
    category: 'transformation'
  },
  {
    id: 'ach_halfway_there',
    title: 'EVOLUTION PEAK',
    description: 'Reach Day 45 with over 80% protocol completion',
    iconName: 'TrendingUp',
    xpReward: 750,
    category: 'transformation'
  },
  {
    id: 'ach_primal_ascendant',
    title: 'PRIMAL ASCENDANT',
    description: 'Complete all 90 days. Rebuild your physique completely.',
    iconName: 'Crown',
    xpReward: 2000,
    category: 'transformation'
  },
  {
    id: 'ach_skincare_ritual',
    title: 'FACIAL RESURGENCE',
    description: 'Complete morning and evening skincare routines for 14 days',
    iconName: 'Sparkles',
    xpReward: 200,
    category: 'discipline'
  },
  {
    id: 'ach_night_warrior',
    title: 'DEEP RESTORATION',
    description: 'Log 7+ hours of quality sleep for 7 consecutive nights',
    iconName: 'Moon',
    xpReward: 200,
    category: 'discipline'
  }
];

export const DEFAULT_SKINCARE_PRODUCTS: SkincareProduct[] = [
  {
    id: 'prod_cleanser_am',
    name: 'Gentle Hydrating Cleanser',
    timeOfDay: 'both',
    frequency: 'daily',
    category: 'cleanser',
    notes: 'Non-stripping amino acid or cetyl alcohol based'
  },
  {
    id: 'prod_moisturizer',
    name: 'Barrier Repair Ceramide Moisturizer',
    timeOfDay: 'both',
    frequency: 'daily',
    category: 'moisturizer',
    notes: 'Hyaluronic acid and ceramides'
  },
  {
    id: 'prod_sunscreen',
    name: 'Broad Spectrum SPF 50 Matte Sunscreen',
    timeOfDay: 'morning',
    frequency: 'daily',
    category: 'sunscreen',
    notes: 'Essential for collagen preservation and UV defense'
  },
  {
    id: 'prod_niacinamide',
    name: 'Niacinamide 5% Serum',
    timeOfDay: 'morning',
    frequency: 'daily',
    category: 'active',
    notes: 'Pore texture, sebum balance, barrier strength'
  },
  {
    id: 'prod_retinol',
    name: 'Retinoid 0.2% / Granactive',
    timeOfDay: 'evening',
    frequency: 'alternate',
    category: 'treatment',
    notes: 'Cell turnover. Always patch-test and introduce slowly.'
  }
];

