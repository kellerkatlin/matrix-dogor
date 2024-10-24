import prisma from "@/libs/prisma";
import { NextResponse } from "next/server";

export async function GET({ params }: { params: { id: string } }) {
    try {
        const { id } = params;

        const company = await prisma.company.findUnique({
            where: {
                id: +id,
            },
            include: {
                users: true,
            },
        });

        return NextResponse.json(company);
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Failed to retrieve company" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;

        await prisma.companyUser.deleteMany({
            where: {
                companyId: +id,
            },
        });

        // Primero, elimina las relaciones en CompanyUser
        await prisma.company.delete({
            where: {
                id: +id,
            },
        });

        // Luego, elimina el usuario

        return NextResponse.json({ message: "Company deleted successfully" });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Failed to delete company" },
            { status: 500 }
        );
    }
}
