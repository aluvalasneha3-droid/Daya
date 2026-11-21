export type Therapist = {
  id: string;
  name: string;
  specialization: string;
  experienceYears: number;
  rating: number;
  reviewsCount: number;
  fees: string;
  availability: string[];
  imageUrl: string;
  about: string;
};

export type School = {
  id: string;
  name: string;
  autismSupportLevel: "High" | "Moderate" | "Inclusive";
  therapiesAvailable: string[];
  location: string;
  fees: string;
  rating: number;
  facilities: string[];
  imageUrl: string;
  about: string;
};

export type ShadowTeacher = {
  id: string;
  name: string;
  experienceYears: number;
  languages: string[];
  availability: "Full-Time" | "Part-Time" | "Hourly";
  hourlyRate: string;
  rating: number;
  imageUrl: string;
  about: string;
};

export type CommunityWorkshop = {
  id: string;
  title: string;
  host: string;
  date: string;
  time: string;
  attendees: number;
  category: string;
  imageUrl: string;
  description: string;
};

export const therapists: Therapist[] = [
  {
    id: "t1",
    name: "Dr. Priya Menon",
    specialization: "Pediatric Occupational Therapist",
    experienceYears: 12,
    rating: 4.9,
    reviewsCount: 124,
    fees: "₹1,200 / session",
    availability: ["Monday 10:00 AM", "Wednesday 2:00 PM", "Friday 9:00 AM"],
    imageUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&q=80",
    about: "Specializes in sensory integration therapy and fine motor skill development for autistic children. Focuses on play-based interventions.",
  },
  {
    id: "t2",
    name: "Rohan Kapoor, SLP",
    specialization: "Speech & Language Pathologist",
    experienceYears: 8,
    rating: 4.8,
    reviewsCount: 89,
    fees: "₹900 / session",
    availability: ["Tuesday 11:00 AM", "Thursday 4:00 PM"],
    imageUrl: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&q=80",
    about: "Expert in AAC (Augmentative and Alternative Communication) devices and gestalt language processing.",
  },
  {
    id: "t3",
    name: "Dr. Ananya Reddy",
    specialization: "Behavioral Psychologist",
    experienceYears: 15,
    rating: 5.0,
    reviewsCount: 210,
    fees: "₹1,500 / session",
    availability: ["Monday 1:00 PM", "Friday 3:00 PM"],
    imageUrl: "https://images.unsplash.com/photo-1594824436951-7f126f59ccb2?w=400&q=80",
    about: "Focuses on parent coaching and co-regulation strategies to manage severe meltdowns and anxiety.",
  },
  {
    id: "t4",
    name: "Dr. Kavitha Sundaram",
    specialization: "Developmental Pediatrician",
    experienceYears: 18,
    rating: 4.9,
    reviewsCount: 312,
    fees: "₹2,000 / session",
    availability: ["Monday 9:00 AM", "Wednesday 11:00 AM", "Saturday 10:00 AM"],
    imageUrl: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&q=80",
    about: "NIMHANS-trained developmental pediatrician specializing in early diagnosis and comprehensive developmental assessments for children aged 1-8.",
  },
  {
    id: "t5",
    name: "Meera Nair, MOT",
    specialization: "Sensory Integration Therapist",
    experienceYears: 7,
    rating: 4.7,
    reviewsCount: 76,
    fees: "₹1,000 / session",
    availability: ["Tuesday 9:30 AM", "Thursday 2:00 PM", "Saturday 11:00 AM"],
    imageUrl: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400&q=80",
    about: "Specializes in Ayres Sensory Integration® and creating sensory diets for children with processing differences. Expert in deep pressure and vestibular work.",
  },
  {
    id: "t6",
    name: "Dr. Vikram Joshi",
    specialization: "Child Psychiatrist",
    experienceYears: 20,
    rating: 4.8,
    reviewsCount: 198,
    fees: "₹2,500 / session",
    availability: ["Wednesday 10:00 AM", "Friday 2:00 PM"],
    imageUrl: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&q=80",
    about: "Expert in medication management for co-occurring anxiety, ADHD, and sleep disorders in autistic children. Conservative, evidence-based approach.",
  },
  {
    id: "t7",
    name: "Lakshmi Iyer, BCBA",
    specialization: "Applied Behavior Analyst",
    experienceYears: 10,
    rating: 4.6,
    reviewsCount: 94,
    fees: "₹1,300 / session",
    availability: ["Monday 3:00 PM", "Wednesday 4:00 PM", "Friday 10:00 AM"],
    imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80",
    about: "Naturalistic ABA with a focus on play skills, social communication, and reducing challenging behaviors through positive reinforcement.",
  },
  {
    id: "t8",
    name: "Arjun Desai, MPT",
    specialization: "Pediatric Physiotherapist",
    experienceYears: 6,
    rating: 4.9,
    reviewsCount: 65,
    fees: "₹800 / session",
    availability: ["Tuesday 10:00 AM", "Thursday 3:30 PM", "Saturday 9:00 AM"],
    imageUrl: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&q=80",
    about: "Focused on gross motor development, coordination, and body awareness for neurodiverse children. Uses yoga-based therapy approaches.",
  },
];

