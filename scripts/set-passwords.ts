import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const adminHash = await bcrypt.hash("Admin123!", 10);
  const staffHash = await bcrypt.hash("Mitarbeiter123!", 10);

  await prisma.user.update({
    where: { email: "leondukart2009@yahoo.com" },
    data: { passwordHash: adminHash },
  });

  await prisma.user.update({
    where: { email: "leon.dukart14@gmail.com" },
    data: { passwordHash: staffHash },
  });

  console.log("Passwörter gesetzt.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
