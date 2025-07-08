export async function loginUser({ email, password }) {
  // Simulated login — replace with real backend logic later
  if (email === "admin@qc.com" && password === "admin123") {
    return { token: "fake-token", role: "admin" };
  }
  if (email === "user@qc.com" && password === "user123") {
    return { token: "fake-token", role: "user" };
  }
  throw new Error("Invalid email or password");
}
