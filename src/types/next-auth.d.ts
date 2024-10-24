import NextAuth from "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            id?: string;
            address?: string;
            email?: string;
            status?: boolean;
            name?: string;
            roleId?: number;
        };
    }
}
