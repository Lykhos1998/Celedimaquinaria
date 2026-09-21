import { seedDemoUsers } from "../src/lib/seed-demo-users";
import { prisma } from "../src/lib/prisma";

seedDemoUsers()
  .then(({ creados, password }) => {
    console.log(`Seed listo. ${creados} usuarios creados con contraseña "${password}".`);
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
