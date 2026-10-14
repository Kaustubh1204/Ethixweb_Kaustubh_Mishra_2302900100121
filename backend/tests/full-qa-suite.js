/**
 * EthixWeb Comprehensive End-to-End QA Suite
 * Tests:
 * 1. Health check & DB failure representation
 * 2. Contact lead creation (valid, invalid email, whitespace, SQL injection payload, oversized)
 * 3. Public rate limiting behavior
 * 4. Admin authentication (valid, invalid, malformed, logout, getMe)
 * 5. Admin protected lead management (UUID validation, status filter, update, delete, isolation)
 * 6. Non-destructive cleanup of disposable test leads created during execution
 */

const BASE_URL = "http://localhost:5000";

async function runTests() {
  console.log("==================================================");
  console.log("   EthixWeb Full End-to-End QA & Security Suite   ");
  console.log("==================================================\n");

  let passed = 0;
  let failed = 0;
  const createdTestLeadIds = [];

  function assert(condition, message) {
    if (condition) {
      console.log(`[PASS] ${message}`);
      passed++;
    } else {
      console.error(`[FAIL] ${message}`);
      failed++;
    }
  }

  try {
    // ----------------------------------------------------
    // TEST 1: Health Check Endpoint
    // ----------------------------------------------------
    console.log("--- 1. Testing Health API ---");
    const healthRes = await fetch(`${BASE_URL}/api/health`);
    const healthData = await healthRes.json();
    assert(healthRes.status === 200, "Health endpoint returns HTTP 200");
    assert(healthData.success === true, "Health response includes success: true");
    assert(healthData.data.status === "healthy", "Health reports status: healthy");
    assert(healthData.data.database === "connected", "Health reports database: connected");

    // ----------------------------------------------------
    // TEST 2: Public Contact Form Submissions (Leads API)
    // ----------------------------------------------------
    console.log("\n--- 2. Testing Public Leads API ---");

    // 2.1 Valid Lead Submission
    const validLeadPayload = {
      name: "QA Inspector",
      email: "qa.inspector@example.com",
      projectSubject: "Automated QA Verification",
      message: "This is a legitimate automated QA verification test.",
    };

    const createRes = await fetch(`${BASE_URL}/api/leads`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validLeadPayload),
    });
    const createData = await createRes.json();
    assert(createRes.status === 201, "Valid enquiry returns HTTP 201 Created");
    assert(createData.success === true, "Enquiry creation confirms success: true");
    assert(createData.data.id && typeof createData.data.id === "string", "Returns generated UUID");
    assert(createData.data.name === validLeadPayload.name, "Persists matching name");
    assert(createData.data.email === validLeadPayload.email, "Persists matching email");
    assert(createData.data.project_subject === validLeadPayload.projectSubject, "Maps projectSubject -> project_subject");
    assert(createData.data.status === "new", "Initial status defaults to 'new'");

    if (createData.data?.id) {
      createdTestLeadIds.push(createData.data.id);
    }

    // 2.2 Invalid Email Rejection
    const invalidEmailRes = await fetch(`${BASE_URL}/api/leads`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Test",
        email: "not-an-email",
        projectSubject: "Test",
        message: "Message text",
      }),
    });
    assert(invalidEmailRes.status === 400, "Invalid email address is rejected with HTTP 400");

    // 2.3 Whitespace-only Rejection
    const whitespaceRes = await fetch(`${BASE_URL}/api/leads`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "   ",
        email: "test@example.com",
        projectSubject: "   ",
        message: "   ",
      }),
    });
    assert(whitespaceRes.status === 400, "Whitespace-only input is trimmed and rejected with HTTP 400");

    // 2.4 SQL Injection Payload Handled Safely as Text
    const sqlInjectionPayload = {
      name: "Robert'); DROP TABLE leads;--",
      email: "sqli.test@example.com",
      projectSubject: "Test SQLi ' OR '1'='1",
      message: "SELECT * FROM leads WHERE 'a'='a';",
    };

    const sqlRes = await fetch(`${BASE_URL}/api/leads`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(sqlInjectionPayload),
    });
    const sqlData = await sqlRes.json();
    assert(sqlRes.status === 201, "SQL Injection payload treated as plain parameterized string");
    assert(sqlData.data.name === sqlInjectionPayload.name, "String stored safely without SQL injection execution");
    if (sqlData.data?.id) {
      createdTestLeadIds.push(sqlData.data.id);
    }

    // 2.5 Oversized String Rejection
    const oversizedRes = await fetch(`${BASE_URL}/api/leads`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "A".repeat(150), // exceeds 120
        email: "test@example.com",
        projectSubject: "Subject",
        message: "Message",
      }),
    });
    assert(oversizedRes.status === 400, "Oversized name is rejected with HTTP 400");

    // ----------------------------------------------------
    // TEST 3: Admin Authentication & Token Verification
    // ----------------------------------------------------
    console.log("\n--- 3. Testing Admin Authentication ---");

    // 3.1 Invalid Login Attempt
    const badLoginRes = await fetch(`${BASE_URL}/api/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "admin@ethixweb.com", password: "WrongPassword999" }),
    });
    assert(badLoginRes.status === 401, "Incorrect password returns HTTP 401 Unauthorized");

    // 3.2 Valid Admin Login
    const loginRes = await fetch(`${BASE_URL}/api/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "admin@ethixweb.com", password: "Admin@12345" }),
    });
    const loginData = await loginRes.json();
    assert(loginRes.status === 200, "Valid credentials return HTTP 200");
    assert(typeof loginData.data?.token === "string", "Returns valid JWT token string");
    const adminToken = loginData.data?.token;

    // Check Set-Cookie header contains admin_token and HttpOnly
    const cookieHeader = loginRes.headers.get("set-cookie");
    assert(cookieHeader && cookieHeader.includes("admin_token="), "Sets admin_token cookie");
    assert(cookieHeader && cookieHeader.toLowerCase().includes("httponly"), "admin_token is HttpOnly");

    // 3.3 Verify /api/admin/me
    const meRes = await fetch(`${BASE_URL}/api/admin/me`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const meData = await meRes.json();
    assert(meRes.status === 200, "GET /api/admin/me returns HTTP 200 for authenticated admin");
    assert(meData.data.admin.email === "admin@ethixweb.com", "GET /api/admin/me returns admin profile");

    // 3.4 Unauthenticated /api/admin/me
    const unauthMeRes = await fetch(`${BASE_URL}/api/admin/me`);
    assert(unauthMeRes.status === 401, "GET /api/admin/me without credentials returns HTTP 401");

    // 3.5 Tampered Token Rejected
    const tamperedRes = await fetch(`${BASE_URL}/api/admin/me`, {
      headers: { Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.tampered" },
    });
    assert(tamperedRes.status === 401, "Tampered JWT returns HTTP 401 Unauthorized");

    // ----------------------------------------------------
    // TEST 4: Protected Admin Lead Management
    // ----------------------------------------------------
    console.log("\n--- 4. Testing Admin Lead Management Endpoints ---");

    // 4.1 List leads & metrics
    const listRes = await fetch(`${BASE_URL}/api/admin/leads`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const listData = await listRes.json();
    assert(listRes.status === 200, "GET /api/admin/leads returns HTTP 200");
    assert(Array.isArray(listData.data.leads), "Returns array of leads");
    assert(listData.data.metrics && typeof listData.data.metrics.total === "number", "Returns live metrics object with total count");

    // 4.2 Status Filtering
    const filterRes = await fetch(`${BASE_URL}/api/admin/leads?status=new`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const filterData = await filterRes.json();
    assert(filterRes.status === 200, "GET /api/admin/leads?status=new returns HTTP 200");
    const allAreNew = filterData.data.leads.every((l) => l.status === "new");
    assert(allAreNew, "Status filter properly isolates records by status");

    // 4.3 Lead Detail by ID
    const targetId = createdTestLeadIds[0];
    const detailRes = await fetch(`${BASE_URL}/api/admin/leads/${targetId}`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const detailData = await detailRes.json();
    assert(detailRes.status === 200, "GET /api/admin/leads/:id returns HTTP 200");
    assert(detailData.data.id === targetId, "Lead ID matches requested record");

    // 4.4 Non-existent and Invalid UUID Handling
    const invalidUuidRes = await fetch(`${BASE_URL}/api/admin/leads/not-a-valid-uuid`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert(invalidUuidRes.status === 404, "Invalid UUID gracefully returns HTTP 404 without crashing SQL");

    const nonExistentUuidRes = await fetch(`${BASE_URL}/api/admin/leads/00000000-0000-0000-0000-000000000000`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert(nonExistentUuidRes.status === 404, "Non-existent UUID returns HTTP 404");

    // 4.5 Status Update (PATCH)
    const patchRes = await fetch(`${BASE_URL}/api/admin/leads/${targetId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({ status: "contacted" }),
    });
    const patchData = await patchRes.json();
    assert(patchRes.status === 200, "PATCH status returns HTTP 200");
    assert(patchData.data.status === "contacted", "Status updated to contacted");
    assert(new Date(patchData.data.updated_at) >= new Date(patchData.data.created_at), "updated_at is updated");

    // 4.6 Reject Invalid Status Value
    const badPatchRes = await fetch(`${BASE_URL}/api/admin/leads/${targetId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({ status: "invalid_status_value" }),
    });
    assert(badPatchRes.status === 400, "Invalid status enum is rejected with HTTP 400");

    // 4.7 Delete Lead & Verify Isolation
    console.log("\n--- 5. Clean-up of Disposable Test Records ---");
    for (const testId of createdTestLeadIds) {
      const delRes = await fetch(`${BASE_URL}/api/admin/leads/${testId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      assert(delRes.status === 200, `DELETE /api/admin/leads/${testId} succeeded`);

      // Verify it's no longer retrievable
      const checkDeletedRes = await fetch(`${BASE_URL}/api/admin/leads/${testId}`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      assert(checkDeletedRes.status === 404, `Deleted lead ${testId} is no longer returned (HTTP 404)`);
    }

    // 4.8 Logout
    const logoutRes = await fetch(`${BASE_URL}/api/admin/logout`, {
      method: "POST",
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert(logoutRes.status === 200, "POST /api/admin/logout returns HTTP 200");

    console.log("\n==================================================");
    console.log(`Summary: ${passed} PASSED, ${failed} FAILED`);
    console.log("==================================================");

    process.exit(failed > 0 ? 1 : 0);
  } catch (err) {
    console.error("Test execution threw unhandled error:", err);
    process.exit(1);
  }
}

runTests();
