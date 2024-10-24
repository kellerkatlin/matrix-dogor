import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import prisma from "@/libs/prisma";
import { Event, Impact, Probability, RiskLevel } from "@prisma/client";

export async function GET(
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

        // Obtener la matriz del usuario autenticado por su ID
        const matrix = await prisma.matrix.findFirst({
            where: { id: matrixId, userId: user.id },
            include: {
                riskLevels: true,
                events: {
                    include: {
                        controls: {
                            include: {
                                control: true,
                            },
                        },
                    },
                },

                probabilities: true,
                impacts: true,
            },
        });

        if (!matrix) {
            return NextResponse.json({
                error: "Matrix not found",
                status: 404,
            });
        }

        return NextResponse.json(matrix);
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Failed to retrieve matrix" },
            { status: 500 }
        );
    }
}

export async function PUT(
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

        const data = await request.json();

        const { name, events, riskLevels, probabilities, impacts } = data;

        // Obtener la ID de la matriz de los parámetros de la solicitud
        const matrixId = parseInt(params.id);

        if (isNaN(matrixId)) {
            return NextResponse.json(
                { error: "Invalid matrix ID" },
                { status: 400 }
            );
        }

        // Actualizar la matriz del usuario autenticado por su ID
        const matrix = await prisma.matrix.update({
            where: { id: matrixId, userId: user.id },
            data: {
                name,
                // Eliminar y luego recrear los niveles de riesgo
                riskLevels: {
                    deleteMany: {}, // Elimina todos los niveles de riesgo relacionados con la matriz
                    createMany: {
                        data: riskLevels.map((level: RiskLevel) => ({
                            color: level.color,
                            label: level.label,
                            min: level.min,
                            max: level.max,
                        })),
                    },
                },
                // Eliminar y recrear eventos
                events: {
                    deleteMany: {}, // Elimina todos los eventos relacionados
                    createMany: {
                        data: events.map((event: Event) => ({
                            name: event.name,
                            probability: event.probability,
                            impact: event.impact,
                            value: event.value,
                            riskLevel: event.riskLevel,
                        })),
                    },
                },
                // Eliminar y recrear probabilidades
                probabilities: {
                    deleteMany: {}, // Elimina todas las probabilidades relacionadas
                    createMany: {
                        data: probabilities.map((probability: Probability) => ({
                            value: probability.value,
                        })),
                    },
                },
                // Eliminar y recrear impactos
                impacts: {
                    deleteMany: {}, // Elimina todos los impactos relacionados
                    createMany: {
                        data: impacts.map((impact: Impact) => ({
                            value: impact.value,
                        })),
                    },
                },
            },
            include: {
                riskLevels: true,
                events: true,
            },
        });

        return NextResponse.json({
            message: "Matris actualizada exitosamente",
            matrix,
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Failed to update matrix" },
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
        await prisma.matrix.delete({
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
