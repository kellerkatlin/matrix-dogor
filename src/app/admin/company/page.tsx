"use client";

import { PencilAltIcon, TrashIcon } from "@heroicons/react/outline";
import { Company, User } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

export default function Admin() {
    const [modalCompany, setModalCompany] = useState(false);
    const [companies, setCompanies] = useState([]);
    const [userAccepted, setUserAccepted] = useState([]);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<Company>();
    const router = useRouter();
    const { data: session, status } = useSession();

    const handleModalToggle = () => {
        setModalCompany(!modalCompany);
    };

    useEffect(() => {
        fetch("/api/users/create")
            .then((res) => {
                if (!res.ok) throw new Error("Failed to fetch users");
                return res.json();
            })
            .then((data) => {
                const userSelected = data.filter(
                    (user: User) => user.roleId !== 1
                );
                setUserAccepted(userSelected);
            })
            .catch((error) => console.error(error));
    }, []);

    console.log(status);
    useEffect(() => {
        if (status === "authenticated" && session.user.id) {
            const userIdCompany = session.user.id;
            console.log(userIdCompany);

            fetch(`/api/users/create/${userIdCompany}`)
                .then((res) => {
                    if (!res.ok) throw new Error("Failed to fetch companies");
                    return res.json();
                })
                .then((data) => {
                    const { companies } = data;

                    setCompanies(companies);
                })
                .catch((error) => console.error(error));
        }
    }, [session, status]);

    const onSubmit: SubmitHandler<Company> = async (data: Company) => {
        const res = await fetch("/api/company", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: data.name,
                userId: data.userId,
            }),
        });

        if (res.ok) {
            alert("Empresa creada correctamente");
            handleModalToggle();
        }

        setCompanies([...companies, data]);
    };

    return (
        <div>
            <div className="mx-auto max-w-screen-sm text-center">
                <h1 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl ">
                    Empresas
                </h1>
            </div>
            <button
                onClick={handleModalToggle}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 my-7"
            >
                Crear una nueva empresa
            </button>

            {modalCompany && (
                <div
                    id="authentication-modal"
                    tabIndex={-1}
                    aria-hidden={!modalCompany}
                    className="fixed top-0 right-0 left-0 z-50 justify-center items-center w-full h-full bg-black bg-opacity-50"
                >
                    <div className="relative p-4 w-full max-w-md max-h-full">
                        <div className="relative bg-white rounded-lg shadow ">
                            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t ">
                                <h3 className="text-xl font-semibold text-gray-900 ">
                                    Sign in to our platform
                                </h3>
                                <button
                                    type="button"
                                    onClick={handleModalToggle} // Cerrar el modal al hacer clic
                                    className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center "
                                >
                                    <svg
                                        className="w-3 h-3"
                                        aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 14 14"
                                    >
                                        <path
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                                        />
                                    </svg>
                                    <span className="sr-only">Close modal</span>
                                </button>
                            </div>

                            <div className="p-4 md:p-5">
                                <form
                                    className="space-y-4"
                                    onSubmit={handleSubmit(onSubmit)}
                                >
                                    <div>
                                        <label
                                            htmlFor="name"
                                            className="block mb-2 text-sm font-medium text-gray-900 "
                                        >
                                            Tu nombre de Empresa
                                        </label>
                                        <input
                                            type="text"
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
                                            {...register("name", {
                                                required:
                                                    "El nombre de empresa es obligatorio",
                                            })}
                                        />
                                        {errors.name && (
                                            <span className="text-red-500">
                                                {errors.name.message}
                                            </span>
                                        )}
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="userId"
                                            className="block mb-2 text-sm font-medium text-gray-900"
                                        >
                                            Usuario Responsable
                                        </label>
                                        <select
                                            {...register("userId", {
                                                required:
                                                    "Seleccionar un usuario es obligatorio",
                                            })}
                                            className="text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                        >
                                            <option value="">
                                                Selecciona un usuario
                                            </option>
                                            {userAccepted.map((user: User) => (
                                                <option
                                                    key={user.id}
                                                    value={user.id}
                                                >
                                                    {user.username}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="flex items-start"></div>
                                    <button
                                        type="submit"
                                        className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                                    >
                                        Crear Empresa
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 ">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                Nombre De Empresa
                            </th>

                            <th scope="col" className="px-6 py-3">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {companies.length === 0 && (
                            <tr>
                                <td
                                    colSpan={2}
                                    className="px-6 py-4 text-center text-gray-500"
                                >
                                    No hay empresas registradas
                                </td>
                            </tr>
                        )}
                        {companies?.map((company: Company) => (
                            <tr
                                key={company.id}
                                className="odd:bg-white even:bg-gray-50  border-b"
                            >
                                <th
                                    scope="row"
                                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap "
                                >
                                    {company.name}
                                </th>
                                <td className="px-6 py-4 text-center ">
                                    <button
                                        className="font-medium text-blue-600 hover:text-blue-400"
                                        onClick={() => {
                                            router.push(
                                                `/admin/company/${company.id}`
                                            );
                                        }}
                                    >
                                        <PencilAltIcon className="w-5 h-5" />
                                    </button>
                                    <span className="mx-2">|</span>
                                    <button
                                        onClick={() => {
                                            if (
                                                confirm(
                                                    "¿Estás seguro de eliminar esta Empresa?"
                                                )
                                            ) {
                                                fetch(
                                                    `/api/company/${company.id}`,
                                                    {
                                                        method: "DELETE",
                                                    }
                                                )
                                                    .then((res) => res.json())
                                                    .then((data: any) => {
                                                        setCompanies(
                                                            companies.filter(
                                                                (u: Company) =>
                                                                    u.id !==
                                                                    company.id
                                                            )
                                                        );
                                                    });
                                            }
                                        }}
                                        className="font-medium text-red-600  hover:text-red-400"
                                    >
                                        <TrashIcon className="w-5 h-5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
