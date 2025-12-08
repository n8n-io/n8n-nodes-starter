# n8n-nodes-wyoming

n8n community nodes for [Wyoming protocol](https://github.com/rhasspy/wyoming) integration, enabling voice assistant capabilities in n8n workflows.

## Features

- **Speech-to-Text** - Transcribe audio using Wyoming-compatible ASR services (Whisper, etc.)

## Installation

Install via npm:

```bash
npm install n8n-nodes-wyoming
```

Or install directly in n8n via the Community Nodes menu.

## Usage

1. Add Wyoming credentials with your server host and port
2. Use the Wyoming node in your workflow
3. Connect audio input (binary data) to the node
4. Get transcription results as JSON output

## Supported Services

This node is designed to work with Wyoming protocol implementations:

- [wyoming-faster-whisper](https://github.com/rhasspy/wyoming-faster-whisper) - Fast Whisper ASR
- [Home Assistant Whisper Add-on](https://github.com/home-assistant/addons/tree/master/whisper)

## Development

```bash
npm install
npm run dev
```

## License

[MIT](LICENSE.md)
