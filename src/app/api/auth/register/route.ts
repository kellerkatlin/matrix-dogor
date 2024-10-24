import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import prisma from "@/libs/prisma";

export async function POST(req: NextRequest) {
    try {
        const data = await req.json();
        const userNameFound = await prisma.user.findUnique({
            where: {
                username: data.username,
            },
        });

        if (userNameFound) {
            return NextResponse.json(
                {
                    message: "Username already exists",
                },
                {
                    status: 400,
                }
            );
        }
        const userFound = await prisma.user.findUnique({
            where: {
                email: data.email,
            },
        });

        if (userFound) {
            return NextResponse.json(
                {
                    message: "Email already exists",
                },
                {
                    status: 400,
                }
            );
        }

        const hashedPassword = await bcrypt.hash(data.password, 10);

        const newUser = await prisma.user.create({
            data: {
                username: data.username,
                email: data.email,
                password: hashedPassword,
                roleId: 2,
            },
        });

        /* eslint-disable @typescript-eslint/no-unused-vars */
        const { password: _, ...user } = newUser;
        /* eslint-enable @typescript-eslint/no-unused-vars */
        return NextResponse.json(user);
    } catch (error) {
        return NextResponse.json(
            {
                message: "Something went wrong",
            },
            {
                status: 500,
            }
        );
    }
}
