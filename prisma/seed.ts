import { PrismaClient } from "@/app/generated/prisma/client";
import bcrypt from "bcryptjs";

import { PrismaPg } from "@prisma/adapter-pg";

const prismaClientSingleton = () => {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("Missing DATABASE_URL env var");
  }

  const adapter = new PrismaPg({ connectionString });
  return new PrismaClient({ adapter });
};

declare global {
  var prismaGlobal: ReturnType<typeof prismaClientSingleton> | undefined;
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

async function main() {
  const adminEmail = process.env.SEED_ADMIN_EMAIL || "admin@example.com";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || "Admin@12345";
  const adminName = process.env.SEED_ADMIN_NAME || "Admin";

  const hashed = await bcrypt.hash(adminPassword, 10);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      name: adminName,
      role: "ADMIN",
      // keep existing password unless you explicitly want to reset:
      // password: hashed,
    },
    create: {
      name: adminName,
      email: adminEmail,
      password: hashed,
      role: "ADMIN",
    },
    select: { id: true, email: true, role: true },
  });

  // Ensure settings row exists (if your app expects it)
  await prisma.settings.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      siteName: "My Store",
      siteDescription: "Demo ecommerce store",
      taxRate: 0.18,
      currency: "INR",
    },
  });

  // Optional demo categories/products (lightweight)
  const electronics = await prisma.category.upsert({
    where: { slug: "electronics" },
    update: {},
    create: {
      name: "Electronics",
      slug: "electronics",
      description: "Phones, laptops, accessories",
    },
  });

  await prisma.product.upsert({
    where: { slug: "demo-smartphone" },
    update: {},
    create: {
      name: "Demo Smartphone",
      slug: "demo-smartphone",
      description: "Sample product for testing",
      price: 12999,
      comparePrice: 14999,
      stock: 25,
      images: ["https://via.placeholder.com/600x600.png?text=Demo+Smartphone"],
      categoryId: electronics.id,
      brand: "DemoBrand",
      highlights: ["4GB RAM", "128GB Storage", "5000mAh Battery"],
      featured: true,
      active: true,
    },
  });

  console.log("Seed complete");
  console.log("Admin:", admin.email, admin.role);
  console.log("Admin password:", adminPassword);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
