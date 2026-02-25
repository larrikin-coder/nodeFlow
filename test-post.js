async function testPost() {
    const res = await fetch("http://localhost:3000/api/workflows", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            name: "Test Post",
            nodes: [{ id: "1" }],
            edges: []
        })
    });
    console.log("Status:", res.status);
    console.log("Response:", await res.json());
}
testPost();
