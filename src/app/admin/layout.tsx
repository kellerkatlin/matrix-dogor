"use client";
import {
    CalendarIcon,
    HomeIcon,
    UserGroupIcon,
} from "@heroicons/react/outline";
import { signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

const navigation = [
    { name: "Dashboard", href: "/admin", icon: HomeIcon, current: true },
    {
        name: "Usuarios",
        href: "/admin/users",
        icon: UserGroupIcon,
        current: false,
    },
    {
        name: "Empresas",
        href: "/admin/company",
        icon: CalendarIcon,
        current: false,
    },
];

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const pathName = usePathname();
    const { data: session } = useSession();

    const handlerSingOut = async () => {
        if (confirm(`${session?.user?.name} ¿Estás seguro de cerrar sesión?`)) {
            const response = await fetch("/api/auth/signout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email: session?.user?.email }),
            });

            if (response.ok) {
                await signOut({ callbackUrl: "/auth/login" }); // Asegúrate de que se llama después de que la respuesta sea exitosa
            } else {
                const errorData = await response.json();
                console.error("Error al cerrar sesión:", errorData.message);
            }
        }
    };

    const currentPath = navigation.find((item) => item.href === pathName);
    if (currentPath) {
        navigation.forEach((item) => {
            item.current = item.href === pathName;
        });
    }

    return (
        <div className="h-full flex">
            <div className="hidden lg:flex lg:flex-shrink-0">
                <div className="flex flex-col w-64">
                    {/* Sidebar component, swap this element with another sidebar if you like */}
                    <div className="flex-1 flex flex-col min-h-0 border-r border-gray-200 bg-gray-100">
                        <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
                            <div className="flex items-center flex-shrink-0 px-4 ">
                                <h1>Grupo 6</h1>
                            </div>
                            <nav className="mt-5 flex-1" aria-label="Sidebar">
                                <div className="px-2 space-y-1">
                                    {navigation.map((item) => (
                                        <a
                                            key={item.name}
                                            href={item.href}
                                            className={classNames(
                                                item.current
                                                    ? "bg-gray-200 text-gray-900"
                                                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                                                "group flex items-center px-2 py-2 text-sm font-medium rounded-md"
                                            )}
                                        >
                                            <item.icon
                                                className={classNames(
                                                    item.current
                                                        ? "text-gray-500"
                                                        : "text-gray-400 group-hover:text-gray-500",
                                                    "mr-3 h-6 w-6"
                                                )}
                                                aria-hidden="true"
                                            />
                                            {item.name}
                                        </a>
                                    ))}
                                </div>
                            </nav>
                        </div>
                        <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
                            <a
                                href="#"
                                className="flex-shrink-0 w-full group block"
                            >
                                <div className="flex items-center">
                                    <div>
                                        <img
                                            className="inline-block h-9 w-9 rounded-full"
                                            src="https://images.unsplash.com/photo-1517365830460-955ce3ccd263?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=256&h=256&q=80"
                                            alt=""
                                        />
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                                            {session?.user?.name}
                                        </p>
                                        <p
                                            className="text-xs font-medium text-gray-500 group-hover:text-gray-700"
                                            onClick={handlerSingOut}
                                        >
                                            Cerrar sesión
                                        </p>
                                    </div>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            <div className="py-8 px-4 mx-auto max-w-screen-xl sm:py-16 lg:px-6">
                {children}
            </div>
        </div>
    );
}