export const schools: School[] = [
  {
    id: "s1",
    name: "Little Stars Inclusive Academy",
    autismSupportLevel: "High",
    therapiesAvailable: ["Occupational Therapy", "Speech Therapy", "Music Therapy"],
    location: "Indiranagar, Bangalore",
    fees: "₹25,000 / month",
    rating: 4.9,
    facilities: ["Sensory Room", "Quiet Zones", "Fenced Playground"],
    imageUrl: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=400&q=80",
    about: "A fully integrated school providing 1:1 support ratios and embedded therapy throughout the academic day.",
  },
  {
    id: "s2",
    name: "Sunbeam Special Needs School",
    autismSupportLevel: "Inclusive",
    therapiesAvailable: ["Speech Therapy (Weekly)"],
    location: "Koramangala, Bangalore",
    fees: "Public (Free)",
    rating: 4.5,
    facilities: ["Resource Room", "Inclusive Playground"],
    imageUrl: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&q=80",
    about: "A neuro-inclusive school with dedicated special education resource teachers and pull-out therapy sessions.",
  },
  {
    id: "s3",
    name: "Samvedna Learning Centre",
    autismSupportLevel: "High",
    therapiesAvailable: ["OT", "Speech Therapy", "Art Therapy", "Social Skills Groups"],
    location: "Jubilee Hills, Hyderabad",
    fees: "₹30,000 / month",
    rating: 4.8,
    facilities: ["Sensory Gym", "Communication Lab", "Therapeutic Garden", "Visual Schedule System"],
    imageUrl: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400&q=80",
    about: "Hyderabad's premier autism-focused learning centre with small class sizes (max 6), individualized learning plans, and daily therapy integration.",
  },
  {
    id: "s4",
    name: "Asha Vidyalaya",
    autismSupportLevel: "Moderate",
    therapiesAvailable: ["Speech Therapy", "Counseling"],
    location: "Anna Nagar, Chennai",
    fees: "₹18,000 / month",
    rating: 4.6,
    facilities: ["Resource Room", "Quiet Corner", "Visual Schedule Boards"],
    imageUrl: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=400&q=80",
    about: "An inclusive school that pairs neurotypical and neurodivergent children in buddy programs. Strong parent involvement culture.",
  },
  {
    id: "s5",
    name: "Rainbow Bridge Academy",
    autismSupportLevel: "High",
    therapiesAvailable: ["OT", "Speech", "Music Therapy", "Equine Therapy"],
    location: "Whitefield, Bangalore",
    fees: "₹35,000 / month",
    rating: 5.0,
    facilities: ["Sensory Room", "Therapy Pool", "Art Studio", "Outdoor Sensory Trail"],
    imageUrl: "https://images.unsplash.com/photo-1588075592446-265fd1e6e76f?w=400&q=80",
    about: "A nature-based autism school with integrated equine and aquatic therapy programs. Emphasizes regulation, connection, and joy-based learning.",
  },
  {
    id: "s6",
    name: "Delhi Public School (Inclusive Wing)",
    autismSupportLevel: "Inclusive",
    therapiesAvailable: ["Resource Room Support", "Social Skills Group"],
    location: "Gachibowli, Hyderabad",
    fees: "₹22,000 / month",
    rating: 4.4,
    facilities: ["Dedicated Resource Room", "Shadow Teacher Support", "Modified Curriculum"],
    imageUrl: "https://images.unsplash.com/photo-1580894894513-541e068a3e2b?w=400&q=80",
    about: "Mainstream school with a well-established inclusive education program. Allows shadow teachers and provides curriculum modifications.",
  },
];

