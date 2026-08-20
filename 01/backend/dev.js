// const { exec, spawn } = require('child_process')

// const DOCKER_DESKTOP_PATH = 'C:\\Program Files\\Docker\\Docker\\Docker Desktop.exe'
// const REDIS_CONTAINER_NAME = 'redis'
// const MONGODB_SERVICE_NAME = 'MongoDB'

// const run = (cmd) => new Promise((resolve) => {
//     exec(cmd, (err, stdout, stderr) => {
//         if (err) console.error(`Command failed: ${cmd}\n${stderr}`)
//         resolve()
//     })
// })

// const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

// const isDockerReady = () => new Promise((resolve) => {
//     exec('docker info', (err) => resolve(!err))
// })

// async function start() {
//     console.log('Starting Docker Desktop...')
//     exec(`"${DOCKER_DESKTOP_PATH}"`)

//     // Wait until Docker engine actually responds (checks every 2s, up to 60s)
//     let ready = false
//     for (let i = 0; i < 30 && !ready; i++) {
//         await wait(2000)
//         ready = await isDockerReady()
//         console.log('Waiting for Docker to be ready...')
//     }

//     if (!ready) {
//         console.error('Docker did not become ready in time. Exiting.')
//         process.exit(1)
//     }

//     console.log('Docker is ready. Starting Redis container...')
//     await run(`docker start ${REDIS_CONTAINER_NAME}`)

//     console.log('Starting MongoDB service...')
//     await run(`net start ${MONGODB_SERVICE_NAME}`)

//     console.log('Starting server (nodemon)...')
//     const server = spawn('npx', ['nodemon', 'server.js'], {
//         stdio: 'inherit',
//         shell: true
//     })

//     const shutdown = async () => {
//         console.log('\nShutting down...')

//         console.log('Stopping Redis container...')
//         await run(`docker stop ${REDIS_CONTAINER_NAME}`)

//         console.log('Stopping MongoDB service...')
//         await run(`net stop ${MONGODB_SERVICE_NAME}`)

//         console.log('Stopping server...')
//         server.kill('SIGINT')

//         console.log('All stopped.')
//         process.exit(0)
//     }

//     process.on('SIGINT', shutdown)   // Ctrl+C
//     process.on('SIGTERM', shutdown)
// }

// start()