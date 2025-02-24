import { hash } from "bcrypt"
import { prisma } from "../database/connection"
import { findAlreadyExist } from "./commonUtils"
import { AppString } from "./common/AppString"

const seeder = async () => {
    let email = 'superadmin@admin.com'
    let adminFiler = { role: 1, email }
    const isAdminAlreadyExist = await findAlreadyExist("user", adminFiler)
    if (!isAdminAlreadyExist.id) {
        let hazedPassword = await hash('Admin@123', 10)
        await prisma.user.create({
            data: {
                role: 1,
                email,
                name: 'Super Admin',
                password: hazedPassword,
                mobile: "",
                registeredWith: 2
            }
        })
        console.log(AppString.super_admin_seeded)
    } else {
        console.log(AppString.super_admin_exist)
    }
}

seeder()