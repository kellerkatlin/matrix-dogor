import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/libs/prisma";
import bcrypt from "bcrypt";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text", placeholder: " " },
                password: {
                    label: "Password",
                    type: "password",
                },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password)
                    throw new Error("Faltan credenciales");

                const userFound = await prisma.user.findUnique({
                    where: {
                        email: credentials.email,
                    },
                    include: {
                        role: true,
                    },
                });
                if (!userFound) {
                    throw new Error(
                        "No se encontró un usuario con ese correo electrónico"
                    );
                }
                if (userFound.roleId !== 1 && userFound.isLoggedIn) {
                    throw new Error("Sesión abierta en otro navegador.");
                }

                await prisma.user.update({
                    where: { id: userFound.id },
                    data: { isLoggedIn: true },
                });

                if (userFound.roleId !== 1 && !userFound.status) {
                    throw new Error("Usuario deshabilitado");
                }

                const matchPassword = await bcrypt.compare(
                    credentials.password,
                    userFound.password
                );

                if (!matchPassword) {
                    throw new Error("Contraseña incorrecta");
                }

                return {
                    id: userFound.id.toString(),
                    name: userFound.username,
                    email: userFound.email,
                    roleId: userFound.roleId,
                    isLoggedIn: userFound.isLoggedIn,
                };
            },
        }),
    ],
    pages: {
        signIn: "/auth/login",
        signOut: "/auth/login",
    },
    session: {
        strategy: "jwt",

        maxAge: 5 * 60,
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.status = user.status;
                token.roleId = user.roleId;
                token.isLoggedIn = user.isLoggedIn;
            }
            console.log(token);

            return token;
        },
        async session({ session, token }) {
            session.user.id = token.id;
            session.user.status = token.status;
            session.user.roleId = token.roleId;
            session.user.isLoggedIn = token.isLoggedIn;

            return session;
        },
    },

    cookies: {
        sessionToken: {
            name: "next-auth.session-token", // Nombre de la cookie de sesión
            options: {
                httpOnly: true, // Habilitar el acceso solo a través de HTTP
                sameSite: "lax", // Estrategia de seguridad para las cookies
                path: "/", // La ruta para la cookie
                secure: process.env.NODE_ENV === "production", // Habilitar solo en producción
            },
        },
        csrfToken: {
            name: "next-auth.csrf-token",
            options: {
                httpOnly: true,
                sameSite: "lax",
                path: "/",
                secure: process.env.NODE_ENV === "production",
            },
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
};
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
