# Sequential Thinking MCP Server

A Model Context Protocol (MCP) server that helps structure and manage sequential thinking processes. This tool enables systematic thought organization, revision tracking, and relationship mapping between different thoughts.

## Features

- Add sequential thoughts with metadata and categorization
- Track relationships between thoughts
- Support for thought revisions and branching
- Multiple output formats (JSON and Markdown)
- Clear organization by thought types
- Metadata tracking for each thought

## Tools

### 1. add_thought

Adds a new thought to the thinking process.

#### Parameters

- `thought` (string, required): The content of the thought
- `thoughtNumber` (number, required): Position in the sequence
- `totalThoughts` (number, required): Current estimate of total thoughts needed
- `isRevision` (boolean, required): Whether this thought revises a previous one
- `needsMoreThoughts` (boolean, required): Indicates if more thoughts are needed beyond current total
- `nextThoughtNeeded` (boolean, required): Whether another thought should follow
- `revisesThought` (number, optional): Reference to thought being revised
- `branchFromThought` (number, optional): Reference to thought this branches from
- `branchId` (string, optional): Identifier for the current thought branch
- `type` (string, optional): Categorization of the thought
  - Options: 'insight', 'question', 'evidence', 'conclusion'
- `status` (string, optional): Current state of the thought
  - Options: 'active', 'revised', 'deprecated'
- `metadata` (object, optional): Additional contextual information

#### Example

```json
{
  "thought": "Initial analysis shows three key factors",
  "thoughtNumber": 1,
  "totalThoughts": 5,
  "isRevision": false,
  "needsMoreThoughts": false,
  "nextThoughtNeeded": true,
  "type": "insight",
  "metadata": {
    "confidence": "high",
    "sources": ["data analysis", "expert input"]
  }
}
```

### 2. get_thoughts

Retrieves all recorded thoughts in the thinking process.

#### Parameters

- `format` (string, optional): Output format
  - Options: 'json' (default), 'markdown'
  - JSON format includes full metadata and relationships
  - Markdown format provides human-readable structured output

#### Example

```json
{
  "format": "markdown"
}
```

### 3. get_related_thoughts

Retrieves thoughts related to a specific thought number.

#### Parameters

- `thoughtNumber` (number, required): The thought number to find relations for

#### Example

```json
{
  "thoughtNumber": 1
}
```

### 4. clear_thoughts

Clears all recorded thoughts and resets the thinking process.

#### Parameters

None required.

## Output Formats

### JSON Format

The JSON output includes:
- Complete thought details
- Metadata
- Relationships
- Timestamps
- Status information

Example:
```json
{
  "thoughts": [
    {
      "thought": "Initial analysis shows three key factors",
      "thoughtNumber": 1,
      "type": "insight",
      "status": "active",
      "created": "2024-01-02T15:30:00Z",
      "modified": "2024-01-02T15:30:00Z",
      "metadata": {
        "confidence": "high"
      }
    }
  ],
  "edges": [
    {
      "from": 1,
      "to": [2, 3]
    }
  ]
}
```

### Markdown Format

The Markdown output organizes thoughts by type with clear headings and relationships:

```markdown
# Thought Process

## Insights

### Thought 1

Initial analysis shows three key factors

**Status:** active

**Related Thoughts:**
- Thought 2: Further investigation of first factor
- Thought 3: Analysis of second factor
```

## Thought Types

1. **Insight**: New understanding or realization
2. **Question**: Areas needing investigation
3. **Evidence**: Supporting data or observations
4. **Conclusion**: Final determinations or summaries

## Thought Status

1. **Active**: Current and valid
2. **Revised**: Updated by a newer thought
3. **Deprecated**: No longer relevant or valid

## Relationships

Thoughts can be related through:
- Direct sequence
- Revisions
- Branching
- Referenced connections

## Best Practices

