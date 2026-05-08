export type School = {
  id: string;
  name: string;
  image: string;
  autismSupportLevel: "Basic" | "Intermediate" | "Advanced" | "Specialized";
  therapiesAvailable: string[];
  rating: number;
  reviewCount: number;
  location: string;
  fees: string;
  facilities: string[];
  phone: string;
  description: string;
};

export type Therapist = {
  id: string;
  name: string;
  image: string;
  specialization: string;
  credentials: string;
  rating: number;
  reviewCount: number;
  experience: string;
  consultationFee: string;
  languages: string[];
  location: string;
  availableSlots: string[];
  bio: string;
};

export type ShadowTeacher = {
  id: string;
  name: string;
  image: string;
  experience: string;
  specializations: string[];
  languages: string[];
  location: string;
  phone: string;
  availability: string;
  hourlyRate: string;
  bio: string;
  rating: number;
};

export type Community = {
  id: string;
  name: string;
  emoji: string;
  description: string;
  members: number;
  category: "support_circle" | "workshop" | "webinar" | "discussion";
  schedule: string;
  facilitator: string;
  price: string;
  tags: string[];
};

export const SCHOOLS: School[] = [
  {
    id: "s1",
    name: "Little Stars Inclusive Academy",
    image: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=400&h=260&fit=crop",
    autismSupportLevel: "Specialized",
    therapiesAvailable: ["ABA Therapy", "Speech Therapy", "Occupational Therapy", "Sensory Integration"],
    rating: 4.8,
    reviewCount: 124,
    location: "Indiranagar, Bangalore",
    fees: "₹25,000/month",
    facilities: ["Sensory Room", "Speech Lab", "Small Class Sizes", "Shadow Teacher Support", "Parent Counseling"],
    phone: "+91 98765 43210",
    description: "A fully inclusive school designed for neurodiverse children with individualized learning plans and on-site therapy support.",
  },
  {
    id: "s2",
    name: "Sunbeam Special Needs School",
    image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=260&fit=crop",
    autismSupportLevel: "Advanced",
    therapiesAvailable: ["Speech Therapy", "Occupational Therapy", "Music Therapy"],
    rating: 4.6,
    reviewCount: 89,
    location: "Koramangala, Bangalore",
    fees: "₹20,000/month",
    facilities: ["Sensory Garden", "Therapy Rooms", "Adaptive PE", "Visual Schedules"],
    phone: "+91 98765 43211",
    description: "Focused on holistic development with small student-teacher ratios and evidence-based interventions.",
  },
  {
    id: "s3",
    name: "Rainbow Bridge Learning Center",
    image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400&h=260&fit=crop",
    autismSupportLevel: "Advanced",
    therapiesAvailable: ["ABA Therapy", "Speech Therapy", "Play Therapy", "Art Therapy"],
    rating: 4.7,
    reviewCount: 156,
    location: "HSR Layout, Bangalore",
    fees: "₹22,000/month",
    facilities: ["Calm Room", "Structured Play Area", "Communication Lab", "Parent Training"],
    phone: "+91 98765 43212",
    description: "A warm, structured learning environment combining academic growth with behavioral and communication support.",
  },
  {
    id: "s4",
    name: "Greenfield Inclusive School",
    image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=400&h=260&fit=crop",
    autismSupportLevel: "Intermediate",
    therapiesAvailable: ["Speech Therapy", "Occupational Therapy"],
    rating: 4.4,
    reviewCount: 67,
    location: "Whitefield, Bangalore",
    fees: "₹18,000/month",
    facilities: ["Resource Room", "Visual Schedules", "Buddy System", "Flexible Testing"],
    phone: "+91 98765 43213",
    description: "Mainstream school with dedicated inclusion support, resource rooms, and trained special educators.",
  },
  {
    id: "s5",
    name: "Bright Minds Autism Center",
    image: "https://images.unsplash.com/photo-1577896851231-70ef18881754?w=400&h=260&fit=crop",
    autismSupportLevel: "Specialized",
    therapiesAvailable: ["ABA Therapy", "Speech Therapy", "OT", "Social Skills Groups", "Feeding Therapy"],
    rating: 4.9,
    reviewCount: 203,
    location: "Jayanagar, Bangalore",
    fees: "₹35,000/month",
    facilities: ["1:1 Support", "Sensory Gym", "Communication Devices", "Transition Planning", "Family Therapy"],
    phone: "+91 98765 43214",
    description: "A premier autism-specific center offering intensive individualized programs with certified ABA therapists.",
  },
  {
    id: "s6",
    name: "Harmony World School",
    image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=400&h=260&fit=crop",
    autismSupportLevel: "Intermediate",
    therapiesAvailable: ["Speech Therapy", "Music Therapy", "Art Therapy"],
    rating: 4.3,
    reviewCount: 45,
    location: "Electronic City, Bangalore",
    fees: "₹15,000/month",
    facilities: ["Inclusive Classrooms", "Counseling", "Flexible Curriculum"],
    phone: "+91 98765 43215",
    description: "An inclusive mainstream school with a dedicated special education department and trained support staff.",
  },
  {
    id: "s7",
    name: "Lotus Petal Special Academy",
    image: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=400&h=260&fit=crop",
    autismSupportLevel: "Specialized",
    therapiesAvailable: ["Speech Therapy", "Occupational Therapy", "Play Therapy"],
    rating: 4.8,
    reviewCount: 112,
    location: "Malleswaram, Bangalore",
    fees: "₹24,000/month",
    facilities: ["Sensory Gym", "Life Skills Lab", "Small Class Sizes"],
    phone: "+91 98765 43216",
    description: "Empowering children on the spectrum with a focus on functional independence and life skills.",
  },
  {
    id: "s8",
    name: "Sparsh Inclusive Academy",
    image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=260&fit=crop",
    autismSupportLevel: "Advanced",
    therapiesAvailable: ["ABA Therapy", "Occupational Therapy"],
    rating: 4.5,
    reviewCount: 94,
    location: "Banashankari, Bangalore",
    fees: "₹19,000/month",
    facilities: ["Visual Schedules", "Therapy Rooms", "Parent Support Groups"],
    phone: "+91 98765 43217",
    description: "A nurturing environment that balances academic achievement with deep emotional and behavioral support.",
  }
];

