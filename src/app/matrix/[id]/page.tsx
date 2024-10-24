"use client";

import Loading from "@/app/components/Loading";
import RiskMatrix, { Matrix } from "@/app/components/RiskMatrix";
import { Domain, Subdomain } from "@prisma/client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function MatrixFound({ params }: { params: { id: string } }) {
    const [matrix, setMatrix] = useState<Matrix | null>(null);
    const [domains, setDomains] = useState([]);
    const [selectedDomain, setSelectedDomain] = useState(null);
    const [selectedSubdomain, setSelectedSubdomain] = useState(null);
    const [subdomains, setSubdomains] = useState([]);
    const [controls, setControls] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedControl, setSelectedControl] = useState<number | null>(null);

    const router = useRouter();
    const searchParams = useSearchParams();
    const companyId = searchParams.get("companyId");

    useEffect(() => {
        fetch("/api/domain")
            .then((response) => response.json())
            .then((data) => setDomains(data));
    }, []);
    useEffect(() => {
        if (selectedDomain) {
            const domain = domains.find((d: Domain) => d.id === selectedDomain);
            setSubdomains(domain.subdomains);
            setControls([]);
            setSelectedSubdomain(null);
        } else {
            setSubdomains([]);
            setControls([]);
        }
    }, [selectedDomain, domains]);

    useEffect(() => {
        if (selectedSubdomain) {
            const subdomain = subdomains.find(
                (s: Subdomain) => s.id === selectedSubdomain
            );
            setControls(subdomain.controls);
        } else {
            setControls([]);
        }
    }, [selectedSubdomain, subdomains]);

    useEffect(() => {
        if (params.id === "new") {
            setMatrix({
                id: 0,
                name: "",
                probabilities: [],
                impacts: [],
                riskLevels: [],
                events: [],
                companyId: companyId ? +companyId : 0,
            });
            setLoading(false);
        } else {
            const fetchMatrix = async () => {
                if (params.id) {
                    try {
                        const response = await fetch(
                            `/api/matrix/${params.id}`
                        );
                        const data = await response.json();
                        setMatrix(data);
                    } catch (error) {
                        console.error("Error fetching matrix:", error);
                    } finally {
                        setLoading(false);
                    }
                }
            };

            fetchMatrix();
        }
    }, [params.id]);
    console.log(matrix)
    if (loading) {
        return <Loading />;
    }
    

    if (!matrix || matrix.status === 404) {
        return (
            <section className="bg-white flex items-center justify-center h-screen">
                <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
                    <div className="mx-auto max-w-screen-sm text-center">
                        <h1 className="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-primary-600 ">
                            404
                        </h1>
                        <p className="mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl ">
                            Matriz no encontrada
                        </p>
                        <p className="mb-4 text-lg font-light text-gray-500 ">
                            La matriz que buscas no existe
                        </p>
                        <button
                            onClick={() => router.push("/dashboard")}
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
                        </button>
                    </div>
                </div>
            </section>
        );
    }

    const handlerSubmit = async (data: Matrix) => {
        const { id, companyId, ...rest } = data;
        const restWithCompanyId = { ...rest, companyId };
        console.log(restWithCompanyId);
        if (params.id === "new") {
            const response = await fetch("/api/matrix", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(restWithCompanyId),
            });
            const result = await response.json();
            if (response.ok) {
                alert("Matris creada correctamente");
                router.push(`/matrix/${result.matrix.id}`);
            } else {
                alert("Failed to create matrix");
            }
        } else {
            const response = await fetch(`/api/matrix/${params.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });
            if (response.ok) {
                alert("Matris acutalizada correctamente");
                window.location.reload();
            } else {
                alert("Error al actualizar la matriz");
            }
        }
    };

    const saveControls = async (eventId: number, controlId: number) => {
        try {
            const response = await fetch("/api/event-control", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ eventId, controlId }),
            });

            if (!response.ok) {
                throw new Error("Error al guardar el control para el evento");
            }

            const data = await response.json();
            setSelectedControl(null);
            console.log("Control guardado con éxito:", data);
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <>
            {/* <div>
                <label htmlFor="domain">Domain:</label>
                <select
                    id="domain"
                    value={selectedDomain || ""}
                    onChange={(e) => setSelectedDomain(Number(e.target.value))}
                >
                    <option value="" disabled>
                        Select a domain
                    </option>
                    {domains.map((domain) => (
                        <option key={domain.id} value={domain.id}>
                            {domain.title}
                        </option>
                    ))}
                </select>
            </div> */}

            {/* <div>
                <label htmlFor="subdomain">Subdomain:</label>
                <select
                    id="subdomain"
                    value={selectedSubdomain || ""}
                    onChange={(e) =>
                        setSelectedSubdomain(Number(e.target.value))
                    }
                    disabled={!selectedDomain}
                >
                    <option value="" disabled>
                        Select a subdomain
                    </option>
                    {subdomains.map((subdomain) => (
                        <option key={subdomain.id} value={subdomain.id}>
                            {subdomain.title}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label htmlFor="control">Control:</label>
                <select id="control" disabled={!selectedSubdomain}>
                    <option value="" disabled>
                        Select a control
                    </option>
                    {controls.map((control) => (
                        <option key={control.id} value={control.id}>
                            {control.title}
                        </option>
                    ))}
                </select>
            </div> */}

            <RiskMatrix
                matrix={matrix}
                domains={domains}
                saveControls={saveControls}
                subdomains={subdomains}
                selectedSubdomain={selectedSubdomain}
                selectedControl={selectedControl}
                setSelectedControl={setSelectedControl}
                setSelectedDomain={setSelectedDomain}
                setSelectedSubdomain={setSelectedSubdomain}
                controls={controls}
                selectedDomain={selectedDomain}
                handlerSubmit={handlerSubmit}
            />
        </>
    );
}
