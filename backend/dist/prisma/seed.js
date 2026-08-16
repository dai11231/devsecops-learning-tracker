"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const argon2 = __importStar(require("argon2"));
const pg_1 = require("pg");
const adapter_pg_1 = require("@prisma/adapter-pg");
const pool = new pg_1.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new adapter_pg_1.PrismaPg(pool);
const prisma = new client_1.PrismaClient({ adapter });
const categories = [
    {
        name: 'Linux', slug: 'linux', order: 1, topics: [
            'Linux Fundamentals', 'Filesystem', 'Users & Groups', 'File Permissions',
            'Processes', 'systemd', 'Package Management', 'Environment Variables',
            'SSH', 'Logs', 'Disk & Storage', 'Linux Networking', 'Bash Fundamentals',
            'Shell Scripting', 'Linux Security'
        ]
    },
    {
        name: 'Networking', slug: 'networking', order: 2, topics: [
            'OSI Model', 'TCP/IP Model', 'IP Addressing', 'Subnetting', 'TCP vs UDP',
            'Ports', 'DNS', 'DHCP', 'ARP', 'Routing', 'NAT', 'HTTP/HTTPS', 'TLS/SSL',
            'Firewalls', 'Proxy & Reverse Proxy', 'Network Troubleshooting'
        ]
    },
    {
        name: 'Git & GitHub', slug: 'git-github', order: 3, topics: [
            'Git Fundamentals', 'Branching', 'Merge & Rebase', 'Conflict Resolution',
            'GitHub', 'Pull Requests', 'GitHub Actions', 'Git Security'
        ]
    },
    { name: 'Bash & Automation', slug: 'bash-automation', order: 4, topics: [] },
    {
        name: 'Docker', slug: 'docker', order: 5, topics: [
            'Containers', 'Images', 'Dockerfile', 'Volumes', 'Networks',
            'Docker Compose', 'Multi-stage Builds', 'Container Security'
        ]
    },
    { name: 'Nginx', slug: 'nginx', order: 6, topics: [] },
    { name: 'Azure', slug: 'azure', order: 7, topics: [] },
    { name: 'CI/CD', slug: 'cicd', order: 8, topics: [] },
    { name: 'DevSecOps & Security Tools', slug: 'devsecops-security-tools', order: 9, topics: [] },
    { name: 'Monitoring', slug: 'monitoring', order: 10, topics: [] },
    { name: 'Kubernetes', slug: 'kubernetes', order: 11, topics: [] }
];
async function main() {
    const passwordHash = await argon2.hash('admin123');
    const user = await prisma.user.upsert({
        where: { email: 'admin@devsecops.local' },
        update: {},
        create: { email: 'admin@devsecops.local', username: 'admin', passwordHash },
    });
    console.log('Seed executed. Admin user created:', user.username);
    for (const cat of categories) {
        const category = await prisma.category.upsert({
            where: { slug: cat.slug },
            update: { name: cat.name, order: cat.order },
            create: { name: cat.name, slug: cat.slug, order: cat.order }
        });
        let topicOrder = 1;
        for (const topicName of cat.topics) {
            const topicSlug = `${cat.slug}-${topicName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
            await prisma.topic.upsert({
                where: { slug: topicSlug },
                update: { name: topicName, order: topicOrder, categoryId: category.id },
                create: { name: topicName, slug: topicSlug, order: topicOrder, categoryId: category.id }
            });
            topicOrder++;
        }
    }
    const cCount = await prisma.category.count();
    const tCount = await prisma.topic.count();
    console.log(`Learning roadmap seeded. Categories: ${cCount}, Topics: ${tCount}`);
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map