import { NextRequest, NextResponse } from "next/server";
import prisma from "@/libs/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json(
                { error: "Not authenticated" },
                { status: 401 }
            );
        }

        const company = await prisma.company.findMany({
            include: {
                users: true,
            },
        });

        return NextResponse.json(company);
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Failed to retrieve companies" },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        const data = await req.json();

        const newCompany = await prisma.company.create({
            data: {
                name: data.name,
                users: {
                    create: {
                        userId: +data.userId,
                    },
                },
            },
        });

        return NextResponse.json(newCompany);
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
