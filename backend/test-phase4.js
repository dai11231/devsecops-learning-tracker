const { PrismaClient } = require('@prisma/client');
const argon2 = require('argon2');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
require('dotenv').config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/devsecops_tracker?schema=public' });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function setupUsers() {
  const passwordHash = await argon2.hash('admin123');
  // Admin is already seeded. Let's create userB
  await prisma.user.upsert({
    where: { email: 'userb@devsecops.local' },
    update: {},
    create: { email: 'userb@devsecops.local', username: 'userb', passwordHash }
  });
}

async function test() {
  console.log('--- Setting up DB ---');
  await setupUsers();
  
  console.log('\n--- Testing Phase 4 API endpoints ---');
  // 1. Login Admin (User A)
  const resA = await fetch('http://localhost:3000/auth/login', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'admin', password: 'admin123' })
  });
  const cookieA = resA.headers.get('set-cookie');
  const headersA = { 'Cookie': cookieA, 'Content-Type': 'application/json' };

  // 2. Login User B
  const resB = await fetch('http://localhost:3000/auth/login', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'userb', password: 'admin123' })
  });
  const cookieB = resB.headers.get('set-cookie');
  const headersB = { 'Cookie': cookieB, 'Content-Type': 'application/json' };

  // Get topic id 1 (Linux Fundamentals)
  const topicId = 1;

  // 3. User A marks Topic 1 as COMPLETED
  const patchResA1 = await fetch(`http://localhost:3000/progress/${topicId}`, {
    method: 'PATCH', headers: headersA,
    body: JSON.stringify({ status: 'COMPLETED' })
  });
  console.log('User A marks Topic 1 COMPLETED:', patchResA1.status);

  // 4. User A marks Topic 1 as COMPLETED again (Idempotent test)
  const patchResA2 = await fetch(`http://localhost:3000/progress/${topicId}`, {
    method: 'PATCH', headers: headersA,
    body: JSON.stringify({ status: 'COMPLETED' })
  });
  console.log('User A marks Topic 1 COMPLETED (again):', patchResA2.status);

  // 5. User B marks Topic 1 as IN_PROGRESS
  const patchResB1 = await fetch(`http://localhost:3000/progress/${topicId}`, {
    method: 'PATCH', headers: headersB,
    body: JSON.stringify({ status: 'IN_PROGRESS' })
  });
  console.log('User B marks Topic 1 IN_PROGRESS:', patchResB1.status);

  // 6. Test Isolation
  const getProgA = await fetch(`http://localhost:3000/progress/${topicId}`, { headers: headersA });
  const dataA = await getProgA.json();
  console.log(`User A progress for Topic 1: ${dataA.status}, completedAt: ${dataA.completedAt ? 'Set' : 'Null'}`);

  const getProgB = await fetch(`http://localhost:3000/progress/${topicId}`, { headers: headersB });
  const dataB = await getProgB.json();
  console.log(`User B progress for Topic 1: ${dataB.status}, completedAt: ${dataB.completedAt ? 'Set' : 'Null'}`);

  if (dataA.status !== 'COMPLETED' || dataB.status !== 'IN_PROGRESS') {
    console.error('FAIL: User isolation failed!');
  } else {
    console.log('PASS: User isolation successful!');
  }

  // 7. Test User A Dashboard
  const dashResA = await fetch('http://localhost:3000/dashboard', { headers: headersA });
  const dashA = await dashResA.json();
  console.log('\n--- User A Dashboard ---');
  console.log(`Total Topics: ${dashA.overall.totalTopics}`);
  console.log(`Completed Topics: ${dashA.overall.completedTopics}`);
  console.log(`Percentage: ${dashA.overall.percentage}%`);

  // 8. Test User B Dashboard
  const dashResB = await fetch('http://localhost:3000/dashboard', { headers: headersB });
  const dashB = await dashResB.json();
  console.log('\n--- User B Dashboard ---');
  console.log(`Completed Topics: ${dashB.overall.completedTopics}`);
  console.log(`Percentage: ${dashB.overall.percentage}%`);

  // 9. Uncomplete topic for User A
  const patchResA3 = await fetch(`http://localhost:3000/progress/${topicId}`, {
    method: 'PATCH', headers: headersA,
    body: JSON.stringify({ status: 'IN_PROGRESS' })
  });
  console.log('\nUser A uncompleted Topic 1:', patchResA3.status);
  const dataA3 = await patchResA3.json();
  console.log(`User A progress now: ${dataA3.status}, completedAt: ${dataA3.completedAt ? 'Set' : 'Null'}`);

  await prisma.$disconnect();
}

test().catch(e => console.error(e));
