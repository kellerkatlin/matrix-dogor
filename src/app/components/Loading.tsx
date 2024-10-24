import React from "react";

export default function Loading() {
    return (
        <div className="flex items-center justify-center h-screen border border-gray-200 rounded-lg bg-gray-50 ">
            <div className="px-3 py-1 text-2xl font-medium leading-none text-center text-blue-800 bg-blue-200 rounded-full animate-pulse ">
                Cargando...
            </div>
        </div>
    );
}
