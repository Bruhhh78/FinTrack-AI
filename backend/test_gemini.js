require('dotenv').config();

async function test() {
  try {
    const key = process.env.GEMINI_API_KEY;
    console.log('API KEY:', key ? 'Present' : 'Missing');
    const url = `https://generativelanguage.googleapis.com/v1/models?key=${key}`;
    const res = await fetch(url);
    console.log('STATUS:', res.status);
    const data = await res.json();
    if (res.status === 200) {
      console.log('MODELS:', data.models.map(m => m.name));
    } else {
      console.error('ERROR RESPONSE:', data);
    }
  } catch (err) {
    console.error('ERROR:', err.message);
  }
}

test();
