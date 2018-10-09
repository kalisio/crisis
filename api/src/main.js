import cluster from 'cluster'
import fs from 'fs-extra'
import logger from 'winston'
import _ from 'lodash'
import { Server } from './server'

const N = parseInt(process.env.NODE_APP_NB_INSTANCES)
let server

if (cluster.isMaster && (N > 1)) {
	logger.info(`Launching master with pid ${process.pid}`);

  for (let i = 0; i < N; i++) {
    cluster.fork()
  }
} else {
	server = new Server()

	const config = server.app.get('logs')
	const logPath = _.get(config, 'DailyRotateFile.dirname')
	if (logPath) {
	  // This will ensure the log directory does exist
	  fs.ensureDirSync(logPath)
	}

	if (require.main === module) {
	  process.on('unhandledRejection', (reason, p) =>
	    logger.error('Unhandled Rejection at: Promise ', p, reason)
	  )

	  server.run().then(() => {
	    logger.info(`Server with pid ${process.pid} started listening`)
	  })
	}
}

export default server