1. **Numbering**: Keep thought numbers sequential
2. **Types**: Categorize thoughts appropriately
3. **Revisions**: Use revision links to track changes
4. **Branching**: Create branches for parallel lines of thinking
5. **Metadata**: Include relevant context in metadata
6. **Status**: Keep thought status updated

## Error Handling

The server provides clear error messages for:
- Invalid parameters
- Missing required fields
- Unknown thought numbers
- Invalid thought types or status
- Relationship errors

## Technical Details

- Built with TypeScript
- Uses MCP (Model Context Protocol)
- Maintains in-memory thought graph
- Supports bidirectional relationships
- Provides real-time validation

## Advanced Use Cases and Techniques

The following advanced use cases and techniques were developed using the sequential thinking tool itself to analyze and document sophisticated applications of the tool's features.

### 1. Complex Problem Decomposition

The tool excels at breaking down complex problems through a structured approach:
- Start with an initial insight to frame the problem
- Branch into multiple questions for investigation
- Gather evidence for each branch systematically
- Converge on conclusions by synthesizing findings
- Use thought types to clearly distinguish between different aspects of analysis

This approach is particularly effective for:
- Research projects
- System design
- Root cause analysis
- Strategic planning

### 2. Iterative Refinement

The revision feature enables sophisticated knowledge refinement:
- Create initial thoughts to capture preliminary understanding
- Use revisions to update thoughts as new information emerges
- Maintain clear progression of understanding
- Preserve original context while showing evolution of ideas
- Track the rationale for changes through metadata

Perfect for:
- Research documentation
- Decision evolution tracking
- Knowledge base maintenance
- Collaborative analysis

### 3. Advanced Categorization

Strategic use of metadata enables rich knowledge organization:
- Include tags for multi-dimensional categorization
- Add confidence levels to thoughts
- Reference sources and dependencies
- Create custom metadata fields for specific needs
- Enable sophisticated filtering and analysis

Applications include:
- Research synthesis
- Evidence tracking
- Decision support systems
- Knowledge mapping

### 4. Dynamic Documentation

The markdown output feature supports living documentation:
- Structure thoughts with appropriate types
- Include comprehensive metadata
- Generate well-organized documentation automatically
- Maintain documentation that evolves with thinking
- Create different views of the same thought process

Ideal for:
- Project documentation
- Research papers
- Technical specifications
- Process documentation

### 5. Integrated Approaches

Combining these techniques creates powerful workflows:
1. Use problem decomposition to structure complex analysis
2. Apply iterative refinement to evolve understanding
3. Leverage metadata for rich relationships
4. Generate dynamic documentation for sharing insights

This integrated approach enables sophisticated use cases:
- Research Analysis: Track evolution of understanding with evidence
- Project Planning: Decompose goals and track dependencies
- Decision Documentation: Capture rationale and context
- Collaborative Problem-Solving: Share and refine thoughts systematically

### Implementation Examples

#### Research Analysis
```json
{
  "thought": "Initial hypothesis based on preliminary data",
  "thoughtNumber": 1,
  "type": "insight",
  "metadata": {
    "confidence": "medium",
    "sources": ["preliminary_data"],
    "requires_validation": true
  }
}
```

#### Project Planning
```json
{
  "thought": "System architecture considerations",
  "thoughtNumber": 1,
  "type": "question",
  "metadata": {
    "dependencies": ["requirements", "constraints"],
    "stakeholders": ["tech_lead", "architects"],
    "priority": "high"
  }
}
```

#### Decision Documentation
```json
{
  "thought": "Selected cloud provider based on analysis",
  "thoughtNumber": 5,
  "type": "conclusion",
  "metadata": {
    "decision_factors": ["cost", "scalability", "support"],
    "alternatives_considered": ["AWS", "GCP", "Azure"],
    "impact_level": "high"
  }
}
```

These advanced techniques demonstrate how the sequential thinking tool can be leveraged as a powerful platform for systematic thinking and knowledge management, enabling sophisticated analysis and documentation workflows.
