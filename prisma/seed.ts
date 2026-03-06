import bcrypt from 'bcrypt'
import { PrismaClient } from 'generated/prisma'

const prisma = new PrismaClient()

async function main() {
    const adminEmail = "admin@example.com"
    const password = "admin123"

    const hashedPassword = await bcrypt.hash(password, 10)

    const existingAdmin = await prisma.user.findUnique({
        where: { email: adminEmail }
    })

    if (existingAdmin) {
        console.log("Admin already exists")
        return
    }

    const admin = await prisma.user.create({
        data: {
            id: crypto.randomUUID(),
            email: adminEmail,
            password: hashedPassword,
            name: "Admin",
        }
    })

    console.log("Admin created:", admin.email)
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })