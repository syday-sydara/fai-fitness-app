import { prisma } from "./lib/prisma";

async function main() {
  // Create a test todo
  const todo = await prisma.todo.create({
    data: { text: "Test Prisma setup", done: false },
  });

  console.log("Created todo:", todo);

  // Fetch all todos
  const todos = await prisma.todo.findMany();
  console.log("All todos:", todos);
}

main()
  .catch((e) => {
    console.error("Error testing Prisma:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });