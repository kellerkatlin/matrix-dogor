import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";

export async function POST(request: Request) {
    try {
        // Extraemos los datos del cuerpo de la petición
        const { eventId, controlId } = await request.json();

        // Validamos que los parámetros requeridos estén presentes
        if (!eventId || !controlId) {
            return NextResponse.json(
                { message: "Faltan datos: eventId o controlId" },
                { status: 400 }
            );
        }

        // Verificamos si la relación ya existe para evitar duplicados
        const existingRelation = await prisma.eventControl.findUnique({
            where: {
                eventId_controlId: { eventId, controlId },
            },
        });

        // Si la relación ya existe, enviamos un error
        if (existingRelation) {
            return NextResponse.json(
                { message: "La relación ya existe" },
                { status: 400 }
            );
        }

        // Creamos la nueva relación entre el evento y el control
        const newRelation = await prisma.eventControl.create({
            data: {
                eventId: eventId,
                controlId: controlId,
            },
        });

        // Retornamos la nueva relación creada
        return NextResponse.json(newRelation, { status: 201 });
    } catch (error) {
        console.error("Error al crear la relación:", error);
        return NextResponse.json(
            { message: "Error al guardar la relación" },
            { status: 500 }
        );
    }
}
