import { PrismaClient } from "@/app/generated/prisma";
import bcrypt from "bcryptjs";

import { PrismaPg } from "@prisma/adapter-pg";

const prismaClientSingleton = () => {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("Missing DATABASE_URL env var");
  }

  try {
    const adapter = new PrismaPg({ connectionString });
    return new PrismaClient({ 
      adapter,
      log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
    });
  } catch (error) {
    console.error("Failed to initialize Prisma client:", error);
    throw error;
  }
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
      taxRate: 0,
      currency: "INR",
    },
  });

  // LADOOZI Categories
  const dinkLadoo = await prisma.category.upsert({
    where: { slug: "dink-ladoo" },
    update: {},
    create: {
      name: "Dink Ladoo",
      slug: "dink-ladoo",
      description: "Traditional ladoos made with edible gum (dink) for strength and stamina",
    },
  });

  const besanLadoo = await prisma.category.upsert({
    where: { slug: "besan-ladoo" },
    update: {},
    create: {
      name: "Besan Ladoo",
      slug: "besan-ladoo",
      description: "Classic gram flour ladoos for balanced energy and digestion",
    },
  });

  const ravanaralLadoo = await prisma.category.upsert({
    where: { slug: "ravanaral-ladoo" },
    update: {},
    create: {
      name: "Ravanaral Ladoo",
      slug: "ravanaral-ladoo",
      description: "Light and aromatic semolina-based ladoos",
    },
  });

  const specialLadoo = await prisma.category.upsert({
    where: { slug: "special-ladoo" },
    update: {},
    create: {
      name: "Special Ladoo",
      slug: "special-ladoo",
      description: "Premium and festive varieties",
    },
  });

  const healthyLadoo = await prisma.category.upsert({
    where: { slug: "healthy-ladoo" },
    update: {},
    create: {
      name: "Healthy Ladoo",
      slug: "healthy-ladoo",
      description: "Sugar-free and naturally sweetened options",
    },
  });

  // LADOOZI Products
  // Dink Ladoo Products
  await prisma.product.upsert({
    where: { slug: "classic-dink-ladoo" },
    update: {},
    create: {
      name: "Classic Dink Ladoo",
      slug: "classic-dink-ladoo",
      description: "Traditional dink ladoo made with edible gum, desi ghee, and premium dry fruits. Perfect for strength and stamina.",
      price: 550,
      comparePrice: 600,
      stock: 50,
      images: ["https://via.placeholder.com/600x600.png?text=Classic+Dink+Ladoo"],
      categoryId: dinkLadoo.id,
      brand: "LADOOZI",
      highlights: ["Made with pure desi ghee", "Rich in edible gum (dink)", "Boosts immunity", "Perfect for winters"],
      featured: true,
      active: true,
    },
  });

  await prisma.product.upsert({
    where: { slug: "premium-dink-ladoo" },
    update: {},
    create: {
      name: "Premium Dink Ladoo with Dry Fruits",
      slug: "premium-dink-ladoo",
      description: "Enriched with almonds, cashews, and pistachios for extra nutrition.",
      price: 750,
      comparePrice: 850,
      stock: 30,
      images: ["https://via.placeholder.com/600x600.png?text=Premium+Dink+Ladoo"],
      categoryId: dinkLadoo.id,
      brand: "LADOOZI",
      highlights: ["Premium dry fruits", "Extra nutritious", "Handcrafted with care", "Ideal for gifting"],
      featured: true,
      active: true,
    },
  });

  // Besan Ladoo Products
  await prisma.product.upsert({
    where: { slug: "traditional-besan-ladoo" },
    update: {},
    create: {
      name: "Traditional Besan Ladoo",
      slug: "traditional-besan-ladoo",
      description: "Classic gram flour ladoos made with pure desi ghee and cardamom.",
      price: 400,
      comparePrice: 450,
      stock: 60,
      images: ["https://via.placeholder.com/600x600.png?text=Besan+Ladoo"],
      categoryId: besanLadoo.id,
      brand: "LADOOZI",
      highlights: ["Made with gram flour", "Pure desi ghee", "Traditional recipe", "Rich in protein"],
      featured: true,
      active: true,
    },
  });

  await prisma.product.upsert({
    where: { slug: "kaju-besan-ladoo" },
    update: {},
    create: {
      name: "Kaju Besan Ladoo",
      slug: "kaju-besan-ladoo",
      description: "Besan ladoo topped with cashew pieces for a rich taste.",
      price: 500,
      comparePrice: 550,
      stock: 40,
      images: ["https://via.placeholder.com/600x600.png?text=Kaju+Besan+Ladoo"],
      categoryId: besanLadoo.id,
      brand: "LADOOZI",
      highlights: ["Cashew topping", "Rich flavor", "Perfect for festivals", "Premium quality"],
      featured: false,
      active: true,
    },
  });

  // Ravanaral Ladoo Products
  await prisma.product.upsert({
    where: { slug: "classic-ravanaral-ladoo" },
    update: {},
    create: {
      name: "Classic Ravanaral Ladoo",
      slug: "classic-ravanaral-ladoo",
      description: "Light and aromatic semolina ladoos, easy to digest and delicious.",
      price: 350,
      comparePrice: 400,
      stock: 70,
      images: ["https://via.placeholder.com/600x600.png?text=Ravanaral+Ladoo"],
      categoryId: ravanaralLadoo.id,
      brand: "LADOOZI",
      highlights: ["Light and aromatic", "Easy to digest", "Made with semolina", "Perfect for all ages"],
      featured: false,
      active: true,
    },
  });

  // Special Ladoo Products
  await prisma.product.upsert({
    where: { slug: "motichoor-ladoo" },
    update: {},
    create: {
      name: "Motichoor Ladoo",
      slug: "motichoor-ladoo",
      description: "Festive motichoor ladoos perfect for celebrations and gifting.",
      price: 450,
      comparePrice: 500,
      stock: 40,
      images: ["https://via.placeholder.com/600x600.png?text=Motichoor+Ladoo"],
      categoryId: specialLadoo.id,
      brand: "LADOOZI",
      highlights: ["Festive special", "Melt-in-mouth texture", "Perfect for celebrations", "Premium quality"],
      featured: true,
      active: true,
    },
  });

  await prisma.product.upsert({
    where: { slug: "coconut-ladoo" },
    update: {},
    create: {
      name: "Coconut Ladoo",
      slug: "coconut-ladoo",
      description: "Sweet and fragrant coconut ladoos made with fresh coconut.",
      price: 380,
      comparePrice: 420,
      stock: 50,
      images: ["https://via.placeholder.com/600x600.png?text=Coconut+Ladoo"],
      categoryId: specialLadoo.id,
      brand: "LADOOZI",
      highlights: ["Made with fresh coconut", "Light and sweet", "Traditional taste", "Loved by all"],
      featured: false,
      active: true,
    },
  });

  // Healthy Ladoo Products
  await prisma.product.upsert({
    where: { slug: "sugar-free-dates-ladoo" },
    update: {},
    create: {
      name: "Sugar-Free Dates Ladoo",
      slug: "sugar-free-dates-ladoo",
      description: "Naturally sweetened with dates, perfect for health-conscious individuals.",
      price: 600,
      comparePrice: 650,
      stock: 35,
      images: ["https://via.placeholder.com/600x600.png?text=Dates+Ladoo"],
      categoryId: healthyLadoo.id,
      brand: "LADOOZI",
      highlights: ["No refined sugar", "Naturally sweetened", "Rich in fiber", "Diabetic-friendly"],
      featured: true,
      active: true,
    },
  });

  await prisma.product.upsert({
    where: { slug: "jaggery-til-ladoo" },
    update: {},
    create: {
      name: "Jaggery Til Ladoo",
      slug: "jaggery-til-ladoo",
      description: "Traditional sesame ladoos made with jaggery for Makar Sankranti.",
      price: 420,
      comparePrice: 470,
      stock: 45,
      images: ["https://via.placeholder.com/600x600.png?text=Til+Ladoo"],
      categoryId: healthyLadoo.id,
      brand: "LADOOZI",
      highlights: ["Made with jaggery", "Rich in calcium", "Winter special", "Traditional recipe"],
      featured: false,
      active: true,
    },
  });

  // Sample Banner
  await prisma.banner.upsert({
    where: { id: "banner-1" },
    update: {},
    create: {
      id: "banner-1",
      title: "Welcome to LADOOZI",
      subtitle: "Handmade • Pure • Premium",
      image: "/images/banner.png",
      link: "/products",
      active: true,
      order: 1,
    },
  });

  console.log("Seed complete - LADOOZI data created!");
  console.log("Admin:", admin.email, admin.role);
  console.log("Admin password:", adminPassword);
  console.log("Categories created: 5");
  console.log("Products created: 9");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
