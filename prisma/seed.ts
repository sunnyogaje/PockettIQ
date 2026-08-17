import { PrismaClient } from "@prisma/client"
import { DEFAULT_CATEGORIES } from "../src/lib/constants/categories"

const db = new PrismaClient()

async function main() {
  for (const category of DEFAULT_CATEGORIES) {
    const existing = await db.category.findFirst({
      where: { userId: null, name: category.name, type: category.type },
    })
    if (existing) continue

    await db.category.create({
      data: {
        userId: null,
        name: category.name,
        icon: category.icon,
        group: category.group,
        type: category.type,
        isDefault: true,
      },
    })
  }

  console.log(`Seeded ${DEFAULT_CATEGORIES.length} default categories.`)
}

main()
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })
