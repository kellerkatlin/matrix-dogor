import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import prisma from "@/libs/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json(
                { error: "Not authenticated" },
                { status: 401 }
            );
        }

        const users = await prisma.user.findMany({
            include: {
                role: true,
            },
        });

        return NextResponse.json(users);
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Failed to retrieve matrices" },
            { status: 500 }
        );
    }
}

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
                roleId: data.roleId,
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
