import { app } from "./app.js";

const port = Number(process.env.PORT ?? 4001);
// Bind all interfaces so cloud hosts (Render) can reach the service.
const host = process.env.HOST ?? "0.0.0.0";

app.listen(port, host, () => {
  console.log(`Bundle Builder API listening on http://${host}:${port}`);
});
