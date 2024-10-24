import prisma from "@/libs/prisma";
import { NextResponse } from "next/server";

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    if (!params || !params.id) {
        return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    try {
        const { id } = params;
        console.log("Received ID:", id);
        const user = await prisma.user.findUnique({
            where: {
                id: Number(id), // Convierte a número
            },
            include: {
                companies: {
                    include: {
                        company: true, // Incluye información de la compañía
                    },
                },
            },
        });
        console.log(user);
        if (!user) {
            throw new Error("User not found");
        }

        let companies;

        if (user.roleId === 1) {
            // Si el usuario tiene rol de administrador, devuelve todas las empresas
            companies = await prisma.company.findMany();
        } else {
            // Si el usuario no es administrador, devuelve solo sus empresas
            companies = user.companies.map(
                (companyUser) => companyUser.company
            );
        }

        return NextResponse.json({ user, companies });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: error.message || "Failed to retrieve user" },
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

        // Primero, elimina las relaciones en CompanyUser
        await prisma.companyUser.deleteMany({
            where: {
                userId: +id,
            },
        });

        // Luego, elimina el usuario
        await prisma.user.delete({
            where: {
                id: +id,
            },
        });

        return NextResponse.json({ message: "User deleted successfully" });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Failed to delete user" },
            { status: 500 }
        );
    }
}

export async function PATCH(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;
        const body = await request.json();
        const { status } = body;
        const user = await prisma.user.update({
            where: { id: +id },
            data: {
                status,
            },
        });
        return NextResponse.json({ user });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Failed to update user" },
            { status: 500 }
        );
    }
}