export const THERAPISTS: Therapist[] = [
  {
    id: "t1",
    name: "Dr. Priya Menon",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&h=200&fit=crop&crop=face",
    specialization: "Developmental Pediatrician",
    credentials: "MD Pediatrics, Fellowship in Developmental Medicine",
    rating: 4.9,
    reviewCount: 312,
    experience: "15 years",
    consultationFee: "₹1,500",
    languages: ["English", "Hindi", "Kannada"],
    location: "Indiranagar, Bangalore",
    availableSlots: ["Mon 10:00 AM", "Mon 2:00 PM", "Wed 11:00 AM", "Fri 10:00 AM", "Fri 3:00 PM"],
    bio: "Specializes in early autism diagnosis, developmental assessments, and parent-guided interventions. Warm, patient approach.",
  },
  {
    id: "t2",
    name: "Anika Sharma",
    image: "https://images.unsplash.com/photo-1594824476967-48c8b964ac31?w=200&h=200&fit=crop&crop=face",
    specialization: "Speech & Language Therapist",
    credentials: "M.Sc Speech-Language Pathology, RCI Licensed",
    rating: 4.8,
    reviewCount: 189,
    experience: "8 years",
    consultationFee: "₹800",
    languages: ["English", "Hindi"],
    location: "Koramangala, Bangalore",
    availableSlots: ["Tue 9:00 AM", "Tue 1:00 PM", "Thu 10:00 AM", "Thu 3:00 PM", "Sat 10:00 AM"],
    bio: "Expert in augmentative communication, PECS, and naturalistic language interventions for non-verbal and minimally verbal children.",
  },
  {
    id: "t3",
    name: "Rohan Kapoor",
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&h=200&fit=crop&crop=face",
    specialization: "Occupational Therapist",
    credentials: "MOT, Sensory Integration Certified",
    rating: 4.7,
    reviewCount: 145,
    experience: "10 years",
    consultationFee: "₹1,000",
    languages: ["English", "Hindi", "Tamil"],
    location: "HSR Layout, Bangalore",
    availableSlots: ["Mon 9:00 AM", "Wed 2:00 PM", "Thu 11:00 AM", "Fri 9:00 AM", "Sat 11:00 AM"],
    bio: "Focuses on sensory processing, fine motor development, and daily living skills. Uses play-based and child-led approaches.",
  },
  {
    id: "t4",
    name: "Dr. Meera Nair",
    image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=200&h=200&fit=crop&crop=face",
    specialization: "Child Psychologist",
    credentials: "Ph.D Clinical Psychology, RCI Licensed",
    rating: 4.9,
    reviewCount: 267,
    experience: "12 years",
    consultationFee: "₹1,200",
    languages: ["English", "Malayalam", "Hindi"],
    location: "Jayanagar, Bangalore",
    availableSlots: ["Mon 11:00 AM", "Tue 3:00 PM", "Wed 10:00 AM", "Thu 2:00 PM", "Fri 11:00 AM"],
    bio: "Specializes in behavioral assessment, parent training, and emotional regulation strategies for children on the spectrum.",
  },
  {
    id: "t5",
    name: "Kavitha Reddy",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&crop=face",
    specialization: "ABA Therapist",
    credentials: "BCBA Certified, M.Ed Special Education",
    rating: 4.8,
    reviewCount: 198,
    experience: "9 years",
    consultationFee: "₹1,200",
    languages: ["English", "Telugu", "Kannada"],
    location: "Whitefield, Bangalore",
    availableSlots: ["Tue 10:00 AM", "Wed 9:00 AM", "Thu 1:00 PM", "Fri 2:00 PM", "Sat 9:00 AM"],
    bio: "Board-certified behavior analyst specializing in naturalistic ABA, social skills training, and school readiness programs.",
  },
  {
    id: "t6",
    name: "Arjun Iyer",
    image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=200&h=200&fit=crop&crop=face",
    specialization: "Music Therapist",
    credentials: "MA Music Therapy, Nordoff-Robbins Certified",
    rating: 4.6,
    reviewCount: 87,
    experience: "6 years",
    consultationFee: "₹600",
    languages: ["English", "Hindi", "Kannada"],
    location: "JP Nagar, Bangalore",
    availableSlots: ["Mon 3:00 PM", "Wed 11:00 AM", "Fri 10:00 AM", "Sat 2:00 PM"],
    bio: "Uses music as a bridge to communication, emotional expression, and social connection for children with autism.",
  },
  {
    id: "t7",
    name: "Aditya Verma",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&crop=face",
    specialization: "Occupational Therapist",
    credentials: "MOT, Play Therapy Expert",
    rating: 4.8,
    reviewCount: 120,
    experience: "7 years",
    consultationFee: "₹900",
    languages: ["English", "Hindi", "Marathi"],
    location: "Malleswaram, Bangalore",
    availableSlots: ["Tue 4:00 PM", "Thu 4:00 PM", "Sat 10:00 AM", "Sun 11:00 AM"],
    bio: "Highly engaging therapist with a focus on fine motor skills and school adaptation for younger children.",
  },
  {
    id: "t8",
    name: "Smriti Desai",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face",
    specialization: "Speech & Language Therapist",
    credentials: "M.Sc Speech-Language Pathology",
    rating: 4.9,
    reviewCount: 245,
    experience: "11 years",
    consultationFee: "₹1,100",
    languages: ["English", "Gujarati", "Hindi"],
    location: "BTM Layout, Bangalore",
    availableSlots: ["Mon 9:00 AM", "Wed 10:00 AM", "Fri 4:00 PM"],
    bio: "Focused on early intervention and helping children develop functional communication strategies in their home environment.",
  }
];

