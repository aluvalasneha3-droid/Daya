import type { SupportSnippet } from "@/types";

// ─────────────────────────────────────────────────────────────────────────────
// DAYA EVIDENCE-BASED KNOWLEDGE BASE
// Sources: Occupational therapy research, sensory integration theory,
// AAC frameworks, positive behaviour support literature,
// and autism-specialist dietitian guidance.
// All content is wellness-oriented, non-clinical, and observation-based.
// ─────────────────────────────────────────────────────────────────────────────

export const BOOK_SNIPPETS: SupportSnippet[] = [
  // ── SENSORY-FRIENDLY RECIPES ────────────────────────────────────────────────
  {
    id: "recipe-oat-banana-pancakes",
    category: "food_and_eating",
    intent: "parent_tip",
    triggers: ["hunger", "overstimulation", "tiredness"],
    source_label: "Sensory-friendly nutrition guide",
    tone_reviewed: true,
    title: "Oat & Banana Soft Pancakes",
    text: `Soft texture, gentle flavour — good for sensory-sensitive children.\n\nIngredients: 1 ripe banana, 2 eggs, ¼ cup rolled oats, pinch of cinnamon.\nMethod: Mash banana, mix in eggs and oats. Cook small rounds on low heat for 2-3 min each side. Serve plain or with a favourite dip.\n\nWhy it works: Uniform soft texture removes unpredictability at the plate. Banana provides natural sweetness without added sugar. Can be made the same way every morning to build mealtime predictability.`,
    tags: ["recipe", "breakfast", "soft-texture", "egg-free-option", "quick"],
  },
  {
    id: "recipe-rice-dal",
    category: "food_and_eating",
    intent: "parent_tip",
    triggers: ["hunger", "schedule_change"],
    source_label: "Sensory-friendly nutrition guide",
    tone_reviewed: true,
    title: "Smooth Rice & Dal (Comfort Meal)",
    text: `A predictable, warm, smooth-textured meal — ideal for after difficult days.\n\nIngredients: ½ cup yellow moong dal, 1 cup white rice, salt, a little ghee.\nMethod: Cook together in a pressure cooker with 3x water until very soft. Mash lightly. Add a small amount of ghee for flavour. Serve at a consistent temperature.\n\nWhy it works: Consistent texture, mild smell, and familiar appearance reduce mealtime sensory demands. The warmth is inherently calming. Works well for any meal of the day.`,
    tags: ["recipe", "lunch", "dinner", "comfort-meal", "soft-texture", "Indian"],
  },
  {
    id: "recipe-idli-soft",
    category: "food_and_eating",
    intent: "parent_tip",
    triggers: ["hunger", "transition"],
    source_label: "Sensory-friendly nutrition guide",
    tone_reviewed: true,
    title: "Soft Idli with Mild Coconut Chutney",
    text: `A gentle, predictable South Indian breakfast — soft, mild, consistent.\n\nIngredients: Ready idli batter (store-bought or home-fermented), fresh coconut chutney (coconut + green chilli + salt + a little water, blended smooth).\nMethod: Steam idli for 10-12 min. Serve warm, slightly soft. Offer chutney on the side, never mixed — many sensory-sensitive children dislike mixed textures.\n\nWhy it works: Idlis have a consistent, soft, non-sticky texture. Fermented foods like idli may support gut comfort, which some families observe correlates with calmer days.`,
    tags: ["recipe", "breakfast", "soft-texture", "Indian", "fermented"],
  },
  {
    id: "recipe-veggie-khichdi",
    category: "food_and_eating",
    intent: "parent_tip",
    triggers: ["hunger", "tiredness", "overstimulation"],
    source_label: "Sensory-friendly nutrition guide",
    tone_reviewed: true,
    title: "Vegetable Khichdi (One-Pot Comfort)",
    text: `A warm, smooth, complete meal — gentle on tired or overwhelmed days.\n\nIngredients: ½ cup rice, ¼ cup moong dal, 1 soft-cooked carrot (mashed), salt, cumin, ghee.\nMethod: Cook rice and dal together. Add mashed carrot and seasoning. Serve at warm (not hot) temperature.\n\nWhy it works: Single-pot meal means every bite has the same texture. Carrots add nutrition invisibly. This is a go-to recovery-day meal — familiar, warm, and low-effort for the parent too.`,
    tags: ["recipe", "lunch", "dinner", "one-pot", "soft-texture", "Indian", "recovery-day"],
  },
  {
    id: "recipe-banana-milkshake",
    category: "food_and_eating",
    intent: "parent_tip",
    triggers: ["hunger", "unmet_communication_need"],
    source_label: "Sensory-friendly nutrition guide",
    tone_reviewed: true,
    title: "Banana & Milk Smoothie",
    text: `A smooth-textured, nutrition-dense drink — good when solid food is being refused.\n\nIngredients: 1 ripe banana, 1 cup warm or cold milk (dairy or plant-based), optional: small spoon of peanut butter or dates.\nMethod: Blend until smooth. Serve at a consistent temperature in the same cup each time.\n\nWhy it works: When appetite is low or mealtime refusal is happening, a familiar-tasting drink in a predictable cup reduces negotiation. Banana provides energy and potassium. Consistent cup matters — use the same one every time.`,
    tags: ["recipe", "drink", "snack", "refusal", "soft-texture", "quick"],
  },
  {
    id: "recipe-curd-rice",
    category: "food_and_eating",
    intent: "parent_tip",
    triggers: ["overstimulation", "hunger", "tiredness"],
    source_label: "Sensory-friendly nutrition guide",
    tone_reviewed: true,
    title: "Curd Rice (Cooling Comfort)",
    text: `A cool, gentle, uniform-textured meal — especially good after a hot or overstimulating day.\n\nIngredients: 1 cup cooked white rice (slightly soft), ½ cup fresh curd/yoghurt, pinch of salt, optional: a few soft pomegranate seeds.\nMethod: Mix curd into slightly cooled rice. Serve at room temperature. Keep toppings minimal.\n\nWhy it works: Cooling effect of curd can feel soothing. Fermented yoghurt supports gut health. The cool, uniform texture is sensory-predictable. Works well as a dinner or late snack on emotionally heavy days.`,
    tags: ["recipe", "lunch", "dinner", "cool", "soft-texture", "Indian", "fermented"],
  },
  {
    id: "recipe-soft-upma",
    category: "food_and_eating",
    intent: "parent_tip",
    triggers: ["hunger", "schedule_change"],
    source_label: "Sensory-friendly nutrition guide",
    tone_reviewed: true,
    title: "Soft Rava Upma (Semolina Porridge)",
    text: `A warm, smooth savoury breakfast — consistent and filling.\n\nIngredients: ½ cup rava/semolina, 1.5 cups water, salt, ghee, cumin, optional: small pieces of soft-cooked carrot or peas (only if tolerated).\nMethod: Roast rava lightly, add seasoning and water, cook stirring until thick and soft. Serve warm in the same bowl every day.\n\nWhy it works: Warm, smooth-textured, and savoury — good for children who find sweet breakfasts overwhelming. Easy to adjust texture by adding more water. The ritual of the same bowl and same timing builds mealtime predictability.`,
    tags: ["recipe", "breakfast", "warm", "savoury", "soft-texture", "Indian"],
  },
  {
    id: "recipe-ragi-porridge",
    category: "food_and_eating",
    intent: "parent_tip",
    triggers: ["hunger", "tiredness"],
    source_label: "Sensory-friendly nutrition guide",
    tone_reviewed: true,
    title: "Ragi (Finger Millet) Porridge",
    text: `A nutrient-dense, smooth porridge — good for sleep-support and energy stability.\n\nIngredients: 2 tbsp ragi flour, 1.5 cups water or milk, jaggery or dates for sweetness.\nMethod: Mix ragi flour with cold water to form a smooth paste, then cook on low heat stirring constantly until thick. Add sweetener. Serve warm.\n\nWhy it works: Ragi is high in calcium and has a gentle, consistent texture. Some families observe that warm ragi in the evening helps support a smoother bedtime routine. The sweetness from jaggery is mild and natural.`,
    tags: ["recipe", "breakfast", "evening-snack", "sleep-support", "smooth", "Indian"],
  },
  {
    id: "recipe-poha",
    category: "food_and_eating",
    intent: "parent_tip",
    triggers: ["hunger", "transition"],
    source_label: "Sensory-friendly nutrition guide",
    tone_reviewed: true,
    title: "Soft Poha (Flattened Rice)",
    text: `A mild, soft, familiar breakfast that comes together in minutes.\n\nIngredients: 1 cup thick poha (rinsed until soft), salt, cumin, turmeric, a little oil, optional: peas or soft-cooked potato.\nMethod: Rinse poha until just soft. Cook seasoning in a little oil, add poha, mix gently. Serve warm.\n\nWhy it works: Poha has a gentle, non-sticky texture and mild flavour. Very quick to prepare — important on hard mornings. Keep it simple (fewer mix-ins) on difficult days.`,
    tags: ["recipe", "breakfast", "quick", "mild", "Indian"],
  },

  // ── BEHAVIORAL SUPPORT STRATEGIES ─────────────────────────────────────────
  {
    id: "bs-visual-schedule",
    category: "routine",
    intent: "parent_tip",
    triggers: ["schedule_change", "transition", "new_environment"],
    source_label: "Positive Behaviour Support Framework",
    tone_reviewed: true,
    title: "Visual Schedules as Predictability Anchors",
    text: "A visual schedule is one of the most evidence-supported tools in autism support. Even a simple sequence of 3-5 pictures showing morning steps (wake up → breakfast → get dressed → shoes on → leave) can dramatically reduce transition resistance. The schedule should be in a consistent place, at the child's eye level, and followed in the same order each day. On disrupted days, update the schedule together — this gives the child agency and advance warning.",
    tags: ["visual-schedule", "routine", "transition", "predictability", "morning"],
  },
  {
    id: "bs-first-then",
    category: "transitions",
    intent: "communication_idea",
    triggers: ["transition", "schedule_change"],
    source_label: "Applied Behaviour Analysis — positive support",
    tone_reviewed: true,
    title: "First-Then Boards for Transitions",
    text: "A first-then board uses two pictures: 'First [this]... then [preferred thing].' Example: 'First shoes on, then iPad.' This works because it gives the child clarity about what comes next and reduces the feeling that the preferred thing is being taken away forever. Keep the 'then' genuinely meaningful — it loses power if the reward isn't real. For non-verbal children, actual objects instead of pictures work even better.",
    tags: ["first-then", "transition", "visual-support", "communication", "ABA"],
  },
  {
    id: "bs-waiting-support",
    category: "communication",
    intent: "communication_idea",
    triggers: ["unmet_communication_need", "transition"],
    source_label: "AAC and communication support research",
    tone_reviewed: true,
    title: "Teaching 'Wait' with Visual Timers",
    text: "Waiting is one of the hardest skills for children with ADHD or autism because time is invisible and unpredictable. A visual timer (like Time Timer) makes time visible — the child can SEE how much is left. Pair the timer with a calm, consistent phrase: 'When the red is gone, we go.' Practice with very short waits (30 seconds) and build up. Never use waiting as a punishment.",
    tags: ["waiting", "visual-timer", "ADHD", "self-regulation", "communication"],
  },
  {
    id: "bs-sensory-breaks",
    category: "sensory_support",
    intent: "sensory_support",
    triggers: ["overstimulation", "noise", "crowd"],
    source_label: "Sensory Integration Theory — Jean Ayres",
    tone_reviewed: true,
    title: "Scheduled Sensory Breaks (Proactive, Not Reactive)",
    text: "The most effective sensory breaks are proactive — built into the schedule BEFORE overwhelm hits, not after. A child who gets a 10-minute movement break after lunch every day is less likely to melt down at 3pm. Movement breaks can include: jumping on a small trampoline, carrying heavy objects (like books), wall push-ups, or swinging. The 'heavy work' (proprioceptive input) is particularly organising for the nervous system.",
    tags: ["sensory-break", "movement", "proactive", "proprioception", "regulation"],
  },
  {
    id: "bs-calm-down-corner",
    category: "calming_activity",
    intent: "calming_activity",
    triggers: ["overstimulation", "unmet_communication_need"],
    source_label: "Positive Behaviour Support & OT practice",
    tone_reviewed: true,
    title: "Creating a Safe Calm-Down Corner at Home",
    text: "A calm-down corner is not a punishment space — it is a designated, safe, sensory-friendly spot the child can access any time they feel overwhelmed. Elements that work: a small tent or enclosed space, soft lighting, a weighted blanket or heavy cushions, a few familiar comfort objects, and 1-2 sensory tools (a fidget, putty, or headphones). The child should be introduced to it during calm times, not during meltdowns. Over time, they may learn to self-direct there.",
    tags: ["calm-corner", "safe-space", "sensory", "self-regulation", "home"],
  },
  {
    id: "bs-co-regulation",
    category: "parent_self_care",
    intent: "parent_tip",
    triggers: ["overstimulation", "unmet_communication_need", "tiredness"],
    source_label: "Polyvagal Theory & co-regulation research",
    tone_reviewed: true,
    title: "Co-Regulation: Your Calm is the Intervention",
    text: "Children with autism often have difficulty with self-regulation — they rely on the nervous systems of the adults around them. Research on polyvagal theory shows that a regulated, calm adult presence is one of the most powerful co-regulation tools available. Practically: slow your breathing, lower your voice to a soft, steady tone, reduce your body movement, and increase physical proximity (if welcomed). You don't have to say anything. Your nervous system state communicates directly to theirs.",
    tags: ["co-regulation", "polyvagal", "calm", "parent", "nervous-system"],
  },
  {
    id: "bs-meltdown-vs-tantrum",
    category: "meltdown_recovery",
    intent: "parent_tip",
    triggers: ["overstimulation", "unmet_communication_need"],
    source_label: "Autism specialist OT guidance",
    tone_reviewed: true,
    title: "Meltdowns vs Tantrums — A Critical Distinction",
    text: "Understanding this distinction changes everything. A tantrum is goal-directed — the child wants something and is communicating it. It stops when the goal is achieved or the audience leaves. A meltdown is neurological overwhelm — the child has lost the capacity to regulate. It is NOT manipulative. During a meltdown: reduce language (fewer words, calmer tone), reduce stimulation (dim lights, quieter space), don't try to reason or teach in the moment. After: offer comfort without questions. The learning happens later, when they're calm.",
    tags: ["meltdown", "tantrum", "distinction", "overwhelm", "recovery"],
  },
  {
    id: "bs-natural-consequences",
    category: "behavioral_support",
    intent: "parent_tip",
    triggers: ["schedule_change", "transition"],
    source_label: "Positive Behaviour Support",
    tone_reviewed: true,
    title: "Routines as Behaviour Support (Not Rules)",
    text: "The most effective behaviour support for autistic children isn't discipline — it's predictability. When a child knows exactly what happens next, the nervous system doesn't need to spend energy bracing for the unknown. Every routine you establish is a tiny stress reduction. Key principle: routines should be taught during calm moments, reviewed with visuals, and kept as consistent as possible. When changes are necessary, give advance notice, use visual supports, and allow extra recovery time.",
    tags: ["routine", "predictability", "behaviour-support", "stress-reduction"],
  },

  // ── COMMUNICATION SUPPORT ──────────────────────────────────────────────────
  {
    id: "comm-aac-intro",
    category: "communication",
    intent: "communication_idea",
    triggers: ["unmet_communication_need", "transition"],
    source_label: "AAC research — communication support",
    tone_reviewed: true,
    title: "AAC is Not a Last Resort — It's a Communication Tool",
    text: "Augmentative and Alternative Communication (AAC) includes picture cards, communication books, and apps like Proloquo2Go or LetMeTalk (free). Research consistently shows that introducing AAC does NOT stop verbal speech development — it often supports it. If your child struggles to express needs verbally, a simple low-tech option (even laminated pictures on a fridge) can dramatically reduce frustration and meltdowns. Start with the most urgent communications: hungry, water, help, stop, more.",
    tags: ["AAC", "communication", "picture-cards", "non-verbal", "frustration"],
  },
  {
    id: "comm-echolalia",
    category: "communication",
    intent: "parent_tip",
    triggers: ["unmet_communication_need"],
    source_label: "Speech-language pathology research",
    tone_reviewed: true,
    title: "Understanding Echolalia — It's Communication",
    text: "Echolalia — repeating phrases, scripts, or words — is a meaningful form of communication, not a sign that language is missing. Immediate echolalia (repeating what you just said) often means the child is processing or agreeing. Delayed echolalia (scripting from TV shows) is often used to communicate emotion or need. Instead of correcting echolalia, try to interpret its communicative function. A child who scripts 'time to go!' from a show when they want to leave is using language purposefully.",
    tags: ["echolalia", "scripting", "communication", "understanding", "language"],
  },
  {
    id: "comm-processing-time",
    category: "communication",
    intent: "communication_idea",
    triggers: ["unmet_communication_need", "overstimulation"],
    source_label: "Speech-language pathology practice",
    tone_reviewed: true,
    title: "The 10-Second Rule for Processing Time",
    text: "Many autistic children need significantly more processing time than neurotypical peers. After asking a question or giving an instruction, wait 10 full seconds before repeating. Resist the urge to rephrase or add more words — this resets the processing clock. Use fewer words overall: instead of 'Can you please put your shoes on now?' try 'Shoes on.' Short, clear, paired with a visual or gesture works best. This single change often dramatically improves communication success.",
    tags: ["processing-time", "communication", "instructions", "patience", "short-phrases"],
  },

  // ── SLEEP SUPPORT ──────────────────────────────────────────────────────────
  {
    id: "sleep-routine-science",
    category: "sleep",
    intent: "parent_tip",
    triggers: ["tiredness", "overstimulation", "schedule_change"],
    source_label: "Pediatric sleep research — autism",
    tone_reviewed: true,
    title: "Why Sleep Is Harder for Autistic Children (and What Helps)",
    text: "Sleep difficulties affect 50-80% of autistic children — and it is neurological, not behavioural defiance. Contributing factors include: melatonin regulation differences, sensory sensitivities to light/sound/touch, difficulty winding down the brain, and anxiety about tomorrow. What consistently helps: a fixed, predictable bedtime sequence (same 4-5 steps in the same order every night), blue-light reduction 1 hour before bed, blackout curtains, white noise, and a weighted blanket if the child tolerates it.",
    tags: ["sleep", "bedtime-routine", "melatonin", "sensory", "weighted-blanket"],
  },
  {
    id: "sleep-wind-down",
    category: "sleep",
    intent: "parent_tip",
    triggers: ["tiredness", "overstimulation"],
    source_label: "Pediatric sleep practice",
    tone_reviewed: true,
    title: "A 4-Step Bedtime Wind-Down Sequence",
    text: "Consistency is more important than perfection. A suggested sequence: (1) Bath or warm washcloth wipe-down — warmth signals the body that sleep is coming. (2) Dim lights in the bedroom 30 min before target sleep time. (3) One calm, predictable activity: a board book, soft music, or a comfort routine. (4) Same final phrase every night — something like 'Goodnight, I love you, see you in the morning.' The sequence doesn't need to be long — it needs to be the same.",
    tags: ["sleep", "bedtime", "wind-down", "sequence", "routine"],
  },

  // ── PARENT WELLBEING ───────────────────────────────────────────────────────
  {
    id: "parent-grief",
    category: "parent_self_care",
    intent: "parent_tip",
    triggers: ["tiredness", "overstimulation", "schedule_change"],
    source_label: "Parent wellbeing research — autism caregivers",
    tone_reviewed: true,
    title: "Parenting an Autistic Child — The Grief No One Talks About",
    text: "Many parents of autistic children carry a quiet grief — not for their child, but for the version of parenthood they imagined. Grief for lost sleep, for milestones that didn't arrive as expected, for the isolation of being the only one in the room who understands your child. This is real and valid. It doesn't mean you love your child any less. Acknowledging this grief — with a therapist, a support group, or even a journal — often frees energy that was being consumed by carrying it silently.",
    tags: ["grief", "parent-emotion", "support", "isolation", "identity"],
  },
  {
    id: "parent-burnout",
    category: "parent_self_care",
    intent: "parent_tip",
    triggers: ["tiredness", "overstimulation"],
    source_label: "Caregiver burnout research",
    tone_reviewed: true,
    title: "Recognising Caregiver Burnout Before It Peaks",
    text: "Caregiver burnout is not weakness — it is a predictable physiological response to sustained high-demand caregiving without adequate recovery. Early signs: emotional numbness, resentment, feeling that nothing you do is enough, chronic fatigue even after sleep, loss of enjoyment in things that used to help. If this sounds familiar: the most important thing you can do for your child is protect your own sustainability. Even 20 minutes of protected, uninterrupted time daily matters. Respite is not a luxury.",
    tags: ["burnout", "caregiver", "sustainability", "respite", "wellbeing"],
  },
  {
    id: "parent-celebrate-small",
    category: "parent_self_care",
    intent: "parent_tip",
    triggers: ["schedule_change", "transition"],
    source_label: "Strengths-based autism support",
    tone_reviewed: true,
    title: "The Art of Noticing Small Wins",
    text: "Progress with autistic children often happens in increments invisible to anyone but the parents. A new word. Eye contact held for two seconds. Food touched for the first time. Shoes put on without a fight. These moments are not small — they represent enormous neurological effort. Make a habit of noticing and naming them, even just to yourself. Over time, this practice protects against the despair of looking only at how far there is to go.",
    tags: ["progress", "celebration", "small-wins", "strengths", "perspective"],
  },

  // ── SENSORY ACTIVITIES ─────────────────────────────────────────────────────
  {
    id: "sensory-water-play",
    category: "sensory_support",
    intent: "calming_activity",
    triggers: ["overstimulation", "understimulation", "transition"],
    source_label: "OT sensory diet research",
    tone_reviewed: true,
    title: "Water Play as a Sensory Regulator",
    text: "Water play is one of the most universally accessible and effective sensory regulation tools. It provides tactile input (calming), proprioceptive input when pouring/splashing, and can be controlled by the child. Simple setups: a plastic tub with water and a few cups at the kitchen counter, bath play extended a few minutes, or outdoor water table. Some children need cooler water to feel alert; others need warm water to calm. Observe which your child prefers.",
    tags: ["water-play", "sensory", "calming", "tactile", "regulation"],
  },
  {
    id: "sensory-heavy-work",
    category: "sensory_support",
    intent: "sensory_support",
    triggers: ["overstimulation", "understimulation"],
    source_label: "Sensory Integration Therapy — OT practice",
    tone_reviewed: true,
    title: "Heavy Work Activities for Nervous System Organisation",
    text: "Proprioceptive input — also called 'heavy work' — is deeply organising for the nervous system. It helps both over- and under-stimulated children regulate. Examples at home: carrying a backpack with a few books, pushing a heavy laundry basket, pulling a wagon, jumping on a small indoor trampoline, wall push-ups, or kneading dough. Many OTs recommend 10-15 minutes of heavy work before challenging transitions, meals, or bedtime.",
    tags: ["proprioception", "heavy-work", "regulation", "OT", "movement"],
  },
  {
    id: "sensory-outdoor",
    category: "sensory_support",
    intent: "calming_activity",
    triggers: ["overstimulation", "understimulation", "transition"],
    source_label: "Nature-based therapy research",
    tone_reviewed: true,
    title: "The Regulating Power of Outdoor Time",
    text: "Natural environments offer a fundamentally different sensory experience than indoor spaces. Research consistently shows outdoor time reduces cortisol (stress hormone) levels and improves regulation in autistic children. Key elements: natural light supports circadian rhythms and mood; irregular natural surfaces (grass, sand, gravel) provide varied proprioceptive input; and the openness reduces the trapped feeling of crowded indoor spaces. Even 15 minutes of outside time daily, in a predictable safe space, makes a measurable difference.",
    tags: ["outdoor", "nature", "regulation", "cortisol", "sunlight"],
  },
];

export function findRelevantBookSnippets(query: string, limit = 3): SupportSnippet[] {
  const queryLower = query.toLowerCase();

  return BOOK_SNIPPETS.map((snippet) => {
    let score = 0;

    for (const trigger of snippet.triggers) {
      if (queryLower.includes(trigger.replace("_", " "))) score += 5;
      if (queryLower.includes(trigger)) score += 5;
    }

    const tags = snippet.tags ?? [];
    for (const tag of tags) {
      if (queryLower.includes(tag.replace("-", " "))) score += 4;
    }

    if (snippet.text.toLowerCase().split(" ").some((w) => w.length > 4 && queryLower.includes(w))) {
      score += 2;
    }

    if (queryLower.includes(snippet.category.replace("_", " "))) score += 3;
    if ((snippet.title ?? "").toLowerCase().split(/\s+/).some((w: string) => w.length > 3 && queryLower.includes(w))) {
      score += 2;
    }

    return { snippet, score };
  })
    .filter((item) => item.score > 0 && item.snippet.tone_reviewed)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.snippet);
}
