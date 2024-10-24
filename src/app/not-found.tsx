"use client";
import Link from "next/link";

export default function NotFound() {
    return (
        <section className="bg-white flex items-center justify-center h-screen">
            <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
                <div className="mx-auto max-w-screen-sm text-center">
                    <h1 className="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-primary-600 ">
                        404
                    </h1>
                    <p className="mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl ">
                        Ups lo rompiste
                    </p>
                    <p className="mb-4 text-lg font-light text-gray-500 ">
                        La página que buscas no existe
                    </p>
                    <Link
                        href={"/dashboard"}
                        className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 "
                    >
                        Ir al dashboard
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
                                d="M1 5h12M8 1l4 4-4 4"
                            />
                        </svg>
                    </Link>
                </div>
            </div>
        </section>
    );
}
