import { logger } from "./application/logging";
import { app } from "./application/web";

const PORT = 8080;

app.listen(PORT, () => {
  logger.info(`App start in port:${PORT}`);
});
