import { app } from './app';
import { env } from './config/env';
import { logger } from './utils/logger';

app.listen(env.port, () => logger.info(`Backend running on http://localhost:${env.port}`));
