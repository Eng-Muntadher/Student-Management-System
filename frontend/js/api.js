// Function responsible for database read / write actions
async function read_write_2_DB(query) {
  try {
    const response = await fetch("http://localhost:8000/execute_query", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: `${query}` }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
  }
}
