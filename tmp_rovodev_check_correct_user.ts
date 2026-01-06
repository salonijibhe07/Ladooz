// Check the correct user
import prisma from "./lib/prisma";
import bcrypt from "bcryptjs";

async function checkUser() {
  const email = "tanmaysontakke@gmail.com";
  
  const user = await prisma.user.findUnique({
    where: { email }
  });
  
  if (!user) {
    console.log("❌ User not found");
    return;
  }
  
  console.log("✅ User found");
  console.log("Email:", user.email);
  console.log("Name:", user.name);
  console.log("Hash:", user.password);
  
  // Test passwords
  const passwordsToTest = [
    "tanmay",
    "Solin",
    "solin",
    "tanmaysontakke",
    "password",
    "123456",
  ];
  
  console.log("\nTesting passwords:");
  for (const pwd of passwordsToTest) {
    const result = await bcrypt.compare(pwd, user.password);
    console.log(`  "${pwd}": ${result ? "✅ MATCH" : "❌ NO MATCH"}`);
  }
  
  await prisma.$disconnect();
}

checkUser().catch(console.error);
