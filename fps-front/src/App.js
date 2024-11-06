import './index.css';
import { useState, useEffect } from 'react';

export default function Widget() {
	const [game, setGame] = useState('Example Game');
	const [resolution, setResolution] = useState('1920x1080');
	const [data, setData] = useState({
		cpu: { model: '', cores: 0, clockSpeed: '' },
		gpu: { model: '', VRAM: '', clockSpeed: '' },
		memory: { size: '', speed: '' },
		network: { signalLevel: '', speed: '', quality: '' },
		fps: ''
	});
	const [additionalData, setAdditionalData] = useState({}); // State for second API call data

	const fetchData = async () => {
		try {
			const response = await fetch(
				`http://localhost:5000/client/info`);

			if (response.ok) {
				const result = await response.json();
				setData({
					cpu: {
						model: result.cpuInfo?.model || 'N/A',
						cores: result.cpuInfo?.cores || 'N/A',
						clockSpeed: result.cpuInfo?.clockSpeed || 'N/A'
					},
					gpu: {
						model: result.gpuInfo?.model || 'N/A',
						VRAM: result.gpuInfo?.vram || 'N/A',
						clockSpeed: result.gpuInfo?.clockSpeed || 'N/A'
					},
					memory: {
						size: result.memInfo?.size || 'N/A',
						speed: result.memInfo?.speed || 'N/A'
					},
					network: {
						signalLevel: result.networkInfo?.signalLevel || 'N/A',
						speed: result.networkInfo?.speed || 'N/A',
						quality: result.networkInfo?.quality || 'N/A'
					}				
				});
			} else {
				console.error('Failed to fetch data:', response.statusText);
			}
		} catch (error) {
			console.error('Error:', error);
		}
	};

	// Second API call to fetch additional data
	const fetchAdditionalData = async () => {
		try {
			const response = await fetch('http://localhost:5000/client/ai', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					game: game,
					resolution: resolution
				})
			});

			if (response.ok) {
				const result = await response.json();
				setAdditionalData(result);
			} else {
				console.error('Failed to fetch additional data:', response.statusText);
			}
		} catch (error) {
			console.error('Error:', error);
		}
	};

	// Call fetchData on component mount
	useEffect(() => {
		fetchData();
		fetchAdditionalData(); // Call the second API on mount
	}, [game, resolution]);

	return (
		<div className="widget-container">
			<h1 className="widget-heading">Game Performance</h1>

			<div>
				<label className="widget-label">Game</label>
				<input
					type="text"
					className="widget-input"
					placeholder="Enter game name"
					value={game}
					onChange={(e) => setGame(e.target.value)}
				/>
			</div>

			<div>
				<label className="widget-label">Resolution</label>
				<input
					type="text"
					className="widget-input"
					placeholder="Enter resolution"
					value={resolution}
					onChange={(e) => setResolution(e.target.value)}
				/>
			</div>

			<button className="widget-button" onClick={fetchData}>
				Submit
			</button>

			<div>
				<h2 className="widget-section-heading">CPU:</h2>
				<p className="widget-text-muted">Model: {data.cpu.model}</p>
				<p className="widget-text-muted">Cores: {data.cpu.cores}</p>
				<p className="widget-text-muted">Clock Speed: {data.cpu.clockSpeed}</p>
			</div>

			<div>
				<h2 className="widget-section-heading">GPU:</h2>
				<p className="widget-text-muted">Model: {data.gpu.model}</p>
				<p className="widget-text-muted">VRAM: {data.gpu.VRAM}</p>
				<p className="widget-text-muted">Clock Speed: {data.gpu.clockSpeed}</p>
			</div>

			<div>
				<h2 className="widget-section-heading">Memory:</h2>
				<p className="widget-text-muted">Size: {data.memory.size}</p>
				<p className="widget-text-muted">Speed: {data.memory.speed}</p>
			</div>

			<div>
				<h2 className="widget-section-heading">Network:</h2>
				<p className="widget-text-muted">Signal Level: {data.network.signalLevel}</p>
				<p className="widget-text-muted">Speed: {data.network.speed}</p>
				<p className="widget-text-muted">Quality: {data.network.quality}</p>
			</div>

			<div>
				<h2 className="widget-section-heading">FPS:</h2>
				<p className="widget-text-muted">FPS: {additionalData.fps}</p>
			</div>
		</div>
	);
}
