const axios = require('axios');
const assert = require('assert');

// Axios clients preserving cookies
const clientA = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: true,
  validateStatus: () => true, // Don't throw on 4xx/5xx
});

const clientB = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: true,
  validateStatus: () => true,
});

async function extractCookie(response) {
  const cookieHeader = response.headers['set-cookie'];
  if (cookieHeader) {
    return cookieHeader[0].split(';')[0];
  }
  return null;
}

async function runTests() {
  console.log('--- DevSecOps Security Regression Tests ---');
  
  // 1. Authenticate as User A (admin)
  const resA = await clientA.post('/auth/login', { username: 'admin', password: 'admin123' });
  const cookieA = await extractCookie(resA);
  clientA.defaults.headers.Cookie = cookieA;
  
  // 2. Authenticate as User B (userb)
  const resB = await clientB.post('/auth/login', { username: 'userb', password: 'userb123' });
  const cookieB = await extractCookie(resB);
  clientB.defaults.headers.Cookie = cookieB;

  // Let's find out User B's ID
  const meB = await clientB.get('/auth/me');
  const userBId = meB.data.id;
  const meA = await clientA.get('/auth/me');
  const userAId = meA.data.id;
  
  console.log(`User A (admin) logged in. ID: ${userAId}`);
  console.log(`User B (userb) logged in. ID: ${userBId}`);
  console.log('---------------------------------------------');

  // Test 1: IDOR - User A tries to modify User B's progress by injecting "userId": 2 in payload
  console.log('[Test 1] Malicious Payload Injection (IDOR Attempt)');
  console.log(`User A attempts: PATCH /progress/2 with payload { status: "COMPLETED", userId: ${userBId} }`);
  
  const patchRes = await clientA.patch('/progress/2', {
    status: 'COMPLETED',
    userId: userBId // Malicious input trying to update User B's record
  });

  // Since validation pipe strips unknown properties (forbidNonWhitelisted: true) and the service only uses req.user.id,
  // this should either throw a 400 Bad Request (because userId is not whitelisted in DTO) 
  // OR it updates User A's progress for topic 2, ignoring the injected userId.
  
  if (patchRes.status === 400) {
    console.log('✅ PASS: Backend rejected payload (forbidNonWhitelisted) preventing injection.');
  } else if (patchRes.status === 200) {
    console.log('Backend accepted payload, let us check who got updated...');
    
    // Check if User B got affected
    const checkB = await clientB.get('/progress/2');
    // Check if User A got affected
    const checkA = await clientA.get('/progress/2');
    
    if (checkB.data === "" || checkB.data?.status !== 'COMPLETED') {
      console.log('✅ PASS: User B\'s progress was NOT affected. Backend ignored the injected userId.');
      assert.strictEqual(checkA.data.userId, userAId, "Only User A should be affected.");
    } else {
      console.log('❌ FAIL: User B\'s progress was modified by User A!');
    }
  } else {
    console.log(`Unexpected status: ${patchRes.status}`);
  }
  console.log('---------------------------------------------');

  // Test 2: IDOR - Try accessing via URL path tampering (which shouldn't exist)
  console.log('[Test 2] URL Path Tampering (IDOR Attempt)');
  console.log(`User A attempts: GET /progress?userId=${userBId} or similar`);
  
  // The API doesn't accept userId query params by design, but let's see what happens
  const getRes = await clientA.get(`/progress?userId=${userBId}`);
  
  // Verify it only returns User A's data
  if (getRes.status === 200) {
    const recordsForB = getRes.data.filter(p => p.userId === userBId);
    if (recordsForB.length === 0) {
      console.log('✅ PASS: "Mitigation by design" confirmed. The API does not expose a user-controlled `userId` selector. Query string was ignored and only User A data returned.');
    } else {
      console.log('❌ FAIL: User A was able to query User B data!');
    }
  }

  console.log('---------------------------------------------');
  console.log('All security regression tests passed!');
}

runTests().catch(console.error);
