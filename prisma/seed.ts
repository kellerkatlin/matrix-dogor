import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

const data = [
    {
        domainTitle: "5. POLÍTICAS DE SEGURIDAD",
        subdomains: [
            {
                subdomainTitle:
                    "5.1 Directrices de la Dirección en seguridad de la información",
                controls: [
                    {
                        title: "Conjunto de políticas para la seguridad de la información",
                    },
                    {
                        title: "Revisión de las políticas para la seguridad de la información",
                    },
                ],
            },
        ],
    },
    {
        domainTitle:
            "6. ASPECTOS ORGANIZATIVOS DE LA SEGURIDAD DE LA INFORMACIÓN",
        subdomains: [
            {
                subdomainTitle: "6.1 Organización interna",
                controls: [
                    {
                        title: "Asignación de responsabilidades para la seguridad de la información",
                    },
                    {
                        title: "Segregación de tareas",
                    },
                    {
                        title: "Contacto con las autoridades",
                    },
                    {
                        title: "Contacto con grupos de interés especial",
                    },
                    {
                        title: "Seguridad de la información en la gestión de proyectos",
                    },
                ],
            },
        ],
    },
    {
        domainTitle: "7. SEGURIDAD LIGADA A LOS RECURSOS HUMANOS",
        subdomains: [
            {
                subdomainTitle: "7.1 Antes de la contratación",
                controls: [
                    {
                        title: "Investigación de antecedentes",
                    },
                    {
                        title: "Términos y condiciones de contratación",
                    },
                ],
            },
        ],
    },
    {
        domainTitle: "8. GESTIÓN DE ACTIVOS",
        subdomains: [
            {
                subdomainTitle: "8.1 Responsabilidad sobre los activos",
                controls: [
                    {
                        title: "Inventario de activos",
                    },
                    {
                        title: "Propiedad de los activos",
                    },
                ],
            },
        ],
    },
    {
        domainTitle: "9. CONTROL DE ACCESOS",
        subdomains: [
            {
                subdomainTitle:
                    "9.1 Requisitos de negocio para el control de accesos",
                controls: [
                    {
                        title: "Política de control de accesos",
                    },
                    {
                        title: "Control de acceso a las redes y servicios asociados",
                    },
                ],
            },
        ],
    },
    {
        domainTitle: "10. CIFRADO",
        subdomains: [
            {
                subdomainTitle: "10.1 Controles criptográficos",
                controls: [
                    {
                        title: "Política de uso de los controles criptográficos",
                    },
                ],
            },
        ],
    },
    {
        domainTitle: "11. SEGURIDAD FÍSICA Y AMBIENTAL",
        subdomains: [
            {
                subdomainTitle: "11.1 Áreas seguras",
                controls: [
                    {
                        title: "Perímetro de seguridad física",
                    },
                    {
                        title: "Controles físicos de entrada",
                    },
                ],
            },
        ],
    },
    {
        domainTitle: "12. SEGURIDAD EN LA OPERATIVA",
        subdomains: [
            {
                subdomainTitle:
                    "12.1 Responsabilidades y procedimientos de operación",
                controls: [
                    {
                        title: "Documentación de procedimientos de operación",
                    },
                    {
                        title: "Gestión de cambios",
                    },
                ],
            },
        ],
    },
    {
        domainTitle: "13. SEGURIDAD EN LAS TELECOMUNICACIONES",
        subdomains: [
            {
                subdomainTitle: "13.1 Gestión de la seguridad en las redes",
                controls: [
                    {
                        title: "Controles de red",
                    },
                ],
            },
        ],
    },
    {
        domainTitle:
            "14. ADQUISICIÓN, DESARROLLO Y MANTENIMIENTO DE LOS SISTEMAS DE INFORMACIÓN",
        subdomains: [
            {
                subdomainTitle:
                    "14.1 Requisitos de seguridad de los sistemas de información",
                controls: [
                    {
                        title: "Análisis y especificación de los requisitos de seguridad",
                    },
                ],
            },
        ],
    },
    {
        domainTitle: "15. RELACIONES CON SUMINISTRADORES",
        subdomains: [
            {
                subdomainTitle:
                    "15.1 Seguridad de la información en las relaciones con suministradores",
                controls: [
                    {
                        title: "Política de seguridad de la información para suministradores",
                    },
                ],
            },
        ],
    },
    {
        domainTitle:
            "16. GESTIÓN DE INCIDENTES EN LA SEGURIDAD DE LA INFORMACIÓN",
        subdomains: [
            {
                subdomainTitle:
                    "16.1 Gestión de incidentes de seguridad de la información",
                controls: [
                    {
                        title: "Responsabilidades y procedimientos",
                    },
                ],
            },
        ],
    },
    {
        domainTitle:
            "17. ASPECTOS DE SEGURIDAD DE LA INFORMACIÓN EN LA GESTIÓN DE LA CONTINUIDAD DEL NEGOCIO",
        subdomains: [
            {
                subdomainTitle:
                    "17.1 Continuidad de la seguridad de la información",
                controls: [
                    {
                        title: "Planificación de la continuidad de la seguridad de la información",
                    },
                ],
            },
        ],
    },
    {
        domainTitle: "18. CUMPLIMIENTO",
        subdomains: [
            {
                subdomainTitle:
                    "18.1 Cumplimiento de los requisitos legales y contractuales",
                controls: [
                    {
                        title: "Identificación de la legislación aplicable",
                    },
                ],
            },
        ],
    },
];

async function createDomains() {
    for (const domainData of data) {
        // 1. Crear dominio
        const domain = await prisma.domain.create({
            data: {
                title: domainData.domainTitle,
            },
        });

        for (const subdomainData of domainData.subdomains) {
            // 2. Crear subdominio vinculado al dominio
            const subdomain = await prisma.subdomain.create({
                data: {
                    title: subdomainData.subdomainTitle,
                    domain: {
                        connect: { id: domain.id }, // Conectar al dominio
                    },
                },
            });

            // 3. Crear controles vinculados al subdominio
            await prisma.control.createMany({
                data: subdomainData.controls.map((control) => ({
                    title: control.title,
                    subdomainId: subdomain.id, // Conectar al subdominio
                })),
            });
        }
    }

    console.log("Dominios, subdominios y controles creados correctamente.");
}

async function main() {
    const password = "admin123";
    const superUserRole = await prisma.role.create({
        data: { name: "Super Usuario" },
    });
    const adminRole = await prisma.role.create({
        data: { name: "Administrador de Empresa" },
    });
    const eventManagerRole = await prisma.role.create({
        data: { name: "Gestor de Eventos" },
    });
    const auditorRole = await prisma.role.create({
        data: { name: "Auditor de Controles" },
    });
    const viewerRole = await prisma.role.create({
        data: { name: "Visualizador" },
    });
    console.log({
        superUserRole,
        adminRole,
        eventManagerRole,
        auditorRole,
        viewerRole,
    });

    if (!superUserRole) {
        console.error(
            "El rol 'Super Usuario' no existe. Por favor, crea el rol primero."
        );
        return;
    }

    const existingUser = await prisma.user.findFirst({
        where: {
            email: "admin@admin.com",
        },
    });

    if (!existingUser) {
        const admin = await prisma.user.create({
            data: {
                email: "admin@admin.com",
                username: "admin",
                password: await bcrypt.hash(password, 10),
                roleId: superUserRole.id,
            },
        });
        console.log("Admin created:", admin);
    } else {
        console.log("Admin already exists");
    }
}

createDomains().catch((e) => {
    console.error(e);
    process.exit(1);
});
main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
