"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Matrix } from "./RiskMatrix";

type Matrices = {
    handlerDelete: (matrix: Matrix) => Promise<void>;
    matrices: Matrix[];
};

export default function MatrixCard({ matrices, handlerDelete }: Matrices) {
    const router = useRouter();

    return (
        <div className="flex flex-wrap gap-4 p-4">
            {matrices.map((matrix) => (
                <div
                    key={matrix.id}
                    className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow"
                >
                    <Link href="#">
                        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 ">
                            {matrix.name}
                        </h5>
                    </Link>
                    <p className="mb-3 font-normal text-gray-700 text-justify">
                        Descripción de la matriz de riesgo que tiene como
                        objetivo evaluar los riesgos de la empresa. Tiene{" "}
                        {matrix.events.length} eventos.
                    </p>
                    <div className="flex justify-between">
                        <button
                            onClick={() => handlerDelete(matrix)}
                            className="inline-flex items-center text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-3 py-2 text-center "
                        >
                            Eliminar
                            <svg
                                className="rtl:rotate-180 w-2.5 h-2.5 ms-2"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 14 14"
                            >
                                <path
                                    stroke="currentColor"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                                />
                            </svg>
                        </button>
                        <button
                            onClick={() => router.push(`/matrix/${matrix.id}`)}
                            className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 "
                        >
                            Ver Matriz
                            <svg
                                className="rtl:rotate-180 w-3.5 h-3.5 ms-2"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 14 10"
                            >
                                <path
                                    stroke="currentColor"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M1 5h12m0 0L9 1m4 4L9 9"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}
