import prisma from "@/libs/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(request: Request) {
    try {
        // Obtener la sesión del usuario autenticado
        const session = await getServerSession(authOptions);

        // Verificar si el usuario está autenticado
        if (!session) {
            return NextResponse.json(
                { error: "Not authenticated" },
                { status: 401 }
            );
        }

        // Obtener el email del usuario de la sesión
        const userEmail = session.user?.email;

        if (!userEmail) {
            return NextResponse.json(
                { error: "User email not found in session" },
                { status: 400 }
            );
        }

        // Buscar el usuario en la base de datos usando el email
        const user = await prisma.user.findUnique({
            where: { email: userEmail },
        });

        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        const data = await request.json();
        console.log(data);
        const { name, events, riskLevels, probabilities, impacts, companyId } =
            data;

        const matrix = await prisma.matrix.create({
            data: {
                name,
                probabilities: {
                    createMany: {
                        data: probabilities.map((value: number) => ({ value })),
                    },
                },
                impacts: {
                    createMany: {
                        data: impacts.map((value: number) => ({ value })),
                    },
                },
                riskLevels: {
                    createMany: {
                        data: riskLevels,
                    },
                },
                events: {
                    createMany: {
                        data: events,
                    },
                },
                userId: user.id,

                companyId: companyId,
            },
        });

        return NextResponse.json({
            message: "Matris Creada Exitosamente",
            matrix,
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Failed to create matrix" },
            { status: 500 }
        );
    }
}

// Obtener todas las matrices de un usuario
export async function GET() {
    try {
        // Obtener la sesión del usuario autenticado
        const session = await getServerSession(authOptions);

        // Verificar si el usuario está autenticado
        if (!session) {
            return NextResponse.json(
                { error: "Not authenticated" },
                { status: 401 }
            );
        }

        // Obtener el userId del usuario autenticado
        const userEmail = session.user?.email;

        if (!userEmail) {
            return NextResponse.json(
                { error: "User email not found in session" },
                { status: 400 }
            );
        }

        // Buscar el usuario en la base de datos utilizando el email de la sesión
        const user = await prisma.user.findUnique({
            where: { email: userEmail },
        });

        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        // Obtener las matrices del usuario autenticado
        const matrices = await prisma.matrix.findMany({
            where: { userId: user.id },
            include: {
                riskLevels: true,
                events: true,
                probabilities: true,
                impacts: true,
            },
        });

        return NextResponse.json(matrices);
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Failed to retrieve matrices" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        // Obtener la sesión del usuario autenticado
        const session = await getServerSession(authOptions);

        // Verificar si el usuario está autenticado
        if (!session) {
            return NextResponse.json(
                { error: "Not authenticated" },
                { status: 401 }
            );
        }

        // Obtener el userId del usuario autenticado
        const userEmail = session.user?.email;

        if (!userEmail) {
            return NextResponse.json(
                { error: "User email not found in session" },
                { status: 400 }
            );
        }

        // Buscar el usuario en la base de datos utilizando el email de la sesión
        const user = await prisma.user.findUnique({
            where: { email: userEmail },
        });

        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        // Obtener la ID de la matriz de los parámetros de la solicitud
        const matrixId = parseInt(params.id);

        if (isNaN(matrixId)) {
            return NextResponse.json(
                { error: "Invalid matrix ID" },
                { status: 400 }
            );
        }

        // Eliminar la matriz del usuario autenticado por su ID
        await prisma.matrix.deleteMany({
            where: { id: matrixId, userId: user.id },
        });

        return NextResponse.json({ message: "Matrix deleted successfully" });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Failed to delete matrix" },
            { status: 500 }
        );
    }
}
