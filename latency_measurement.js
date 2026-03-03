const { performance } = require("perf_hooks");

const US_URL = "http://34.171.97.18:8080";
const EU_URL = "http://35.241.145.144:8080";

async function avg_register(url, label) {
  const times = [];
  for (let i = 0; i < 10; i++) {
    const username = `user_${label}_${Date.now()}_${i}`;

    const start = performance.now();
    const res = await fetch (`${url}/register`, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ username })
    });
    await res.text().catch(() => "");
    const end = performance.now();
    times.push(end - start); 
  }
  const avg = times.reduce((sum, value) => sum + value, 0) / times.length;
  return avg;
}

async function avg_list(url) {
  const times = [];
  for (let i = 0; i < 10; i++) {
    const start = performance.now();
    const res = await fetch (`${url}/list`);
    await res.text().catch(() => "");
    const end = performance.now();
    times.push(end - start);
  }
  const avg = times.reduce((sum, value) => sum + value, 0) / times.length;
  return avg;
}

async function main() {
  const us_register_avg = await avg_register(US_URL, "us");
  const eu_register_avg = await avg_register(EU_URL, "eu");
  const us_list_avg = await avg_list(US_URL);
  const eu_list_avg = await avg_list(EU_URL);

  console.log(`US /register avg: ${us_register_avg} ms`);
  console.log(`EU /register avg: ${eu_register_avg} ms`);
  console.log(`US /list     avg: ${us_list_avg} ms`);
  console.log(`EU /list     avg: ${eu_list_avg} ms`);
}

main().catch((e) => {
  console.error("Error running latency measurement:", e.message);
  process.exit(1);
});
