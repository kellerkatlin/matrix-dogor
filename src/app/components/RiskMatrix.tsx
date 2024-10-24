"use client";

import { Control, Domain, Subdomain } from "@prisma/client";
import Link from "next/link";
import { useEffect, useState } from "react";

export type Matrix = {
    id: number;
    name: string;
    probabilities: { id: number; value: number }[];
    impacts: { id: number; value: number }[];
    riskLevels: RiskLevel[];
    events: Event[];
    status?: number;
    companyId?: number;
};

type RiskLevel = {
    color: string;
    label: string;
    min: number;
    max: number;
};

type Event = {
    name: string;
    probability: number;
    impact: number;
    value: number;
    riskLevel: string;
};

const initialRiskLevels: RiskLevel[] = [
    { color: "bg-green-500", label: "Riesgo Aceptable", min: 0, max: 0 },
    { color: "bg-yellow-300", label: "Riesgo Tolerable", min: 0, max: 0 },
    { color: "bg-orange-400", label: "Riesgo Alto", min: 0, max: 0 },
    { color: "bg-red-500", label: "Riesgo Extremo", min: 0, max: 0 },
];

export default function RiskMatrix({
    matrix,
    handlerSubmit,
    domains,
    subdomains,
    controls,
    saveControls,
    selectedSubdomain,
    setSelectedSubdomain,
    setSelectedDomain,
    selectedDomain,
    selectedControl,
    setSelectedControl,
}: {
    matrix: Matrix;
    handlerSubmit: (data: Matrix) => Promise<void>;
    domains: Domain[];
    subdomains: Subdomain[];
    controls: Control[];
    seletedSubdomain: number | null;
    selectedDomain: number | null;
    setSelectedSubdomain: (id: number) => void | null;
    setSelectedDomain: (id: number) => void | null;
    selectedSubdomain: number | null;
    selectedControl: number | null;
    saveControls: (eventId: number, controlId: number) => void | null;
    setSelectedControl: (id: number) => void | null;
}) {
    const [probabilities, setProbabilities] = useState<number[]>(
        Array(5).fill(0)
    );

    const [impacts, setImpacts] = useState<number[]>(Array(5).fill(0));
    const [riskLevels, setRiskLevels] =
        useState<RiskLevel[]>(initialRiskLevels);
    const [events, setEvents] = useState<Event[]>([]);
    const [matrixState, setMatrixState] = useState<Matrix | null>(null);
    const [nameMatrix, setNameMatrix] = useState<string>("");
    const [newEvent, setNewEvent] = useState<Event>({
        name: "",
        probability: 0,
        impact: 0,
        value: 0,
        riskLevel: "",
    });

    const handleControlChange = (e, index) => {
        setSelectedControl(Number(e.target.value));
    };
    useEffect(() => {
        setMatrixState(matrix);
        setNameMatrix(matrix.name);
        setProbabilities(matrix.probabilities.map((p) => p.value));
        const updatedRiskLevels = initialRiskLevels.map((level, index) => ({
            ...level,
            min: matrix.riskLevels[index]?.min || 0,
            max: matrix.riskLevels[index]?.max || 0,
        }));

        setRiskLevels(updatedRiskLevels);
        setImpacts(matrix.impacts.map((i) => i.value));
        setEvents(matrix.events);
    }, [matrix]);

    const updateRiskLevel = (
        index: number,
        field: "min" | "max",
        value: number
    ) => {
        const updatedLevels = [...riskLevels];
        updatedLevels[index][field] = value;
        setRiskLevels(updatedLevels);
    };

    const getRiskLevel = (value: number): string => {
        const level = matrix.riskLevels.find(
            (level) => value >= level.min && value <= level.max
        );
        return level ? level.label : "N/A";
    };

    const handleCreateEvent = () => {
        const value = newEvent.probability * newEvent.impact;
        const riskLevel = getRiskLevel(value);
        const event = { ...newEvent, value, riskLevel };

        setEvents([...events, event]);

        setNewEvent({
            name: "",
            probability: 0,
            impact: 0,
            value: 0,
            riskLevel: "",
        });
    };

    const handleRemoveEvent = (index: number) => {
        const updatedEvents = events.filter((_, i) => i !== index);
        setEvents(updatedEvents);
    };
    const handleCreate = async () => {
        if (!nameMatrix) {
            alert("Por favor, ingrese un nombre para la matriz");
            return;
        }

        const data = {
            ...matrixState,
            id: matrix.id || 0,
            name: nameMatrix || "",
            probabilities: probabilities
                ? probabilities.map((value, index) => ({ id: index, value }))
                : [],
            impacts: impacts
                ? impacts.map((value, index) => ({ id: index, value }))
                : [],
            riskLevels,
            events,
        };
        setMatrixState(data);
        await handlerSubmit(data);
    };

    return (
        <div className="p-4 max-w-6xl mx-auto bg-white shadow-lg rounded-lg pb-12">
            <div className="flex justify-between mb-4">
                {/* boton para regresar a dashboard */}
                <Link
                    href="/dashboard"
                    className="text-blue-500 hover:text-blue-600 focus:outline-none"
                >
                    <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15 19l-7-7 7-7"
                        ></path>
                    </svg>
                </Link>

                <h1 className="text-2xl font-semibold text-gray-700">
                    {matrix.name ? matrix.name : "Nueva Matriz"}
                </h1>
                <button
                    onClick={handleCreate}
                    className="px-4 p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-150 ease-in-out"
                >
                    {matrix.id ? "Actualizar" : "Crear"}
                </button>
            </div>
            <div className="mb-6 w-4/12">
                <label
                    htmlFor="default-input"
                    className="block mb-2 text-sm font-medium text-gray-900 "
                >
                    Nombre de la matriz
                </label>
                <input
                    type="text"
                    value={nameMatrix}
                    onChange={(e) => setNameMatrix(e.target.value)}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5    "
                />
            </div>

            <div className="mb-10 mt-8">
                <div className="flex">
                    {/* Probability labels and inputs */}
                    <div className="w-40 mr-2 flex flex-col">
                        <div className="invisible">
                            <h2 className="text-xl font-semibold mb-2 text-gray-700 bg-gray-200 p-2 text-center">
                                IMPACTO
                            </h2>
                            <div className="h-16"></div>{" "}
                        </div>
                        {["Muy Alta", "Alta", "Media", "Baja", "Muy Baja"].map(
                            (label, index) => (
                                <div
                                    key={label}
                                    className="flex items-center  h-[50px]"
                                >
                                    <span className="w-20 text-sm">
                                        {label}
                                    </span>
                                    <input
                                        type="number"
                                        value={probabilities[index] || ""}
                                        onChange={(e) => {
                                            const newProbabilities = [
                                                ...probabilities,
                                            ];
                                            newProbabilities[index] =
                                                Number(e.target.value) || 0;
                                            setProbabilities(newProbabilities);
                                        }}
                                        className="w-20 p-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                            )
                        )}
                    </div>

                    <div className="flex-1">
                        <h2 className="text-xl font-semibold mb-2 text-gray-700 bg-gray-200 p-2 text-center">
                            IMPACTO
                        </h2>
                        <div className="flex mb-2">
                            {[
                                "Mínima",
                                "Menor",
                                "Moderada",
                                "Mayor",
                                "Máxima",
                            ].map((label, index) => (
                                <div key={label} className="flex-1 px-1">
                                    <div className="text-center text-sm mb-1">
                                        {label}
                                    </div>
                                    <input
                                        type="number"
                                        value={impacts[index] || ""}
                                        onChange={(e) => {
                                            const newImpacts = [...impacts];
                                            newImpacts[index] =
                                                Number(e.target.value) || 0;
                                            setImpacts(newImpacts);
                                        }}
                                        className="w-full p-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                            ))}
                        </div>

                        {/* Risk matrix */}
                        <table className="w-full h-[250px] border-collapse">
                            <tbody>
                                {[
                                    "Muy Alta",
                                    "Alta",
                                    "Media",
                                    "Baja",
                                    "Muy Baja",
                                ].map((_, probIndex) => (
                                    <tr key={probIndex}>
                                        {impacts.map((impact, impactIndex) => {
                                            const prob =
                                                probabilities[probIndex];
                                            const value = prob * impact;
                                            const riskLevel = riskLevels.find(
                                                (level) =>
                                                    value >= level.min &&
                                                    value <= level.max
                                            );
                                            return (
                                                <td
                                                    key={`${probIndex}-${impactIndex}`}
                                                    className={` border border-gray-300 text-center ${
                                                        value
                                                            ? riskLevel
                                                                ? riskLevel.color
                                                                : "bg-gray-100"
                                                            : "bg-white"
                                                    }`}
                                                >
                                                    {value || ""}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                {/* Probability label outside and below the matrix */}
                <div className="mt-3 w-40 mr-2">
                    <h2 className="text-xl font-semibold text-gray-700 bg-gray-200 p-2 text-center">
                        PROBABILIDAD
                    </h2>
                </div>
            </div>

            {/* Risk levels */}
            <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4 text-gray-700">
                    Niveles de Riesgo
                </h2>
                <table className="w-full">
                    <thead>
                        <tr className="bg-gray-50">
                            <th className="p-2 text-left">Color</th>
                            <th className="p-2 text-left">Nivel de Riesgo</th>
                            <th className="p-2 text-left">Rango De</th>
                            <th className="p-2 text-left">Rango A</th>
                        </tr>
                    </thead>
                    <tbody>
                        {riskLevels.map((level, index) => (
                            <tr
                                key={index}
                                className="border-b border-gray-200"
                            >
                                <td className="p-2">
                                    <div
                                        className={`w-6 h-6 ${level.color} rounded`}
                                    ></div>
                                </td>
                                <td className="p-2">{level.label}</td>
                                <td className="p-2">
                                    <input
                                        type="number"
                                        value={level.min || ""}
                                        onChange={(e) =>
                                            updateRiskLevel(
                                                index,
                                                "min",
                                                Number(e.target.value)
                                            )
                                        }
                                        className="w-20 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </td>
                                <td className="p-2">
                                    <input
                                        type="number"
                                        value={level.max || ""}
                                        onChange={(e) =>
                                            updateRiskLevel(
                                                index,
                                                "max",
                                                Number(e.target.value)
                                            )
                                        }
                                        className="w-20 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Create event */}
            <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4 text-gray-700">
                    Crear Evento
                </h2>
                <div className="flex space-x-4">
                    <input
                        type="text"
                        placeholder="Nombre del evento"
                        value={newEvent.name}
                        onChange={(e) =>
                            setNewEvent({ ...newEvent, name: e.target.value })
                        }
                        className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <input
                        type="number"
                        placeholder="Probabilidad"
                        value={newEvent.probability || ""}
                        onChange={(e) =>
                            setNewEvent({
                                ...newEvent,
                                probability: Number(e.target.value),
                            })
                        }
                        className="w-32 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <input
                        type="number"
                        placeholder="Impacto"
                        value={newEvent.impact || ""}
                        onChange={(e) =>
                            setNewEvent({
                                ...newEvent,
                                impact: Number(e.target.value),
                            })
                        }
                        className="w-32 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                        onClick={handleCreateEvent}
                        className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition duration-150 ease-in-out"
                    >
                        Crear evento
                    </button>
                </div>
            </div>

            {/* Events list */}
            <div className="overflow-x-auto">
                {events.length > 0 && (
                    <div>
                        <h2 className="text-xl font-semibold mb-4 text-gray-700">
                            Eventos
                        </h2>
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-50">
                                    <th className="p-2 text-left">Evento</th>

                                    <th className="p-2 text-left">Valor</th>
                                    <th className="p-2 text-left">
                                        Nivel de Riesgo
                                    </th>
                                    <th className="p-2 text-left w-10">
                                        Domain
                                    </th>
                                    <th className="p-2 text-left w-10">
                                        Subdomain
                                    </th>
                                    <th className="p-2 text-left w-10">
                                        Control
                                    </th>
                                    <th className="p-2 text-left w-10">
                                        Acción
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {events.map((event, index) => (
                                    <tr
                                        key={index}
                                        className={`border-b border-gray-200 ${
                                            event.riskLevel === "Riesgo Extremo"
                                                ? "bg-red-500"
                                                : event.riskLevel ===
                                                  "Riesgo Alto"
                                                ? "bg-orange-400"
                                                : event.riskLevel ===
                                                  "Riesgo Tolerable"
                                                ? "bg-yellow-300"
                                                : event.riskLevel ===
                                                  "Riesgo Aceptable"
                                                ? "bg-green-500"
                                                : ""
                                        }`}
                                    >
                                        <td className="p-2">{event.name}</td>

                                        <td className="p-2">{event.value}</td>
                                        <td className="p-2">
                                            {event.riskLevel}
                                        </td>

                                        {/* Domain Select */}
                                        <td className="p-2">
                                            <select
                                                id="domain"
                                                value={selectedDomain || ""}
                                                onChange={(e) =>
                                                    setSelectedDomain(
                                                        Number(e.target.value)
                                                    )
                                                }
                                            >
                                                <option value="" disabled>
                                                    Select a domain
                                                </option>
                                                {domains.map((domain) => (
                                                    <option
                                                        key={domain.id}
                                                        value={domain.id}
                                                    >
                                                        {domain.title}
                                                    </option>
                                                ))}
                                            </select>
                                        </td>

                                        {/* Subdomain Select */}
                                        <td className="p-2">
                                            <select
                                                id="subdomain"
                                                value={selectedSubdomain || ""}
                                                onChange={(e) =>
                                                    setSelectedSubdomain(
                                                        Number(e.target.value)
                                                    )
                                                }
                                                disabled={!selectedDomain}
                                            >
                                                <option value="" disabled>
                                                    Select a subdomain
                                                </option>
                                                {subdomains.map((subdomain) => (
                                                    <option
                                                        key={subdomain.id}
                                                        value={subdomain.id}
                                                    >
                                                        {subdomain.title}
                                                    </option>
                                                ))}
                                            </select>
                                        </td>

                                        {/* Control Select */}
                                        <td className="p-2">
                                            <select
                                                value={selectedControl || ""}
                                                onChange={(e) =>
                                                    handleControlChange(
                                                        e,
                                                        index
                                                    )
                                                }
                                                disabled={!selectedSubdomain}
                                            >
                                                <option value="" disabled>
                                                    Select a control
                                                </option>
                                                {controls.map((control) => (
                                                    <option
                                                        key={control.id}
                                                        value={control.id}
                                                    >
                                                        {control.title}
                                                    </option>
                                                ))}
                                            </select>
                                        </td>

                                        {/* Action Buttons */}
                                        <td className="p-2">
                                            <button
                                                onClick={() =>
                                                    handleRemoveEvent(index)
                                                }
                                                className="text-white hover:text-gray-700 transition duration-150 ease-in-out"
                                            >
                                                Quitar
                                            </button>
                                            <button
                                                onClick={() =>
                                                    saveControls(
                                                        event.id,
                                                        +selectedControl
                                                    )
                                                }
                                                disabled={!selectedControl}
                                                className={`ml-2 px-4 py-2 text-white rounded ${
                                                    selectedControl
                                                        ? "bg-blue-500 hover:bg-blue-700"
                                                        : "bg-gray-300"
                                                }`}
                                            >
                                                Guardar
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
            <div className="flex justify-between pt-12">
                <div>{""}</div>
                <button
                    onClick={handleCreate}
                    className="px-4 p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-150 ease-in-out"
                >
                    {matrix.id ? "Actualizar" : "Crear"}
                </button>
            </div>
        </div>
    );
}
