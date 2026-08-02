import { prisma } from "../lib/prisma";

async function main() {
  const farms = await prisma.farm.findMany({ include: { crops: true } });
  const cropCount = farms.reduce((acc, f) => acc + f.crops.length, 0);
  console.log(`✅ Connected — ${farms.length} farm(s), ${cropCount} crop(s) in database.`);
  for (const farm of farms) {
    console.log(`   - ${farm.name} (${farm.location ?? "unknown location"}): ${farm.crops.length} crop(s)`);
  }
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
