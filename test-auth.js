async function test() {
  console.log('Testing successful login...');
  const res1 = await fetch('http://localhost:3000/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'admin', password: 'admin123' })
  });
  console.log('Login status:', res1.status);
  const cookie = res1.headers.get('set-cookie');
  console.log('Set-Cookie header present:', !!cookie);
  if (cookie) {
    console.log('Set-Cookie contains HttpOnly:', cookie.includes('HttpOnly'));
  }

  console.log('\nTesting /auth/me with cookie...');
  const res2 = await fetch('http://localhost:3000/auth/me', {
    headers: { 'Cookie': cookie }
  });
  console.log('Me status:', res2.status);
  const meBody = await res2.json();
  console.log('Me body:', meBody);
  console.log('Password hash present:', !!meBody.passwordHash);

  console.log('\nTesting incorrect login...');
  const res3 = await fetch('http://localhost:3000/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'admin', password: 'wrong' })
  });
  console.log('Incorrect login status:', res3.status);

  console.log('\nTesting logout...');
  const res4 = await fetch('http://localhost:3000/auth/logout', {
    method: 'POST'
  });
  console.log('Logout status:', res4.status);
  console.log('Logout set-cookie:', res4.headers.get('set-cookie'));
}
test();
