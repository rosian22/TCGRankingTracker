import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const leaders = [
  // OP01 - Romance Dawn
  { cardNumber: "OP01-001", name: "Roronoa Zoro", color: "RED" as const, power: 5000, life: 5, traits: "Supernovas/Straw Hat Crew", setCode: "OP01" },
  { cardNumber: "OP01-002", name: "Trafalgar Law", color: "RED" as const, power: 5000, life: 5, traits: "Supernovas/Heart Pirates", setCode: "OP01" },
  { cardNumber: "OP01-003", name: "Monkey.D.Luffy", color: "RED" as const, power: 5000, life: 5, traits: "Supernovas/Straw Hat Crew", setCode: "OP01" },
  { cardNumber: "OP01-022", name: "Uta", color: "RED" as const, power: 5000, life: 5, traits: "FILM", setCode: "OP01" },
  { cardNumber: "OP01-060", name: "Crocodile", color: "BLUE" as const, power: 5000, life: 5, traits: "The Seven Warlords of the Sea/Baroque Works", setCode: "OP01" },
  { cardNumber: "OP01-062", name: "Donquixote Doflamingo", color: "BLUE" as const, power: 5000, life: 5, traits: "The Seven Warlords of the Sea/Donquixote Pirates", setCode: "OP01" },
  { cardNumber: "OP01-091", name: "Eustass\"Captain\"Kid", color: "GREEN" as const, power: 5000, life: 5, traits: "Supernovas/Kid Pirates", setCode: "OP01" },
  { cardNumber: "OP01-093", name: "Jewelry Bonney", color: "GREEN" as const, power: 5000, life: 5, traits: "Supernovas/Bonney Pirates", setCode: "OP01" },
  // OP02 - Paramount War
  { cardNumber: "OP02-001", name: "Edward.Newgate", color: "RED" as const, power: 5000, life: 6, traits: "The Four Emperors/Whitebeard Pirates", setCode: "OP02" },
  { cardNumber: "OP02-049", name: "Sakazuki", color: "PURPLE" as const, secondColor: "BLACK" as const, power: 5000, life: 4, traits: "Navy", setCode: "OP02" },
  { cardNumber: "OP02-058", name: "Emporio.Ivankov", color: "PURPLE" as const, power: 5000, life: 5, traits: "Revolutionary Army", setCode: "OP02" },
  { cardNumber: "OP02-093", name: "Boa Hancock", color: "GREEN" as const, power: 5000, life: 5, traits: "The Seven Warlords of the Sea/Kuja Pirates", setCode: "OP02" },
  // OP03 - Pillars of Strength
  { cardNumber: "OP03-001", name: "Charlotte Katakuri", color: "RED" as const, power: 5000, life: 5, traits: "Big Mom Pirates", setCode: "OP03" },
  { cardNumber: "OP03-021", name: "Zoro & Sanji", color: "BLACK" as const, power: 5000, life: 5, traits: "Straw Hat Crew", setCode: "OP03" },
  { cardNumber: "OP03-040", name: "Monkey.D.Luffy", color: "GREEN" as const, power: 5000, life: 5, traits: "Supernovas/Straw Hat Crew", setCode: "OP03" },
  { cardNumber: "OP03-058", name: "Charlotte.Linlin", color: "YELLOW" as const, power: 5000, life: 5, traits: "The Four Emperors/Big Mom Pirates", setCode: "OP03" },
  { cardNumber: "OP03-076", name: "Portgas.D.Ace", color: "BLUE" as const, power: 5000, life: 5, traits: "Whitebeard Pirates", setCode: "OP03" },
  // OP04 - Kingdoms of Intrigue
  { cardNumber: "OP04-001", name: "Queen", color: "PURPLE" as const, secondColor: "YELLOW" as const, power: 5000, life: 4, traits: "Animal Kingdom Pirates", setCode: "OP04" },
  { cardNumber: "OP04-019", name: "Rebecca", color: "YELLOW" as const, power: 5000, life: 5, traits: "Dressrosa", setCode: "OP04" },
  { cardNumber: "OP04-031", name: "Nefertari.Vivi", color: "BLUE" as const, secondColor: "YELLOW" as const, power: 5000, life: 4, traits: "Alabasta", setCode: "OP04" },
  { cardNumber: "OP04-039", name: "Yamato", color: "GREEN" as const, secondColor: "YELLOW" as const, power: 5000, life: 4, traits: "Wano Country", setCode: "OP04" },
  { cardNumber: "OP04-058", name: "Sabo", color: "BLUE" as const, secondColor: "BLACK" as const, power: 5000, life: 4, traits: "Revolutionary Army", setCode: "OP04" },
  // OP05 - Awakening of the New Era
  { cardNumber: "OP05-001", name: "Eustass\"Captain\"Kid", color: "RED" as const, secondColor: "PURPLE" as const, power: 5000, life: 4, traits: "Supernovas/Kid Pirates", setCode: "OP05" },
  { cardNumber: "OP05-022", name: "Monkey.D.Luffy", color: "RED" as const, secondColor: "PURPLE" as const, power: 5000, life: 4, traits: "Supernovas/Straw Hat Crew", setCode: "OP05" },
  { cardNumber: "OP05-041", name: "Trafalgar Law", color: "BLACK" as const, secondColor: "YELLOW" as const, power: 5000, life: 4, traits: "Supernovas/Heart Pirates", setCode: "OP05" },
  { cardNumber: "OP05-060", name: "Shanks", color: "PURPLE" as const, power: 5000, life: 5, traits: "The Four Emperors/Red Hair Pirates", setCode: "OP05" },
  // OP06 - Wings of the Captain
  { cardNumber: "OP06-001", name: "Perona", color: "RED" as const, secondColor: "BLUE" as const, power: 5000, life: 4, traits: "Thriller Bark Pirates", setCode: "OP06" },
  { cardNumber: "OP06-020", name: "Gecko.Moria", color: "BLUE" as const, secondColor: "PURPLE" as const, power: 5000, life: 4, traits: "The Seven Warlords of the Sea/Thriller Bark Pirates", setCode: "OP06" },
  { cardNumber: "OP06-042", name: "Rob Lucci", color: "BLACK" as const, power: 5000, life: 5, traits: "CP0", setCode: "OP06" },
  { cardNumber: "OP06-061", name: "Hody Jones", color: "BLUE" as const, power: 5000, life: 5, traits: "Fish-Man/New Fish-Man Pirates", setCode: "OP06" },
  // OP07 - 500 Years in the Future
  { cardNumber: "OP07-001", name: "Jewelry Bonney", color: "RED" as const, secondColor: "GREEN" as const, power: 5000, life: 4, traits: "Supernovas/Bonney Pirates", setCode: "OP07" },
  { cardNumber: "OP07-019", name: "Monkey.D.Luffy", color: "PURPLE" as const, power: 5000, life: 5, traits: "Supernovas/Straw Hat Crew", setCode: "OP07" },
  { cardNumber: "OP07-038", name: "Vegapunk", color: "GREEN" as const, secondColor: "BLUE" as const, power: 5000, life: 4, traits: "Scientist/Egghead", setCode: "OP07" },
  { cardNumber: "OP07-058", name: "Roronoa Zoro", color: "BLACK" as const, secondColor: "YELLOW" as const, power: 5000, life: 4, traits: "Straw Hat Crew", setCode: "OP07" },
  { cardNumber: "OP07-079", name: "Kizaru", color: "YELLOW" as const, power: 5000, life: 5, traits: "Navy", setCode: "OP07" },
  // OP08 - Two Legends
  { cardNumber: "OP08-001", name: "Silvers Rayleigh", color: "RED" as const, secondColor: "BLACK" as const, power: 5000, life: 4, traits: "Roger Pirates", setCode: "OP08" },
  { cardNumber: "OP08-019", name: "Kaido", color: "PURPLE" as const, secondColor: "BLACK" as const, power: 5000, life: 4, traits: "The Four Emperors/Animal Kingdom Pirates", setCode: "OP08" },
  { cardNumber: "OP08-039", name: "Nico Robin", color: "GREEN" as const, secondColor: "BLACK" as const, power: 5000, life: 4, traits: "Straw Hat Crew", setCode: "OP08" },
  { cardNumber: "OP08-058", name: "Marshall.D.Teach", color: "BLACK" as const, power: 5000, life: 5, traits: "The Four Emperors/Blackbeard Pirates", setCode: "OP08" },
  { cardNumber: "OP08-079", name: "Enel", color: "YELLOW" as const, secondColor: "BLUE" as const, power: 5000, life: 4, traits: "Sky Island", setCode: "OP08" },
];

async function main() {
  console.log("Seeding leaders...");

  for (const leader of leaders) {
    await prisma.leader.upsert({
      where: { cardNumber: leader.cardNumber },
      create: leader,
      update: leader,
    });
  }

  console.log(`Seeded ${leaders.length} leaders.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