export const SHADOW_TEACHERS: ShadowTeacher[] = [
  {
    id: "st1",
    name: "Divya Krishnan",
    image: "https://images.unsplash.com/photo-1580894732444-8ecded7900cd?w=200&h=200&fit=crop&crop=face",
    experience: "5 years with ASD children",
    specializations: ["ABA Support", "Visual Schedules", "Social Skills", "Classroom Inclusion"],
    languages: ["English", "Hindi", "Kannada"],
    location: "Indiranagar, Bangalore",
    phone: "+91 98765 11111",
    availability: "Full-time (Mon-Fri, 8AM-2PM)",
    hourlyRate: "₹250/hour",
    bio: "Experienced shadow teacher trained in ABA principles, skilled at helping children navigate mainstream classroom environments.",
    rating: 4.8,
  },
  {
    id: "st2",
    name: "Pradeep Gowda",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
    experience: "7 years with special needs children",
    specializations: ["Behavior Management", "Sensory Support", "Communication Aids"],
    languages: ["English", "Kannada", "Tamil"],
    location: "Koramangala, Bangalore",
    phone: "+91 98765 22222",
    availability: "Full-time or Part-time",
    hourlyRate: "₹300/hour",
    bio: "Patient and experienced educator with a deep understanding of sensory challenges. Trained in PECS and visual communication.",
    rating: 4.7,
  },
  {
    id: "st3",
    name: "Sneha Patel",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=face",
    experience: "4 years with autism support",
    specializations: ["Play-Based Learning", "Routine Building", "Emotional Regulation"],
    languages: ["English", "Hindi", "Gujarati"],
    location: "HSR Layout, Bangalore",
    phone: "+91 98765 33333",
    availability: "Part-time (Mon-Fri, 9AM-1PM)",
    hourlyRate: "₹200/hour",
    bio: "Focuses on building trust and connection with children, helping them feel safe and supported in school settings.",
    rating: 4.9,
  },
  {
    id: "st4",
    name: "Mohammed Faisal",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face",
    experience: "6 years in inclusive education",
    specializations: ["Transition Support", "Academic Adaptation", "Motor Skills Support"],
    languages: ["English", "Hindi", "Urdu", "Kannada"],
    location: "Whitefield, Bangalore",
    phone: "+91 98765 44444",
    availability: "Full-time (flexible hours)",
    hourlyRate: "₹250/hour",
    bio: "Specializes in helping children transition between activities and environments with minimal stress.",
    rating: 4.6,
  },
  {
    id: "st5",
    name: "Neha Joshi",
    image: "https://images.unsplash.com/photo-1548142813-c348350df52b?w=200&h=200&fit=crop&crop=face",
    experience: "3 years in special ed",
    specializations: ["Early Childhood Support", "Play Therapy", "Visual Aides"],
    languages: ["English", "Hindi", "Marathi"],
    location: "Banashankari, Bangalore",
    phone: "+91 98765 55555",
    availability: "Part-time (Afternoons)",
    hourlyRate: "₹180/hour",
    bio: "Enthusiastic and loving educator who uses creative arts and play to keep children engaged in the classroom.",
    rating: 4.5,
  },
  {
    id: "st6",
    name: "Ravi Kumar",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face",
    experience: "8 years with ASD & ADHD",
    specializations: ["Behavioral Redirection", "Academic Assistance"],
    languages: ["English", "Telugu", "Hindi"],
    location: "Electronic City, Bangalore",
    phone: "+91 98765 66666",
    availability: "Full-time",
    hourlyRate: "₹300/hour",
    bio: "Calm and composed presence, adept at anticipating triggers and managing emotional outbursts before they escalate.",
    rating: 4.8,
  }
];

