# n8n-nodes-wyoming

n8n community nodes for [Home Assistant Whisper add-on](https://github.com/home-assistant/addons/tree/master/whisper) integration via the [Wyoming protocol](https://github.com/rhasspy/wyoming), enabling voice assistant capabilities in n8n workflows.

## Features

- **Speech-to-Text** - Transcribe audio using Home Assistant Whisper add-on

## Installation

Install via npm:

```bash
npm install n8n-nodes-wyoming
```

Or install directly in n8n via the Community Nodes menu.

## Usage

1. Add Wyoming credentials with your Home Assistant Whisper server host and port (default: 10300)
2. Use the Wyoming node in your workflow
3. Connect audio input (binary data) to the node
4. Get transcription results as JSON output

## Supported Services

This node is designed to work with:

- [Home Assistant Whisper Add-on](https://github.com/home-assistant/addons/tree/master/whisper) - Primary target

## Development

```bash
npm install
npm run dev
```

## License

[MIT](LICENSE.md)
