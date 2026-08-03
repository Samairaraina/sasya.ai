import { prisma } from "../lib/prisma";
import bcrypt from "bcryptjs";

async function main() {
  const email = "demo@example.com";
  const passwordHash = await bcrypt.hash("Demo@123456", 10);

  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      password: passwordHash,
      name: "Demo Farmer",
      farms: {
        create: [
          {
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
          {
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
        ],
      },
    },
    include: { farms: { include: { crops: true } } },
  });

  const cropCount = user.farms.reduce((acc, f) => acc + f.crops.length, 0);
  console.log(`Seeded user "${user.email}" with ${user.farms.length} farm(s), ${cropCount} crop(s).`);
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
