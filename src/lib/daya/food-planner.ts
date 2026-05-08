import type { DailyCheckIn, BehavioralInsight, ChildProfile } from "@/types";
import { findRelevantBookSnippets } from "@/lib/daya/book-knowledge";


type MealSuggestion = {
  time: "breakfast" | "lunch" | "snack" | "dinner";
  emoji: string;
  label: string;
  items: string[];
};

export type FoodPlan = {
  title: string;
  meals: MealSuggestion[];
  hydration: string[];
  note: string;
};

export function generateFoodPlan(options: {
  child?: ChildProfile;
  checkIns: DailyCheckIn[];
  insights: BehavioralInsight[];
}): FoodPlan {
  const { child, checkIns, insights } = options;
  const childName = child?.name ?? "your child";
  const recent = checkIns.at(-1);
  const prev = checkIns.at(-2);

  const lowMeals = (recent?.meal_quality ?? 3) <= 2;
  const lowSleep = (recent?.sleep_quality ?? 3) <= 2;
  const highSensory = (recent?.sensory_load ?? 3) >= 4;
  const difficultMood = recent?.mood === "difficult" || recent?.mood === "very_difficult";
  const highEnergy = (recent?.energy_level ?? 3) >= 4;
  const highHyperactivity = (recent?.hyperactivity ?? 3) >= 4;

  const hasFoodInsight = insights.some((i) => i.support_tags?.includes("food_and_eating"));
  const hasSensoryInsight = insights.some((i) => i.support_tags?.includes("overstimulation"));

  const breakfast: string[] = [];
  const lunch: string[] = [];
  const snack: string[] = [];
  const dinner: string[] = [];
  const hydration: string[] = [];

  // Breakfast
  if (lowSleep) {
    breakfast.push("Warm, soft-textured breakfast — oatmeal, soft toast, or warm milk");
    breakfast.push("Keep it simple and familiar — fewer choices feel safer on tired mornings");
  } else if (difficultMood) {
    breakfast.push("Comfort breakfast with familiar favorites — predictability first");
    breakfast.push("Offer two options maximum to reduce decision pressure");
  } else {
    breakfast.push("Calm, predictable breakfast at the usual time");
    breakfast.push("One familiar item alongside something gently new if the day feels steady");
  }

  if (highSensory || hasSensoryInsight) {
    breakfast.push("Avoid crunchy or multi-textured foods if sensory load was high recently");
  }

  // Lunch
  if (lowMeals || hasFoodInsight) {
    lunch.push("Familiar, preferred foods in consistent portions");
    lunch.push("Separate foods on the plate — touching foods can feel overwhelming");
  } else {
    lunch.push("Balanced, familiar meal with consistent presentation");
  }

  if (highEnergy || highHyperactivity) {
    lunch.push("Include protein-rich options to support sustained energy through the afternoon");
  }

  lunch.push("Serve at the same time as yesterday if possible");

  // Snack
  snack.push("Mid-morning and mid-afternoon snack at predictable times");

  if (highSensory) {
    snack.push("Soft, calming snack options — banana, yogurt, smooth crackers");
  } else {
    snack.push("Simple choices — fruit, crackers, cheese, or a preferred comfort snack");
  }

  if (difficultMood || lowMeals) {
    snack.push("Keep preferred snacks visible and accessible — reducing the need to ask");
  }

  // Dinner
  if (difficultMood) {
    dinner.push("Warm, comforting dinner — familiar textures and temperature");
    dinner.push("Lower-demand mealtime — no pressure to try new foods today");
  } else if (recent?.mood === "great" || recent?.mood === "good") {
    dinner.push("Familiar dinner with one small, optional new element on the side");
    dinner.push("Celebrate the steady day with a preferred meal");
  } else {
    dinner.push("Predictable dinner at the usual time");
    dinner.push("Familiar dishes with consistent presentation");
  }

  if (highSensory) {
    dinner.push("Avoid strong-smelling foods — subtle flavors feel easier after sensory-heavy days");
  }

  // Hydration
  hydration.push("Water visible and accessible in a familiar cup throughout the day");
  hydration.push("Gentle hydration check after activities and before transitions");

  if (highEnergy || highHyperactivity) {
    hydration.push("Extra water available during movement breaks");
  }

  if (lowSleep) {
    hydration.push("Warm water or mild warm drink before bedtime can support wind-down");
  }

  // Pull a sensory-friendly recipe into the plan if relevant
  const recipeQuery = [
    lowSleep ? "tired soft breakfast" : "",
    highSensory ? "overstimulation calming food" : "",
    difficultMood ? "comfort meal" : "",
    lowMeals ? "food refusal hunger" : "",
    "recipe sensory-friendly",
  ].filter(Boolean).join(" ");

  const recipeSnippets = findRelevantBookSnippets(recipeQuery, 2);
  for (const snippet of recipeSnippets) {
    if (snippet.tags?.includes("recipe") && snippet.tags.includes("breakfast") && breakfast.length < 4) {
      breakfast.push(`💡 Recipe idea: ${snippet.title} — ${snippet.text.split("\n")[0]}`);
      break;
    }
  }
  for (const snippet of recipeSnippets) {
    if (snippet.tags?.includes("recipe") && (snippet.tags.includes("lunch") || snippet.tags.includes("dinner")) && dinner.length < 4) {
      dinner.push(`💡 Recipe idea: ${snippet.title} — ${snippet.text.split("\n")[0]}`);
      break;
    }
  }

  // Cap each section
  const plan: FoodPlan = {
    title: `Gentle Meal Plan for ${childName}`,
    meals: [
      { time: "breakfast", emoji: "🌅", label: "Breakfast", items: breakfast.slice(0, 3) },
      { time: "lunch", emoji: "🍽️", label: "Lunch", items: lunch.slice(0, 3) },
      { time: "snack", emoji: "🍎", label: "Snacks", items: snack.slice(0, 3) },
      { time: "dinner", emoji: "🌙", label: "Dinner", items: dinner.slice(0, 3) },
    ],
    hydration: hydration.slice(0, 3),
    note: generateFoodNote(recent, prev, childName),
  };

  return plan;
}

function generateFoodNote(
  recent?: DailyCheckIn,
  prev?: DailyCheckIn,
  childName = "your child"
): string {
  if (!recent) {
    return `This meal plan is a gentle starting point. As you log more check-ins, DAYA will personalize it based on ${childName}'s food comfort patterns.`;
  }

  const parts: string[] = [];

  if ((recent.meal_quality ?? 3) <= 2) {
    parts.push("Meals were harder recently — tomorrow's plan focuses on comfort foods and familiarity.");
  } else if ((recent.meal_quality ?? 3) >= 4) {
    parts.push("Meals have been going well — the plan keeps that momentum with gentle consistency.");
  }

  if (prev && (prev.meal_quality ?? 3) <= 2 && (recent.meal_quality ?? 3) >= 3) {
    parts.push("Food comfort seems to be recovering — keep the pace gentle.");
  }

  if (!parts.length) {
    parts.push("These are sensory-friendly, observation-based ideas — not prescriptions. Adjust freely based on what you observe.");
  }

  return parts.join(" ");
}

export function formatFoodPlan(plan: FoodPlan): string {
  let output = `\n🍽️ ${plan.title}\n`;

  for (const meal of plan.meals) {
    output += `\n${meal.emoji} ${meal.label}\n`;
    for (const item of meal.items) {
      output += `• ${item}\n`;
    }
  }

  output += `\n💧 Hydration\n`;
  for (const item of plan.hydration) {
    output += `• ${item}\n`;
  }

  output += `\n💛 ${plan.note}`;
  return output;
}
