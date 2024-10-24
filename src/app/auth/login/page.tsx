"use client";
import Image from "next/image";
import Link from "next/link";
import { SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";

type Inputs = {
    email: string;
    password: string;
};

export default function LoginPage() {
    const router = useRouter();
    const [captchaToken, setCaptchaToken] = useState<string | null>(null);
    const [attempts, setAttempts] = useState<number>(0);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<Inputs>();

    const [error, setError] = useState<string | null>(null);

    const toggleStatus = async (email: string) => {
        console.log(email);
        const res = await fetch("/api/users/toggle-status", {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email }),
        });

        const data = await res.json();

        if (res.ok) {
            setError(data.message);
        } else {
            setError(data.error);
        }
    };

    const onSubmit: SubmitHandler<Inputs> = async (data: Inputs) => {
        setError(null);

        if (attempts >= 3) {
            setError("Demasiados intentos, consultelo con su administrador.");
            await toggleStatus(data.email);
            return;
        }

        if (!captchaToken) {
            setError("Por favor completa el CAPTCHA.");
            return;
        }

        const res = await signIn("credentials", {
            email: data.email,
            password: data.password,
            redirect: false,
        });

        if (!res || res.error) {
            setAttempts((prev) => prev + 1);
            setError(res?.error || "Error de autenticación");
            return;
        }

        setAttempts(0);

        if (data.email === "admin@admin.com") {
            router.push("/admin");
        } else {
            router.push("/dashboard");
        }
    };

    return (
        <section className="bg-gray-50 dark:bg-gray-900">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto h-screen lg:py-0">
                <Link
                    href="#"
                    className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
                >
                    <Image
                        className="w-8 h-8 mr-2"
                        height={100}
                        width={100}
                        src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg"
                        alt="logo"
                    />
                    Grupo 6
                </Link>
                <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                            Inicia sesión en tu cuenta
                        </h1>
                        {error && <div className="text-red-500">{error}</div>}
                        <form
                            className="space-y-4 md:space-y-6"
                            onSubmit={handleSubmit(onSubmit)}
                        >
                            <div>
                                <label
                                    htmlFor="email"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >
                                    Tu email
                                </label>
                                <input
                                    type="email"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    placeholder="user@email.com"
                                    {...register("email", {
                                        required: "El email es obligatorio",
                                    })}
                                />
                                {errors.email && (
                                    <span className="text-red-500">
                                        {errors.email.message}
                                    </span>
                                )}
                            </div>

                            <div>
                                <label
                                    htmlFor="password"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >
                                    Tu contraseña
                                </label>
                                <input
                                    type="password"
                                    {...register("password", {
                                        required:
                                            "La contraseña es obligatoria",
                                    })}
                                    id="password"
                                    placeholder="••••••••"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                />
                                {errors.password && (
                                    <span className="text-red-500">
                                        {errors.password.message}
                                    </span>
                                )}
                            </div>
                            <ReCAPTCHA
                                sitekey={
                                    process.env
                                        .NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ""
                                }
                                onChange={(token) => setCaptchaToken(token)}
                            />
                            <div className="flex items-center justify-between"></div>
                            <button
                                type="submit"
                                className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                            >
                                Iniciar sesión
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}
