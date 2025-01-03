#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ErrorCode, ListToolsRequestSchema, McpError, } from '@modelcontextprotocol/sdk/types.js';
function isValidThoughtStep(args) {
    if (!args)
        return false;
    const hasRequiredFields = typeof args.thought === 'string' &&
        typeof args.thoughtNumber === 'number' &&
        typeof args.totalThoughts === 'number' &&
        typeof args.isRevision === 'boolean' &&
        typeof args.needsMoreThoughts === 'boolean' &&
        typeof args.nextThoughtNeeded === 'boolean';
    if (!hasRequiredFields)
        return false;
    const hasValidOptionalFields = (args.revisesThought === undefined || typeof args.revisesThought === 'number') &&
        (args.branchFromThought === undefined || typeof args.branchFromThought === 'number') &&
        (args.branchId === undefined || typeof args.branchId === 'string') &&
        (args.type === undefined || ['insight', 'question', 'evidence', 'conclusion'].includes(args.type)) &&
        (args.status === undefined || ['active', 'revised', 'deprecated'].includes(args.status)) &&
        (args.metadata === undefined || typeof args.metadata === 'object');
    return hasValidOptionalFields;
}
class ThoughtGraph {
    constructor() {
        this.thoughts = [];
        this.edges = new Map();
    }
    addThought(thought) {
        thought.created = new Date().toISOString();
        thought.modified = thought.created;
        this.thoughts.push(thought);
        // Create edges based on revision and branching
        if (thought.isRevision && thought.revisesThought !== undefined) {
            this.addEdge(thought.thoughtNumber, thought.revisesThought);
        }
        if (thought.branchFromThought !== undefined) {
            this.addEdge(thought.thoughtNumber, thought.branchFromThought);
        }
    }
    addEdge(from, to) {
        if (!this.edges.has(from)) {
            this.edges.set(from, new Set());
        }
        if (!this.edges.has(to)) {
            this.edges.set(to, new Set());
        }
        this.edges.get(from)?.add(to);
        this.edges.get(to)?.add(from);
    }
    getThoughts() {
        return this.thoughts;
    }
    getRelatedThoughts(thoughtNumber) {
        const related = this.edges.get(thoughtNumber) || new Set();
        return Array.from(related).map(num => this.thoughts.find(t => t.thoughtNumber === num)).filter((t) => t !== undefined);
    }
    clear() {
        this.thoughts = [];
        this.edges.clear();
    }
    toJSON() {
        return JSON.stringify({
            thoughts: this.thoughts,
            edges: Array.from(this.edges.entries()).map(([from, to]) => ({
                from,
                to: Array.from(to)
            }))
        }, null, 2);
    }
}
class SequentialThinkingServer {
    constructor() {
        this.server = new Server({
            name: 'sequential-thinking',
            version: '1.0.0',
        }, {
            capabilities: {
                tools: {},
            },
        });
        this.thoughtGraph = new ThoughtGraph();
        this.setupToolHandlers();
        this.server.onerror = (error) => console.error('[MCP Error]', error);
        process.on('SIGINT', async () => {
            await this.server.close();
            process.exit(0);
        });
    }
    setupToolHandlers() {
        this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
            tools: [
                {
                    name: 'add_thought',
                    description: 'Add a new thought step in the sequential thinking process',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            thought: {
                                type: 'string',
                                description: 'The current thinking step content'
                            },
                            thoughtNumber: {
                                type: 'number',
                                description: 'Current number in sequence'
                            },
                            totalThoughts: {
                                type: 'number',
                                description: 'Current estimate of thoughts needed'
                            },
                            isRevision: {
                                type: 'boolean',
                                description: 'Whether this thought revises previous thinking'
                            },
                            revisesThought: {
                                type: 'number',
                                description: 'If revision, which thought number is being reconsidered'
                            },
                            branchFromThought: {
                                type: 'number',
                                description: 'If branching, which thought number is the branching point'
                            },
                            branchId: {
                                type: 'string',
                                description: 'Identifier for the current branch'
                            },
                            needsMoreThoughts: {
                                type: 'boolean',
                                description: 'If reaching end but realizing more thoughts needed'
                            },
                            nextThoughtNeeded: {
                                type: 'boolean',
                                description: 'True if more thinking is needed'
                            },
                            type: {
                                type: 'string',
                                enum: ['insight', 'question', 'evidence', 'conclusion'],
                                description: 'The type of thought'
                            },
                            status: {
                                type: 'string',
                                enum: ['active', 'revised', 'deprecated'],
                                description: 'Current status of the thought'
                            },
                            metadata: {
                                type: 'object',
                                description: 'Additional metadata for the thought'
                            }
                        },
                        required: ['thought', 'thoughtNumber', 'totalThoughts', 'isRevision', 'needsMoreThoughts', 'nextThoughtNeeded']
                    }
                },
                {
                    name: 'get_thoughts',
                    description: 'Get all recorded thoughts in the thinking process',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            format: {
                                type: 'string',
                                enum: ['json', 'markdown'],
                                description: 'Output format (defaults to json)'
                            }
                        }
                    }
                },
                {
                    name: 'get_related_thoughts',
                    description: 'Get thoughts related to a specific thought number',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            thoughtNumber: {
                                type: 'number',
                                description: 'The thought number to find relations for'
                            }
                        },
                        required: ['thoughtNumber']
                    }
                },
                {
                    name: 'clear_thoughts',
                    description: 'Clear all recorded thoughts and start fresh',
                    inputSchema: {
                        type: 'object',
                        properties: {}
                    }
                }
            ]
        }));
        this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
            switch (request.params.name) {
                case 'add_thought': {
                    if (!isValidThoughtStep(request.params.arguments)) {
                        throw new McpError(ErrorCode.InvalidParams, 'Invalid thought step parameters');
                    }
                    const thought = request.params.arguments;
                    this.thoughtGraph.addThought(thought);
                    return {
                        content: [
                            {
                                type: 'text',
                                text: JSON.stringify({
                                    success: true,
                                    thoughtNumber: thought.thoughtNumber,
                                    relatedThoughts: this.thoughtGraph.getRelatedThoughts(thought.thoughtNumber)
                                })
                            }
                        ]
                    };
                }
                case 'get_thoughts': {
                    const format = request.params.arguments?.format || 'json';
                    if (format === 'markdown') {
                        return {
                            content: [
                                {
                                    type: 'text',
                                    text: this.thoughtsToMarkdown()
                                }
                            ]
                        };
                    }
                    return {
                        content: [
                            {
                                type: 'text',
                                text: this.thoughtGraph.toJSON()
                            }
                        ]
                    };
                }
                case 'get_related_thoughts': {
                    const { thoughtNumber } = request.params.arguments;
                    return {
                        content: [
                            {
                                type: 'text',
                                text: JSON.stringify(this.thoughtGraph.getRelatedThoughts(thoughtNumber))
                            }
                        ]
                    };
                }
                case 'clear_thoughts': {
                    this.thoughtGraph.clear();
                    return {
                        content: [
                            {
                                type: 'text',
                                text: JSON.stringify({ success: true })
                            }
                        ]
                    };
                }
                default:
                    throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${request.params.name}`);
            }
        });
    }
    thoughtsToMarkdown() {
        const thoughts = this.thoughtGraph.getThoughts();
        let markdown = '# Thought Process\n\n';
        // Group thoughts by type if available
        const typeGroups = new Map();
        thoughts.forEach(thought => {
            const type = thought.type || 'unspecified';
            if (!typeGroups.has(type)) {
                typeGroups.set(type, []);
            }
            typeGroups.get(type)?.push(thought);
        });
        // Add thoughts by type
        for (const [type, typeThoughts] of typeGroups) {
            markdown += `## ${type.charAt(0).toUpperCase() + type.slice(1)}s\n\n`;
            typeThoughts.forEach(thought => {
                markdown += `### Thought ${thought.thoughtNumber}\n\n`;
                markdown += `${thought.thought}\n\n`;
                // Add metadata
                if (thought.status) {
                    markdown += `**Status:** ${thought.status}\n\n`;
                }
                if (thought.isRevision) {
                    markdown += `**Revises:** Thought ${thought.revisesThought}\n\n`;
                }
                if (thought.branchFromThought) {
                    markdown += `**Branches from:** Thought ${thought.branchFromThought}\n\n`;
                }
                // Add related thoughts
                const related = this.thoughtGraph.getRelatedThoughts(thought.thoughtNumber);
                if (related.length > 0) {
                    markdown += '**Related Thoughts:**\n';
                    related.forEach(rel => {
                        markdown += `- Thought ${rel.thoughtNumber}: ${rel.thought}\n`;
                    });
                    markdown += '\n';
                }
            });
        }
        return markdown;
    }
    async run() {
        const transport = new StdioServerTransport();
        await this.server.connect(transport);
        console.error('Sequential Thinking MCP server running on stdio');
    }
}
const server = new SequentialThinkingServer();
server.run().catch(console.error);