export const shadowTeachers: ShadowTeacher[] = [
  {
    id: "st1",
    name: "Sneha Patel",
    experienceYears: 5,
    languages: ["English", "Hindi"],
    availability: "Full-Time",
    hourlyRate: "₹300 / hr",
    rating: 4.8,
    imageUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80",
    about: "Patient and experienced shadow teacher with a background in special education. Trained in crisis de-escalation.",
  },
  {
    id: "st2",
    name: "Rahul Sharma",
    experienceYears: 3,
    languages: ["English", "Kannada"],
    availability: "Part-Time",
    hourlyRate: "₹250 / hr",
    rating: 4.7,
    imageUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80",
    about: "Energetic and play-focused. Great at facilitating peer interactions during recess and unstructured time.",
  },
  {
    id: "st3",
    name: "Divya Krishnan",
    experienceYears: 7,
    languages: ["English", "Tamil", "Hindi"],
    availability: "Full-Time",
    hourlyRate: "₹350 / hr",
    rating: 4.9,
    imageUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80",
    about: "Former special educator turned shadow teacher. Specializes in managing transitions, academic accommodations, and peer-mediated interventions.",
  },
  {
    id: "st4",
    name: "Aditya Rao",
    experienceYears: 4,
    languages: ["English", "Telugu", "Hindi"],
    availability: "Full-Time",
    hourlyRate: "₹280 / hr",
    rating: 4.7,
    imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80",
    about: "Calm and consistent shadow teacher experienced with children requiring significant sensory accommodations. RCI-certified in special education.",
  },
  {
    id: "st5",
    name: "Pooja Mehta",
    experienceYears: 2,
    languages: ["English", "Gujarati", "Hindi"],
    availability: "Hourly",
    hourlyRate: "₹200 / hr",
    rating: 4.5,
    imageUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80",
    about: "Psychology graduate with hands-on training in visual supports, social stories, and positive behavior management. Available for after-school support.",
  },
];

export const workshops: CommunityWorkshop[] = [
  {
    id: "w1",
    title: "Navigating Sensory Overload in Public Spaces",
    host: "Autism Moms Circle",
    date: "Sat, May 17",
    time: "10:00 AM IST",
    attendees: 45,
    category: "Parenting Strategy",
    imageUrl: "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=400&q=80",
    description: "Learn practical, neuro-affirming strategies to support your child through sensory overwhelm at grocery stores and parks.",
  },
  {
    id: "w2",
    title: "Understanding Gestalt Language Processors",
    host: "Rohan Kapoor, SLP",
    date: "Wed, May 21",
    time: "6:00 PM IST",
    attendees: 120,
    category: "Communication",
    imageUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&q=80",
    description: "Does your child use scripts from movies to communicate? Learn how to support their unique language development.",
  },
  {
    id: "w3",
    title: "Sleep Solutions for Autistic Children",
    host: "Dr. Kavitha Sundaram",
    date: "Sat, May 24",
    time: "11:00 AM IST",
    attendees: 85,
    category: "Health & Wellness",
    imageUrl: "https://images.unsplash.com/photo-1515894203077-3ce772b6c78a?w=400&q=80",
    description: "Evidence-based strategies for improving sleep quality including melatonin guidance, sensory sleep environments, and bedtime visual schedules.",
  },
  {
    id: "w4",
    title: "Meltdown vs Shutdown: What's the Difference?",
    host: "Dr. Ananya Reddy",
    date: "Wed, May 28",
    time: "7:00 PM IST",
    attendees: 200,
    category: "Behavioral Understanding",
    imageUrl: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=400&q=80",
    description: "Learn to distinguish between meltdowns and shutdowns, understand the neurological basis, and master co-regulation techniques.",
  },
  {
    id: "w5",
    title: "School Readiness: IEPs and Accommodations in India",
    host: "Inclusive Education Foundation",
    date: "Sat, Jun 7",
    time: "10:00 AM IST",
    attendees: 95,
    category: "Education",
    imageUrl: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&q=80",
    description: "Navigate the Indian education system: learn your rights, create effective IEPs, and advocate for accommodations under the RPwD Act.",
  },
  {
    id: "w6",
    title: "Cooking Together: Sensory-Friendly Recipes",
    host: "Sensory Kitchen India",
    date: "Sun, Jun 15",
    time: "4:00 PM IST",
    attendees: 35,
    category: "Daily Living Skills",
    imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=80",
    description: "A live cooking session featuring Indian recipes adapted for sensory-sensitive children. Includes texture modification tips and visual recipe cards.",
  },
];
