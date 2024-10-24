import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../[...nextauth]/route";

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);

    try {
        if (session) {
            const res = new Response(
                JSON.stringify({ message: "Sesión cerrada." }),
                {
                    status: 200,
                }
            );

            res.headers.append(
                "Set-Cookie",
                "next-auth.session-token=; Max-Age=0; path=/; SameSite=Lax; HttpOnly"
            );
            res.headers.append(
                "Set-Cookie",
                "next-auth.csrf-token=; Max-Age=0; path=/; SameSite=Lax; HttpOnly"
            );
            res.headers.append(
                "Set-Cookie",
                "next-auth.callback-url=; Max-Age=0; path=/; SameSite=Lax"
            );

            return res;
        }
        const { email } = await request.json();

        // Verifica que se haya enviado el email
        if (!email) {
            return NextResponse.json(
                { message: "Falta el email." },
                { status: 400 }
            );
        }

        // Cambia isLoggedIn a false en la base de datos
        await prisma.user.update({
            where: { email },
            data: { isLoggedIn: false },
        });

        return NextResponse.json(
            { message: "Sesión cerrada." },
            { status: 200 }
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { message: "Error al cerrar sesión." },
            { status: 500 }
        );
    }
}
