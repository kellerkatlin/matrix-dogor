import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";

export async function GET() {
    try {
        const domains = await prisma.domain.findMany({
            include: {
                subdomains: {
                    include: {
                        controls: true,
                    },
                },
            },
        });

        return NextResponse.json(domains);
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Failed to retrieve controles" },
            { status: 500 }
        );
    }
}
