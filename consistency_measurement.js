const { performance } = require("perf_hooks");

const US_URL = "http://34.171.97.18:8080";
const EU_URL = "http://35.241.145.144:8080";

const ITERS = 100;

async function postRegister(url, username) {
  const res = await fetch(`${url}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({username}),
  });

  await res.text().catch(() => "");
}

async function getList(url) {
  const res = await fetch(`${url}/list`);
  const data = await res.json().catch(async () => {
    const text = await res.text().catch(() => "");
    return JSON.parse(text);
  });
  return Array.isArray(data.users) ? data.users : [];
}

async function main() {
  let notFoundCount = 0;

  for (let i = 0; i < ITERS; i++) {
    const username = `${Date.now()}_${i}`;
    await postRegister(US_URL, username);
    
    const users = await getList(EU_URL);

    const found = users.includes(username);
    if (!found) notFoundCount++;

  }

  console.log(`Iterations: ${ITERS}`);
  console.log(
    `Not found immediately after registration: ${notFoundCount} times`
  );
}

main().catch((e) => {
  console.error("Script failed:", e.message);
  process.exit(1);
});
