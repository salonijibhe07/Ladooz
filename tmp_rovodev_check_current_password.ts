// Check current password in database
import prisma from "./lib/prisma";
import bcrypt from "bcryptjs";

async function checkPassword() {
  const email = "tanmaysontakke2003@gmail.com";
  
  const user = await prisma.user.findUnique({
    where: { email }
  });
  
  if (!user) {
    console.log("❌ User not found");
    return;
  }
  
  console.log("User:", user.email);
  console.log("Current hash:", user.password);
  
  // Test all possible passwords
  const passwordsToTest = [
    "tanmay",
    "tanmay123",
    "Tanmay",
    "TANMAY",
    " tanmay",
    "tanmay ",
    user.name,
  ];
  
  console.log("\nTesting passwords:");
  for (const pwd of passwordsToTest) {
    const result = await bcrypt.compare(pwd, user.password);
    if (result) {
      console.log(`✅ MATCH: "${pwd}"`);
    } else {
      console.log(`❌ NO MATCH: "${pwd}"`);
    }
  }
  
  await prisma.$disconnect();
}

checkPassword().catch(console.error);
