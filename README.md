# Graph-Enhanced Sequential Thinking MCP Server

A graph-based extension of the [official MCP sequential thinking server](https://github.com/modelcontextprotocol/servers/tree/main/src/sequentialthinking), adding advanced features for complex thought process management and analysis.

## Overview

This implementation is a fork and enhancement of the official MCP sequential thinking server by the Model Context Protocol team. We extend their foundational work with sophisticated features for managing complex thought processes, relationships between thoughts, and detailed metadata tracking. The original server provided the essential framework for sequential thinking, which we've built upon to support more nuanced and interconnected thinking patterns.

## Credits

This project is based on the original sequential thinking server implementation by the Model Context Protocol team. We extend our gratitude to their work which provided the foundation for this enhanced version. The original implementation can be found at:
- [MCP Servers Repository](https://github.com/modelcontextprotocol/servers)
- [Original Sequential Thinking Implementation](https://github.com/modelcontextprotocol/servers/tree/main/src/sequentialthinking)

## Enhanced Features

- **Graph-Based Thought Management**: Track relationships and connections between thoughts using a graph data structure
- **Advanced Thought Types**: Categorize thoughts as insights, questions, evidence, or conclusions
- **Status Tracking**: Monitor thought status (active, revised, deprecated)
- **Branch Management**: Create and track alternative thinking paths with branch points
- **Rich Metadata Support**: Attach custom metadata to thoughts for enhanced organization
- **Markdown Export**: Generate structured markdown documentation of thought processes
- **Relationship Tracking**: Track and query related thoughts in the thinking graph
- **Revision History**: Maintain history of thought revisions and modifications
- **Temporal Tracking**: Record creation and modification timestamps for thoughts

## Installation

```bash
# Clone the repository
git clone https://github.com/vetlefo/sequential-thinking.git

# Navigate to the project directory
cd sequential-thinking

# Install dependencies
npm install

# Build the project
npm run build
```

## Usage

### Configuration

#### Cline Configuration

To use this server with Cline, add the following to your Cline MCP settings file (located at `%APPDATA%/Code/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json` on Windows or `~/Library/Application Support/Code/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json` on macOS):

```json
{
  "mcpServers": {
    "sequential-thinking": {
      "command": "node",
      "args": ["path/to/sequential-thinking/build/index.js"]
    }
  }
}
```

#### Claude Desktop Configuration

To use this server with Claude Desktop, add the following to your Claude configuration file (located at `%APPDATA%/Claude/claude_desktop_config.json` on Windows or `~/Library/Application Support/Claude/claude_desktop_config.json` on macOS):

```json
{
  "mcpServers": {
    "sequential-thinking": {
      "command": "node",
      "args": ["path/to/sequential-thinking/build/index.js"]
    }
  }
}
```

Replace `path/to/sequential-thinking` with the actual path where you cloned this repository.

### Starting the Server

```bash
npm start
```

### Available Tools

1. **add_thought**
   - Add a new thought step with enhanced metadata and relationships
   ```typescript
   {
     thought: string;              // The thought content
     thoughtNumber: number;        // Position in sequence
     totalThoughts: number;        // Estimated total thoughts
     isRevision: boolean;         // Whether this revises previous thinking
     revisesThought?: number;     // Reference to revised thought
     branchFromThought?: number;  // Branch point reference
     branchId?: string;          // Branch identifier
     needsMoreThoughts: boolean;  // Indicates if more thoughts needed
     nextThoughtNeeded: boolean;  // Indicates if sequence continues
     type?: 'insight' | 'question' | 'evidence' | 'conclusion';
     status?: 'active' | 'revised' | 'deprecated';
     metadata?: Record<string, unknown>;
   }
   ```

2. **get_thoughts**
   - Retrieve all thoughts with optional formatting
   ```typescript
   {
     format?: 'json' | 'markdown';  // Output format preference
   }
   ```

3. **get_related_thoughts**
   - Find thoughts related to a specific thought
   ```typescript
   {
     thoughtNumber: number;  // The thought to find relations for
   }
   ```

4. **clear_thoughts**
   - Reset the thought graph and start fresh

## Example

```typescript
// Adding a thought with relationships
await mcp.callTool('sequential-thinking', 'add_thought', {
  thought: "Initial analysis reveals three key components",
  thoughtNumber: 1,
  totalThoughts: 5,
  type: "insight",
  isRevision: false,
  needsMoreThoughts: true,
  nextThoughtNeeded: true,
  metadata: {
    confidence: "high",
    sources: ["document-A", "document-B"]
  }
});

// Creating a branch
await mcp.callTool('sequential-thinking', 'add_thought', {
  thought: "Alternative approach to component 2",
  thoughtNumber: 4,
  totalThoughts: 6,
  branchFromThought: 2,
  branchId: "alternative-path",
  type: "insight",
  isRevision: false,
  needsMoreThoughts: true,
  nextThoughtNeeded: true
});

// Getting thoughts in markdown format
const thoughts = await mcp.callTool('sequential-thinking', 'get_thoughts', {
  format: 'markdown'
});
```

## Development

### Project Structure

```
sequential-thinking/
├── src/
│   └── index.ts      # Main server implementation with graph-based thought management
├── build/            # Compiled JavaScript files
├── package.json      # Project configuration
└── tsconfig.json     # TypeScript configuration
```

### Building

```bash
npm run build
```

### Testing

```bash
npm test
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.

## Acknowledgments

- Based on the original sequential thinking server by the Model Context Protocol team
- Extended with graph-based thought management and enhanced metadata support
- Built using the Model Context Protocol (MCP) SDK

## Relationship to Original Implementation

This project started as an enhancement of the official MCP sequential thinking server. While we maintain compatibility with the core sequential thinking concepts, we've added significant new features focused on graph-based thought management and enhanced metadata support. The original implementation provided the essential sequential thinking framework, which we've expanded to support more complex thought relationships and organizational features.
