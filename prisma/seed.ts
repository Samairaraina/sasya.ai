import { prisma } from "../lib/prisma";

async function main() {
  const farm = await prisma.farm.upsert({
    where: { id: "demo-farm-green-valley" },
    update: {},
    create: {
      id: "demo-farm-green-valley",
      name: "Green Valley Farm",
      location: "Nashik, Maharashtra",
      sizeAcres: 12.5,
      crops: {
        create: [
          { name: "Tomato", variety: "Arka Vikas", plantedAt: new Date("2026-06-15") },
          { name: "Wheat", variety: "HD-3086", plantedAt: new Date("2026-05-20") },
          { name: "Chilli", variety: "Byadgi", plantedAt: new Date("2026-04-10") },
        ],
      },
    },
    include: { crops: true },
  });

  const secondFarm = await prisma.farm.upsert({
    where: { id: "demo-farm-sunrise" },
    update: {},
    create: {
      id: "demo-farm-sunrise",
      name: "Sunrise Organic Farm",
      location: "Coimbatore, Tamil Nadu",
      sizeAcres: 6,
      crops: {
        create: [
          { name: "Banana", variety: "Grand Naine", plantedAt: new Date("2025-11-02") },
          { name: "Coconut", variety: "West Coast Tall", plantedAt: new Date("2024-01-18") },
        ],
      },
    },
    include: { crops: true },
  });

  console.log(`Seeded farm "${farm.name}" with ${farm.crops.length} crops.`);
  console.log(`Seeded farm "${secondFarm.name}" with ${secondFarm.crops.length} crops.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
