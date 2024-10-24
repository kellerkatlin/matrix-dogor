"use client";

import { TrashIcon } from "@heroicons/react/outline";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

type Inputs = {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    roleId: number;
};
export default function Admin() {
    const { data: session } = useSession();

    const [modalUser, setModalUser] = useState(false);
    const [users, setUsers] = useState([]);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<Inputs>();
    const handleModalToggle = () => {
        setModalUser(!modalUser); // Alternar la visibilidad del modal
    };
    console.log(session?.user);

    useEffect(() => {
        fetch("/api/users/create")
            .then((res) => res.json())
            .then((data) => {
                setUsers(data);
            });
    }, []);
    const toggleStatus = async (id: number, status: boolean) => {
        const res = await fetch(`/api/users/create/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                status: !status,
            }),
        });

        if (res.ok) {
            setUsers(
                users.map((user: any) =>
                    user.id === id ? { ...user, status: !status } : user
                )
            );
        }
    };
    const onSubmit: SubmitHandler<Inputs> = async (data: Inputs) => {
        if (data.password !== data.confirmPassword) {
            alert("Las contraseñas no coinciden");
            return;
        }

        const res = await fetch("/api/users/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: data.username,
                email: data.email,
                password: data.password,
                roleId: +data.roleId,
            }),
        });

        if (res.ok) {
            alert("Usuario creado correctamente");
            handleModalToggle();
        }

        setUsers([...users, data]);
    };

    return (
        <div>
            <div className="mx-auto max-w-screen-sm text-center">
                <h1 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl ">
                    Matrices de riesgo
                </h1>
            </div>
            <button
                onClick={handleModalToggle}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 my-7"
            >
                Crear un nuevo usuario
            </button>

            {modalUser && (
                <div
                    id="authentication-modal"
                    tabIndex={-1}
                    aria-hidden={!modalUser}
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
                                            htmlFor="username"
                                            className="block mb-2 text-sm font-medium text-gray-900 "
                                        >
                                            Tu nombre de usuario
                                        </label>
                                        <input
                                            type="text"
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
                                            {...register("username", {
                                                required:
                                                    "El nombre de usuario es obligatorio",
                                            })}
                                        />
                                        {errors.username && (
                                            <span className="text-red-500">
                                                {errors.username.message}
                                            </span>
                                        )}
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="email"
                                            className="block mb-2 text-sm font-medium text-gray-900 "
                                        >
                                            Tu email
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                            placeholder="name@company.com"
                                            {...register("email", {
                                                required:
                                                    "El correo electrónico es obligatorio",
                                            })}
                                        />
                                        {errors.email && (
                                            <span className="text-red-500">
                                                {errors.email.message}
                                            </span>
                                        )}
                                    </div>
                                    <div className="max-w-sm mx-auto">
                                        <label
                                            htmlFor="rol"
                                            className="block mb-2 text-sm font-medium text-gray-900 "
                                        >
                                            Select an option
                                        </label>
                                        <select
                                            id="rol"
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                            {...register("roleId", {
                                                required: "Rol es obligatorio",
                                            })}
                                        >
                                            <option selected>Elegir Rol</option>
                                            <option value="2">
                                                Administrador de Empresas
                                            </option>
                                            <option value="3">
                                                Gestor de Eventos
                                            </option>
                                            <option value="4">
                                                Auditor de Controles
                                            </option>
                                            <option value="5">
                                                Visualizador
                                            </option>
                                        </select>
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="password"
                                            className="block mb-2 text-sm font-medium text-gray-900"
                                        >
                                            Contraseña
                                        </label>
                                        <input
                                            type="password"
                                            id="password"
                                            placeholder="••••••••"
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                            {...register("password", {
                                                required:
                                                    "La contraseña es obligatoria",
                                            })}
                                        />
                                        {errors.password && (
                                            <span className="text-red-500">
                                                {errors.password.message}
                                            </span>
                                        )}
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="confirmPassword"
                                            className="block mb-2 text-sm font-medium text-gray-900"
                                        >
                                            Confirmar contraseña
                                        </label>
                                        <input
                                            type="password" // Cambiado de "confirm-password" a "password"
                                            id="confirmPassword"
                                            placeholder="••••••••"
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                            {...register("confirmPassword", {
                                                required:
                                                    "Confirma la contraseña",
                                            })}
                                        />
                                        {errors.confirmPassword && (
                                            <span className="text-red-500">
                                                {errors.confirmPassword.message}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-start"></div>
                                    <button
                                        type="submit"
                                        className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                                    >
                                        Crear cuenta
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
                                Nombre
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Correo
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Rol
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Estado
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user: any) => (
                            <tr
                                key={user.id}
                                className="odd:bg-white even:bg-gray-50  border-b"
                            >
                                <th
                                    scope="row"
                                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap "
                                >
                                    {user.username}
                                </th>
                                <td className="px-6 py-4">{user.email}</td>
                                <td className="px-6 py-4">{user.role?.name}</td>
                                <td className="px-6 py-4">
                                    {user.roleId !== 1 && (
                                        <button
                                            onClick={() =>
                                                toggleStatus(
                                                    user.id,
                                                    user.status
                                                )
                                            }
                                            className={`${
                                                user.status
                                                    ? "bg-green-500"
                                                    : "bg-red-500"
                                            } text-white px-4 py-2 rounded-lg`}
                                        >
                                            {user.status
                                                ? "Activado"
                                                : "Desactivado"}
                                        </button>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <button
                                        onClick={() => {
                                            if (user.id !== 1) {
                                                if (
                                                    confirm(
                                                        "¿Estás seguro de eliminar este usuario?"
                                                    )
                                                ) {
                                                    fetch(
                                                        `/api/users/create/${user.id}`,
                                                        {
                                                            method: "DELETE",
                                                        }
                                                    )
                                                        .then((res) =>
                                                            res.json()
                                                        )
                                                        .then((data) => {
                                                            setUsers(
                                                                users.filter(
                                                                    (u: any) =>
                                                                        u.id !==
                                                                        user.id
                                                                )
                                                            );
                                                        });
                                                }
                                            } else {
                                                alert(
                                                    "No puedes eliminar este usuario Super Admin"
                                                );
                                            }
                                        }}
                                        className="font-medium text-red-600  hover:text-red-400"
                                    >
                                        <TrashIcon className="w-5 h-5 " />
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
