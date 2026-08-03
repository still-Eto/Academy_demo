import { staffPhoto, type ManagedImage } from "./images";

/**
 * Everyone who works at Bridgewood, including the cook and the office manager.
 * A parent who notices you named the cook believes the rest of the page.
 *
 * Room staffing reconciles with content/programs.ts: two teachers in every
 * room, which is what the class size and ratio in that file require.
 */

export type StaffMember = {
  name: string;
  role: string;
  /** Program slug, or "floating" / "kitchen" / "office" / "leadership". */
  group: string;
  years: number;
  credential: string;
  /** One sentence, in their own voice. */
  quote: string;
  photo: ManagedImage;
  isLead?: boolean;
};

export const staff: StaffMember[] = [
  {
    name: "Marisol Vega",
    role: "Director",
    group: "leadership",
    years: 12,
    credential: "M.Ed. Early Childhood Education",
    quote:
      "I answer the tour emails myself. If you write on a Tuesday you will hear from me on a Wednesday, and it will be an actual answer to your actual question.",
    photo: staffPhoto("marisol-vega"),
  },
  {
    name: "Ellen Brzozowski",
    role: "Office Manager",
    group: "office",
    years: 5,
    credential: "Handles enrollment, billing and the authorized pickup list",
    quote:
      "If your bill ever looks wrong, call me before you pay it. I would rather fix it than have you wonder about it for a month.",
    photo: staffPhoto("ellen-brzozowski"),
  },
  {
    name: "Tanya Okafor",
    role: "Lead Teacher",
    group: "acorn",
    years: 9,
    credential: "Infant/Toddler CDA · Safe Sleep certified",
    quote:
      "I write down how you put your baby down at home, and then I do it that way. It is not my job to teach her a new way of falling asleep.",
    photo: staffPhoto("tanya-okafor"),
    isLead: true,
  },
  {
    name: "Priya Raghavan",
    role: "Teacher",
    group: "acorn",
    years: 4,
    credential: "A.A.S. Early Childhood Education",
    quote:
      "The best part of the day is 3:30, when everybody is awake at the same time and the room gets loud.",
    photo: staffPhoto("priya-raghavan"),
  },
  {
    name: "Renata Alvarez",
    role: "Lead Teacher",
    group: "sunflower",
    years: 7,
    credential: "B.A. Child Development",
    quote:
      "A toddler who is biting is a toddler who has run out of words. My job is to give her the words before she needs them.",
    photo: staffPhoto("renata-alvarez"),
    isLead: true,
  },
  {
    name: "Jo Feldman",
    role: "Teacher",
    group: "sunflower",
    years: 3,
    credential: "Infant/Toddler CDA",
    quote:
      "I have learned every single one of their shoe preferences. It matters more than you would think.",
    photo: staffPhoto("jo-feldman"),
  },
  {
    name: "Camille Boyd",
    role: "Lead Teacher",
    group: "maple",
    years: 6,
    credential: "B.A. Early Childhood Education",
    quote:
      "If something happens to your child, or your child causes it, you hear it from me that afternoon. Never in a note at pickup.",
    photo: staffPhoto("camille-boyd"),
    isLead: true,
  },
  {
    name: "Hector Salas",
    role: "Teacher",
    group: "maple",
    years: 5,
    credential: "CDA Preschool · Bilingual, English and Spanish",
    quote:
      "Toilet training goes at your child’s pace and yours. I have never once seen rushing it make it go faster.",
    photo: staffPhoto("hector-salas"),
  },
  {
    name: "Nadia Haddad",
    role: "Lead Teacher",
    group: "oak",
    years: 8,
    credential: "M.Ed. Curriculum & Instruction",
    quote:
      "We spent three weeks on ramps last winter because one child asked why the little car was faster. That is the whole method.",
    photo: staffPhoto("nadia-haddad"),
    isLead: true,
  },
  {
    name: "Will Turnbull",
    role: "Teacher",
    group: "oak",
    years: 2,
    credential: "B.A. Elementary Education",
    quote:
      "I write the daily notes with names in them. \"Played outside\" tells you nothing. \"Built a ramp and tested it eleven times\" tells you who your kid is.",
    photo: staffPhoto("will-turnbull"),
  },
  {
    name: "Grace Yun",
    role: "Lead Teacher",
    group: "summit",
    years: 11,
    credential: "Illinois PEL, Early Childhood",
    quote:
      "In April I write one page per child on what they can and cannot do yet before kindergarten. Families tell me it is the most useful thing we send home.",
    photo: staffPhoto("grace-yun"),
    isLead: true,
  },
  {
    name: "Marcus Bell",
    role: "Teacher",
    group: "summit",
    years: 4,
    credential: "B.S. Human Development",
    quote:
      "Four-year-olds will argue about anything. I would rather they argued with each other and figured it out than had me settle it.",
    photo: staffPhoto("marcus-bell"),
  },
  {
    name: "Deion Pratt",
    role: "After-School Coordinator",
    group: "after-school",
    years: 6,
    credential: "B.A. Recreation & Youth Development",
    quote:
      "Homework first, every day, with a grown-up at the table. Then they get the gym. In that order, and they know it.",
    photo: staffPhoto("deion-pratt"),
    isLead: true,
  },
  {
    name: "Sofia Nakamura",
    role: "After-School Teacher",
    group: "after-school",
    years: 3,
    credential: "Working toward a B.A. in Elementary Education",
    quote:
      "The chess club started because two second graders asked. It is now eleven children and I have lost to most of them.",
    photo: staffPhoto("sofia-nakamura"),
  },
  {
    name: "Angie Prokop",
    role: "Floating Teacher",
    group: "floating",
    years: 5,
    credential: "CDA Preschool",
    quote:
      "I cover breaks so that nobody ever has to pull your child’s teacher into another room. That is the entire point of my job.",
    photo: staffPhoto("angie-prokop"),
  },
  {
    name: "Sam Whitaker",
    role: "Floating Teacher",
    group: "floating",
    years: 2,
    credential: "A.A.S. Early Childhood Education",
    quote:
      "I know every child’s name in the building. It takes about a month and it is worth it.",
    photo: staffPhoto("sam-whitaker"),
  },
  {
    name: "Rosa Delgado",
    role: "Cook",
    group: "kitchen",
    years: 10,
    credential: "Certified Food Protection Manager (ServSafe)",
    quote:
      "There has never been a nut in this building and there never will be. I read every label that comes through the door.",
    photo: staffPhoto("rosa-delgado"),
  },
];

export const staffByGroup = (group: string) => staff.filter((s) => s.group === group);

export const leadTeachers = staff.filter((s) => s.isLead);

/** Computed so the claim on /about and /staff can never drift. */
export const leadTeacherAverageTenure =
  Math.round((leadTeachers.reduce((n, s) => n + s.years, 0) / leadTeachers.length) * 10) / 10;

/** Four faces for the home page strip — one from each end of the age range. */
export const featuredStaff = ["Tanya Okafor", "Renata Alvarez", "Nadia Haddad", "Grace Yun"].map(
  (name) => staff.find((s) => s.name === name)!,
);

export const groupLabels: Record<string, string> = {
  leadership: "Leadership",
  floating: "Floating teachers",
  kitchen: "Kitchen",
  office: "Front office",
};
