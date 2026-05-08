import type { SafetyAssessment } from "@/types";

const CRISIS_PATTERNS = [
  /\bkill myself\b/i,
  /\bend my life\b/i,
  /\bsuicid(e|al)\b/i,
  /\bhurt myself\b/i,
  /\bhurt my child\b/i,
  /\bharm my child\b/i,
  /\bcan't go on\b/i,
];

const DIAGNOSIS_PATTERNS = [
  /\bdiagnos(e|is|ed|ing)\b/i,
  /\bis (he|she|my child|.*) autistic\b/i,
  /\bdoes (he|she|my child|.*) have autism\b/i,
  /\badhd diagnosis\b/i,
];

const MEDICATION_PATTERNS = [
  /\bmedicat(e|ion|ions)\b/i,
  /\bdosage\b/i,
  /\bsupplement(s)?\b/i,
  /\bprescription\b/i,
  /\bmelatonin\b/i,
  /\bssri\b/i,
  /\bantipsychotic\b/i,
];

const MEDICAL_PATTERNS = [
  /\btreatment plan\b/i,
  /\bmedical advice\b/i,
  /\bdoctor\b/i,
  /\bpediatrician\b/i,
  /\bseizure\b/i,
  /\ballergy\b/i,
  /\bfever\b/i,
];

const CURE_PATTERNS = [
  /\bcure autism\b/i,
  /\bautism cure\b/i,
  /\breversal\b/i,
  /\breverse autism\b/i,
  /\brecover from autism\b/i,
  /\bfix autism\b/i,
  /\bdetox\b/i,
];

export function assessSafety(input: string): SafetyAssessment {
  const normalized = input.toLowerCase();

  if (matchesAny(input, CRISIS_PATTERNS)) {
    return {
      category: "crisis",
      blocked: true,
      reason: "Possible self-harm or harm-to-child language.",
      response:
        "I am really glad you said this out loud. This sounds urgent, and you deserve immediate human support right now.\n\nIf you might hurt yourself or your child, call emergency services now. In the U.S., you can call or text 988 for the Suicide & Crisis Lifeline, or text HOME to 741741 for the Crisis Text Line. If you are outside the U.S., contact your local emergency number or go to the nearest emergency department.\n\nDAYA can stay with you for emotional support, but this moment needs a real person with you immediately.",
    };
  }

  if (
    matchesAny(input, CURE_PATTERNS) ||
    (/\b(cure|fix|reverse|reversal|recover|detox)\b/i.test(normalized) &&
      /\b(autism|autistic|adhd|neurodivergent)\b/i.test(normalized))
  ) {
    return {
      category: "cure_claim",
      blocked: true,
      reason: "Cure or reversal framing is outside DAYA's safe scope.",
      response:
        "I cannot help with autism cure or reversal claims. DAYA is here for observation, memory, and parent support, not treatment promises.\n\nWhat I can do is help you notice patterns around sleep, sensory overload, routines, communication, food, and hard moments, then offer gentle non-medical ideas some families find supportive.",
    };
  }

  if (matchesAny(input, DIAGNOSIS_PATTERNS)) {
    return {
      category: "diagnosis",
      blocked: true,
      reason: "Diagnosis request.",
      response:
        "I cannot diagnose or confirm a condition. That belongs with a qualified clinician who can evaluate the whole child.\n\nI can help you organize observations in a clear, calm way so you have better notes to share with a pediatrician, developmental specialist, therapist, or school support team.",
    };
  }

  if (matchesAny(input, MEDICATION_PATTERNS)) {
    return {
      category: "medication",
      blocked: true,
      reason: "Medication or supplement guidance request.",
      response:
        "I cannot recommend medications, supplements, or dosages. Those decisions need a pediatrician or specialist who knows your child directly.\n\nIf you want, I can help track what you are observing before and after sleep changes, meals, routines, or stressful events so the conversation with your clinician is more grounded.",
    };
  }

  if (matchesAny(input, MEDICAL_PATTERNS)) {
    return {
      category: "medical",
      blocked: false,
      reason: "Health-adjacent language; keep disclaimer active.",
    };
  }

  return { category: "none", blocked: false };
}

export function safetyInstruction(assessment: SafetyAssessment): string {
  if (assessment.category === "none") return "";

  return `\n\nACTIVE SAFETY CONTEXT:
- Safety category: ${assessment.category}
- Never diagnose, prescribe, promise treatment, or validate cure/reversal framing.
- If responding, keep the response supportive, brief, and within observation/parent-support scope.`;
}

function matchesAny(input: string, patterns: RegExp[]) {
  return patterns.some((pattern) => pattern.test(input));
}
