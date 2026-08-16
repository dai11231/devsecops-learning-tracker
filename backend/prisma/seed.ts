import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

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
