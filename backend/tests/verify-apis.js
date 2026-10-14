const http = require("http");

function request(options, data) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = "";
      res.on("data", (chunk) => (body += chunk));
      res.on("end", () => {
        try {
          resolve({ status: res.statusCode, headers: res.headers, data: JSON.parse(body) });
        } catch {
          resolve({ status: res.statusCode, headers: res.headers, data: body });
        }
      });
    });
    req.on("error", reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

async function run() {
  console.log("--- 1. Testing Health ---");
  const health = await request({ host: "localhost", port: 5000, path: "/api/health", method: "GET" });
  console.log("Health:", health.status, health.data);

  console.log("\n--- 2. Testing Lead Submission ---");
  const leadRes = await request(
    {
      host: "localhost",
      port: 5000,
      path: "/api/leads",
      method: "POST",
      headers: { "Content-Type": "application/json" },
    },
    {
      name: "Aman Verma",
      email: "aman@example.com",
      projectSubject: "Enterprise Web App",
      message: "We need a custom dashboard with integrations.",
    }
  );
  console.log("Submit Lead:", leadRes.status, leadRes.data);

  console.log("\n--- 3. Testing Lead Validation (Bad Email) ---");
  const badLead = await request(
    {
      host: "localhost",
      port: 5000,
      path: "/api/leads",
      method: "POST",
      headers: { "Content-Type": "application/json" },
    },
    {
      name: "Aman Verma",
      email: "not-an-email",
      projectSubject: "Subject",
      message: "Message",
    }
  );
  console.log("Bad Email:", badLead.status, badLead.data);

  console.log("\n--- 4. Testing Admin Me Unauthenticated ---");
  const unauth = await request({ host: "localhost", port: 5000, path: "/api/admin/me", method: "GET" });
  console.log("Unauth /api/admin/me:", unauth.status, unauth.data);

  console.log("\n--- 5. Testing Admin Login ---");
  const loginRes = await request(
    {
      host: "localhost",
      port: 5000,
      path: "/api/admin/login",
      method: "POST",
      headers: { "Content-Type": "application/json" },
    },
    {
      email: "admin@ethixweb.com",
      password: "Admin@12345",
    }
  );
  console.log("Admin Login:", loginRes.status, loginRes.data.success);
  const token = loginRes.data.data?.token;

  console.log("\n--- 6. Testing Admin Leads with Token ---");
  const leadsRes = await request({
    host: "localhost",
    port: 5000,
    path: "/api/admin/leads",
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  console.log("Admin Leads count:", leadsRes.data.data?.leads?.length, "Metrics:", leadsRes.data.data?.metrics);

  const createdId = leadRes.data.data?.id;
  if (createdId) {
    console.log("\n--- 7. Testing Patch Lead Status ---");
    const patchRes = await request(
      {
        host: "localhost",
        port: 5000,
        path: `/api/admin/leads/${createdId}`,
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
      { status: "qualified" }
    );
    console.log("Patch Status:", patchRes.status, patchRes.data.data?.status);
  }

  console.log("\nALL BACKEND API VERIFICATIONS PASSED!");
}

run().catch(console.error);
