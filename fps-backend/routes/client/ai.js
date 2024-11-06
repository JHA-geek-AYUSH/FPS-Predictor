const OpenAI = require('openai');
const { cpu, gpu, memory, network, wifi } = require('../../lib/data');

const client = new OpenAI({
    apiKey: process.env['OPENAI_API_KEY']
});

/**
 * 
 * cpu = { model, cores, clockSpeed } 
 * gpu = { model, VRAM, clock speed }
 * memory = { size, speed }
 * resolution
 * 
 * game
 * res
 * 
 */


module.exports = {
    name: 'ai',
    async post(app, req, res) {
        const { game, resolution } = req.body; 
        const { cpu, gpu, mem, network, wifi } = app;


        const prompt = `
            Return only an integer value for the approximate FPS for the game "${game}" with the following hardware and network information:
            CPU - Model: ${cpu.manufacturer} ${cpu.brand}, Cores: ${cpu.cores}, Clock Speed: ${cpu.speed} GHz.
            GPU - Model: ${gpu.model}, VRAM: ${gpu.vram} GB, Clock Core: ${gpu.clockCore} MHz.
            Memory - Size: ${mem.free}
            Network - Signal Level: ${wifi.signalLevel} dBm, Speed: ${network.speed} Mbps, Quality: ${wifi.quality}
            Resolution: ${resolution}.
        `;

        const systemMessage = {
            role: 'system',
            content: 'Respond with only a single integer representing the approximate FPS (e.g., 60). Do not provide any explanation, text, or additional information.'
        };


        try {
            const chatCompletion = await client.chat.completions.create({
                messages: [
                    systemMessage,
                    { role: 'user', content: prompt }],
                model: 'gpt-4-turbo',
            });

            console.log(chatCompletion.choices[0]);

            const fpsEstimate = parseInt(chatCompletion.choices[0].message.content);

            res.json({ fps: fpsEstimate });
        } catch (error) {
            console.error("Error generating FPS estimate:", error);
            res.status(500).json({ error: "Failed to generate FPS estimate" });
        }
    },
};