export const COMMUNITIES: Community[] = [
  {
    id: "c1",
    name: "Autism Moms Circle",
    emoji: "💛",
    description: "A safe, judgment-free space for mothers of autistic children to share experiences, celebrate wins, and support each other through hard days.",
    members: 342,
    category: "support_circle",
    schedule: "Every Saturday, 10:00 AM - 11:30 AM",
    facilitator: "Dr. Meera Nair",
    price: "Free",
    tags: ["emotional support", "peer connection", "parenting"],
  },
  {
    id: "c2",
    name: "Sensory Support Community",
    emoji: "🌊",
    description: "Learn practical strategies for managing sensory overload, creating calming spaces, and supporting your child through sensory challenges.",
    members: 218,
    category: "support_circle",
    schedule: "Every Wednesday, 7:00 PM - 8:00 PM",
    facilitator: "Rohan Kapoor, OT",
    price: "Free",
    tags: ["sensory", "occupational therapy", "home strategies"],
  },
  {
    id: "c3",
    name: "Parenting for Non-Verbal Kids",
    emoji: "🗣️",
    description: "Communication strategies, AAC tools, and emotional connection techniques for parents of non-verbal or minimally verbal children.",
    members: 156,
    category: "discussion",
    schedule: "Every Tuesday, 6:00 PM - 7:00 PM",
    facilitator: "Anika Sharma, SLP",
    price: "Free",
    tags: ["communication", "AAC", "non-verbal"],
  },
  {
    id: "c4",
    name: "Understanding Meltdowns",
    emoji: "🧠",
    description: "A workshop series on understanding the neuroscience behind meltdowns, identifying triggers, and building recovery routines.",
    members: 289,
    category: "workshop",
    schedule: "May 15, 2026 — 10:00 AM to 12:00 PM",
    facilitator: "Dr. Priya Menon",
    price: "₹300",
    tags: ["meltdowns", "behavior", "neuroscience"],
  },
  {
    id: "c5",
    name: "Sleep Solutions Workshop",
    emoji: "🌙",
    description: "Evidence-based strategies for improving sleep quality, bedtime routines, and managing night waking for autistic children.",
    members: 194,
    category: "workshop",
    schedule: "May 22, 2026 — 7:00 PM to 8:30 PM",
    facilitator: "Dr. Meera Nair",
    price: "₹250",
    tags: ["sleep", "routines", "bedtime"],
  },
  {
    id: "c6",
    name: "School Readiness Webinar",
    emoji: "🎒",
    description: "Preparing your child for school entry — from choosing the right school to working with shadow teachers and building classroom tolerance.",
    members: 167,
    category: "webinar",
    schedule: "May 28, 2026 — 11:00 AM to 12:30 PM",
    facilitator: "Kavitha Reddy, BCBA",
    price: "₹200",
    tags: ["school", "inclusion", "transition"],
  },
  {
    id: "c7",
    name: "Fathers of Autistic Children",
    emoji: "💙",
    description: "A dedicated space for dads to connect, share challenges, and learn from each other's experiences raising autistic children.",
    members: 128,
    category: "support_circle",
    schedule: "Every Sunday, 9:00 AM - 10:00 AM",
    facilitator: "Arjun Iyer",
    price: "Free",
    tags: ["fathers", "emotional support", "parenting"],
  },
  {
    id: "c8",
    name: "Feeding & Mealtime Strategies",
    emoji: "🍽️",
    description: "Practical approaches to picky eating, food sensitivities, and creating stress-free mealtimes for the whole family.",
    members: 231,
    category: "workshop",
    schedule: "June 5, 2026 — 6:00 PM to 7:30 PM",
    facilitator: "Rohan Kapoor, OT",
    price: "₹350",
    tags: ["food", "sensory", "mealtimes"],
  },
  {
    id: "c9",
    name: "Navigating IEPs in India",
    emoji: "📜",
    description: "A comprehensive guide to understanding and advocating for your child's Individualized Education Program in mainstream schools.",
    members: 412,
    category: "webinar",
    schedule: "June 10, 2026 — 11:00 AM to 1:00 PM",
    facilitator: "Dr. Priya Menon",
    price: "₹150",
    tags: ["education", "IEP", "advocacy"],
  },
  {
    id: "c10",
    name: "Sibling Support Group",
    emoji: "👧👦",
    description: "A fun and supportive online circle designed specifically for the neurotypical siblings of children on the spectrum.",
    members: 95,
    category: "support_circle",
    schedule: "Every First Saturday, 4:00 PM - 5:00 PM",
    facilitator: "Sneha Patel",
    price: "Free",
    tags: ["siblings", "family dynamics", "emotional support"],
  }
];
