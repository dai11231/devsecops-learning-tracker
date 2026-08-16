async function test() {
  console.log('Testing Phase 3 API endpoints...');
  // 1. Login to get cookie
  const res1 = await fetch('http://localhost:3000/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'admin', password: 'admin123' })
  });
  const cookie = res1.headers.get('set-cookie');
  const headers = { 'Cookie': cookie, 'Content-Type': 'application/json' };

  // 2. Get Categories
  const catRes = await fetch('http://localhost:3000/categories', { headers });
  const categories = await catRes.json();
  console.log('Categories count:', categories.length);

  // 3. Test 404 for Topics under non-existent category
  const notFoundTopicsRes = await fetch('http://localhost:3000/categories/999/topics', { headers });
  console.log('404 Test (Topics):', notFoundTopicsRes.status);

  // 4. Test 409 Restrict Delete
  const linuxCategory = categories.find(c => c.slug === 'linux');
  if (linuxCategory) {
    const delRes = await fetch(`http://localhost:3000/categories/${linuxCategory.id}`, { method: 'DELETE', headers });
    console.log('409 Test (Delete Category with Topics):', delRes.status);
    const delBody = await delRes.json();
    console.log('409 Message:', delBody.message);
  }

  // 5. Test Note creation
  const topicsRes = await fetch(`http://localhost:3000/categories/${linuxCategory.id}/topics`, { headers });
  const topics = await topicsRes.json();
  const firstTopic = topics[0];
  
  if (firstTopic) {
    const createNoteRes = await fetch(`http://localhost:3000/topics/${firstTopic.id}/notes`, {
      method: 'POST', headers,
      body: JSON.stringify({ title: 'My First Note', content: 'This is a test note.' })
    });
    console.log('Create Note status:', createNoteRes.status);
    const note = await createNoteRes.json();
    console.log('Created Note ID:', note.id);

    // Test Note 404
    const notFoundNotesRes = await fetch('http://localhost:3000/topics/999/notes', { headers });
    console.log('404 Test (Notes):', notFoundNotesRes.status);

    // Test Topic 409
    const delTopicRes = await fetch(`http://localhost:3000/topics/${firstTopic.id}`, { method: 'DELETE', headers });
    console.log('409 Test (Delete Topic with Notes):', delTopicRes.status);
  }
}

test();
