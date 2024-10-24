import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

type RolePermissions = {
    [roleId: number]: {
        allowedRoutes: string[];
    };
};

const rolePermissions: RolePermissions = {
    1: {
        allowedRoutes: ["*"],
    },

    2: {
        allowedRoutes: ["/admin/company", "/dashboard"],
    },

    3: {
        allowedRoutes: ["/admin/users"],
    },
};

export default withAuth(
    function middleware(req) {
        const { token } = req.nextauth;
        if (!token || typeof token.roleId !== "number") {
            return NextResponse.redirect(new URL("/auth/login", req.url));
        }
        const { roleId } = token;

        const pathname = req.nextUrl.pathname;
        const permissions = rolePermissions[roleId];
        const hasAccess =
            permissions &&
            permissions.allowedRoutes.some((route) =>
                pathname.startsWith(route)
            );

        if (!hasAccess) {
            if (roleId === 2) {
                return NextResponse.redirect(
                    new URL("/admin/company", req.url)
                );
            }
            if (roleId === 3) {
                return NextResponse.redirect(new URL("/admin/users", req.url));
            }
        }

        return NextResponse.next();
    },

    {
        pages: {
            signIn: "/auth/login",
        },
    }
);

export const config = {
    matcher: ["/dashboard", "/matrix/:path*", "/admin/:path*"],
};
