"use client";
import { useEffect, useState } from "react";
import MatrixCard from "../components/MatrixCard";
import { useRouter } from "next/navigation";
import { Matrix } from "../components/RiskMatrix";
import Loading from "../components/Loading";
import { signOut, useSession } from "next-auth/react";

export default function Dashboard() {
    const [matrices, setMatrices] = useState([]);
    const [loading, setLoading] = useState(true);

    const router = useRouter();
    useEffect(() => {
        fetch("/api/matrix")
            .then((res) => res.json())
            .then((data) => {
                setMatrices(data);
                setLoading(false);
            });
    }, []);
    if (loading) {
        <Loading />;
    }
    const handlerDelete = async (matrix: Matrix) => {
        if (!confirm(" ¿Estás seguro de que deseas eliminar esta matriz?")) {
            return;
        }

        try {
            const response = await fetch(`/api/matrix/${matrix.id}`, {
                method: "DELETE",
            });
            if (response.ok) {
                setMatrices((prev) =>
                    prev.filter((item: Matrix) => item.id !== matrix.id)
                );
            } else {
                console.error("Failed to delete matrix");
            }
        } catch (error) {
            console.error("Failed to delete matrix:", error);
        }
    };
    const { data: session } = useSession();
    console.log(session?.user);
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

    return (
        <div className="py-8 px-4 mx-auto max-w-screen-xl sm:py-16 lg:px-6">
            <div className="mx-auto max-w-screen-sm text-center">
                <h1 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl ">
                    Matrices de riesgo
                </h1>
            </div>
            <div className="px-10 flex justify-between">
                <button
                    onClick={handlerSingOut}
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-red-700 rounded-lg hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 "
                >
                    Cerrar sesión
                </button>
                <button
                    onClick={() => router.push("/matrix/new")}
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 "
                >
                    Crear nueva matriz
                </button>
            </div>

            {matrices.length === 0 ? (
                <div className="flex items-center justify-center h-screen">
                    <p className="text-2xl font-bold text-gray-900">
                        No hay matrices de riesgo
                    </p>
                </div>
            ) : (
                <MatrixCard matrices={matrices} handlerDelete={handlerDelete} />
            )}
        </div>
    );
}
