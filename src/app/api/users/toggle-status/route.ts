import { NextRequest, NextResponse } from "next/server";
import prisma from "@/libs/prisma";

export async function PATCH(request: NextRequest) {
    try {
        const body = await request.json();
        const { email } = body;
        console.log(email);
        // Busca el usuario por email
        const user = await prisma.user.findUnique({
            where: { email },
        });
        console.log("2eqweqweqwe", user);

        // Si no se encuentra el usuario, devuelve un error
        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        // Cambia el estado del usuario

        const updatedUser = await prisma.user.update({
            where: { email },
            data: {
                status: user.status === true ? false : false,
            },
        });

        // Devuelve el usuario actualizado
        return NextResponse.json({ user: updatedUser });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Failed to update user" },
            { status: 500 }
        );
    }
}
