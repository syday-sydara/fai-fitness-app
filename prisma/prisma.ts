import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const workout = await prisma.workout.create({
    data: {
      userId: "alex123",
      exercise: "Jogging",
      duration: 30,
      intensity: "Moderate",
    },
  });

  console.log(workout);
}

main()
  .catch(console.error)
  .finally(async () => await prisma.$disconnect());