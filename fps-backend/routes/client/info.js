
/**
 * 
 * cpu = { model, cores, clockSpeed } 
 * gpu = { model, VRAM, clock speed }
 * memory = { size, speed }
 * network = { signalLevel, speed, quality }
 * 
 * 
 */



module.exports = {
    name: 'info',
    async get(app, req, res) {
        const { cpu, gpu, mem, network, wifi } = app;

        const cpuInfo = {
            model: cpu.model,
            cores: cpu.cores,
            clockSpeed: cpu.speed 
        }

        const gpuInfo = {
            clockCore: gpu.clockCore,
            model: gpu.model,
            vram: gpu.vram
        }

        const memInfo = {
            size: mem.total
        }

        const networkInfo = {
            signalLevel: wifi.signalLevel,
            quality: wifi.quality,
            speed: network.speed
        }

        const resBody = { cpuInfo, gpuInfo, memInfo, networkInfo }

        return res.json(resBody);
    },
};
