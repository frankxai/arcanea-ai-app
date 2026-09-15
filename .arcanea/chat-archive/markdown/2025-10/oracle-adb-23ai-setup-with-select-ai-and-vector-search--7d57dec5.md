---
title: "Oracle ADB 23ai setup with SELECT AI and vector search"
uuid: 7d57dec5-0566-4c1a-a3b3-226f73a7e942
created: 2025-10-29T17:27:47.505786Z
updated: 2025-10-29T17:30:00.835810Z
source: claude.ai export
---

# Oracle ADB 23ai setup with SELECT AI and vector search

**Frank**:

I need to get started using OCI MCP servers and ADB 26AI. Select AI and vectors. Also fill with synthetic data. I want about creative industry or my personal brand possibly makes sense? Make guide for me to do this tomorrow and also proper time estimates to setup and then connect with a LLM or so.

**Claude**:

I'll create a comprehensive guide for you to set up OCI MCP servers with ADB 23ai (I believe you meant 23ai, Oracle's latest AI-enabled database), leveraging SELECT AI and vector capabilities with synthetic data focused on your creative industry/personal brand work.

# Complete Setup Guide: OCI ADB 23ai with MCP Servers, SELECT AI & Vectors

## Overview
This guide will walk you through creating an Oracle Autonomous Database with AI capabilities, populating it with creative industry synthetic data, enabling SELECT AI for natural language querying, implementing vector search, and connecting it via MCP (Model Context Protocol) servers for LLM integration.

## Time Estimates

| Phase | Task | Estimated Time |
|-------|------|----------------|
| **Phase 1** | ADB Provisioning & Basic Setup | 20-30 minutes |
| **Phase 2** | SELECT AI Configuration | 15-20 minutes |
| **Phase 3** | Vector Search Setup | 25-35 minutes |
| **Phase 4** | Synthetic Data Generation & Loading | 30-45 minutes |
| **Phase 5** | MCP Server Setup & Configuration | 45-60 minutes |
| **Phase 6** | Testing & LLM Integration | 20-30 minutes |
| **Total** | **End-to-End Setup** | **2.5-4 hours** |

---

## Phase 1: ADB 23ai Provisioning (20-30 minutes)

### Step 1.1: Create Autonomous Database
1. Log into OCI Console
2. Navigate to **Oracle Database** → **Autonomous Database**
3. Click **Create Autonomous Database**
4. Configure:
   - **Compartment**: friemer (your existing compartment)
   - **Display name**: `frankx-creative-ai-db`
   - **Database name**: `FRANKXAI`
   - **Workload type**: **Data Warehouse** (best for AI/analytics)
   - **Deployment type**: **Serverless**
   - **Database version**: **23ai** (ensure this is selected)
   - **OCPU count**: Start with **1 OCPU** (auto-scaling enabled)
   - **Storage**: **1 TB** (20 GB minimum, but 1TB gives you room)
   - **Auto scaling**: **Enabled**
   - **Network access**: **Secure access from everywhere** (for initial setup)
   - **License type**: **License Included**

5. Set **ADMIN password** (save this securely!)
6. Click **Create Autonomous Database**
7. Wait 2-3 minutes for provisioning

### Step 1.2: Configure Always Free Tier Alternative (Optional)
If budget is tight, create an Always Free tier ADB:
- **OCPU**: 1 (non-scalable)
- **Storage**: 20 GB
- This limits AI capabilities but works for testing

### Step 1.3: Download Wallet & Connection Info
1. Once database is **AVAILABLE**, click on it
2. Click **Database connection** button
3. Download **Wallet** (Instance Wallet)
4. Save wallet files to: `C:\Users\Frank\OCI\Wallets\frankx-creative-ai-db`
5. Note down connection strings (especially **HIGH** for queries)

---

## Phase 2: SELECT AI Configuration (15-20 minutes)

### Step 2.1: Enable SELECT AI
1. Open **Database Actions** (from ADB console page)
2. Log in as **ADMIN**
3. Go to **SQL** worksheet
4. Run:

```sql
-- Enable SELECT AI (should be enabled by default in 23ai)
BEGIN
    DBMS_CLOUD_AI.SET_PROFILE(
        profile_name => 'OPENAI_GPT4',
        attributes => JSON_OBJECT(
            'provider' VALUE 'openai',
            'credential_name' VALUE 'OPENAI_CRED',
            'object_list' VALUE JSON_ARRAY(
                JSON_OBJECT('owner' VALUE 'ADMIN')
            )
        )
    );
END;
/
```

### Step 2.2: Configure AI Provider Credentials
You'll need an OpenAI API key or use OCI Generative AI:

**Option A: Using OCI Generative AI (Recommended - no external costs)**
```sql
BEGIN
    DBMS_CLOUD_AI.CREATE_PROFILE(
        profile_name => 'OCI_GENAI',
        attributes => JSON_OBJECT(
            'provider' VALUE 'oci',
            'credential_name' VALUE 'OCI_GENAI_CRED',
            'oci_compartment_id' VALUE 'your-compartment-ocid',
            'oci_genai_model' VALUE 'cohere.command-r-plus',
            'object_list' VALUE JSON_ARRAY(
                JSON_OBJECT('owner' VALUE 'ADMIN', 'name' VALUE 'CREATIVE_PROJECTS')
            )
        )
    );
END;
/
```

**Option B: Using OpenAI**
```sql
-- Store OpenAI API key
BEGIN
    DBMS_CLOUD.CREATE_CREDENTIAL(
        credential_name => 'OPENAI_CRED',
        username => 'openai',
        password => 'YOUR_OPENAI_API_KEY'
    );
END;
/
```

---

## Phase 3: Vector Search Setup (25-35 minutes)

### Step 3.1: Enable AI Vector Search
```sql
-- Create vector-enabled table for creative content
CREATE TABLE creative_content_vectors (
    content_id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    title VARCHAR2(500),
    description CLOB,
    content_type VARCHAR2(100),
    tags VARCHAR2(1000),
    created_date DATE,
    embedding VECTOR(1536, FLOAT32),  -- For OpenAI ada-002 embeddings
    metadata JSON
);

-- Create vector index for similarity search
CREATE VECTOR INDEX content_vec_idx 
ON creative_content_vectors(embedding)
ORGANIZATION NEIGHBOR PARTITIONS
DISTANCE COSINE
WITH TARGET ACCURACY 95;
```

### Step 3.2: Create Helper Functions
```sql
-- Function to generate embeddings using SELECT AI
CREATE OR REPLACE FUNCTION generate_embedding(
    p_text IN CLOB
) RETURN VECTOR AS
    v_embedding VECTOR;
BEGIN
    SELECT ai_embed(p_text USING embed_model 'text-embedding-ada-002')
    INTO v_embedding
    FROM dual;
    
    RETURN v_embedding;
EXCEPTION
    WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE('Error generating embedding: ' || SQLERRM);
        RETURN NULL;
END;
/
```

---

## Phase 4: Synthetic Data Generation (30-45 minutes)

### Step 4.1: Create Schema for FrankX Creative Brand

```sql
-- Projects table
CREATE TABLE creative_projects (
    project_id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    project_name VARCHAR2(200) NOT NULL,
    project_type VARCHAR2(100), -- 'Branding', 'Content', 'AI Demo', etc.
    status VARCHAR2(50),
    start_date DATE,
    completion_date DATE,
    client_name VARCHAR2(200),
    description CLOB,
    technologies VARCHAR2(500),
    outcomes CLOB,
    budget NUMBER(10,2),
    created_at TIMESTAMP DEFAULT SYSTIMESTAMP
);

-- Content pieces table
CREATE TABLE content_pieces (
    content_id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    project_id NUMBER,
    content_type VARCHAR2(100), -- 'Blog', 'Video', 'Social', 'Demo', etc.
    title VARCHAR2(500),
    content_text CLOB,
    platform VARCHAR2(100),
    engagement_metrics JSON,
    publish_date DATE,
    created_at TIMESTAMP DEFAULT SYSTIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES creative_projects(project_id)
);

-- Skills and technologies
CREATE TABLE skills_tech (
    skill_id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    skill_name VARCHAR2(200),
    category VARCHAR2(100), -- 'AI/ML', 'Cloud', 'Creative', 'Development'
    proficiency_level VARCHAR2(50),
    years_experience NUMBER,
    projects_count NUMBER
);

-- Client interactions
CREATE TABLE client_interactions (
    interaction_id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    client_name VARCHAR2(200),
    interaction_type VARCHAR2(100),
    interaction_date DATE,
    notes CLOB,
    sentiment VARCHAR2(50),
    follow_up_required VARCHAR2(10)
);
```

### Step 4.2: Generate Synthetic Data

```sql
-- Insert synthetic creative projects
BEGIN
    INSERT INTO creative_projects (project_name, project_type, status, start_date, completion_date, 
                                   client_name, description, technologies, outcomes, budget)
    VALUES 
        ('Oracle AI CoE Demo Platform', 'AI Demo', 'Completed', 
         TO_DATE('2024-06-01', 'YYYY-MM-DD'), TO_DATE('2024-08-15', 'YYYY-MM-DD'),
         'Oracle Internal', 
         'Comprehensive demonstration platform showcasing Oracle AI capabilities including SELECT AI, AI Agents, and AIDP integration. Built to educate stakeholders on enterprise AI solutions.',
         'Oracle ADB 23ai, SELECT AI, AI Agents, Python, OCI',
         'Successfully demonstrated to 50+ stakeholders, leading to 3 new implementation projects. Reduced demo setup time by 70%.',
         15000);
    
    INSERT INTO creative_projects (project_name, project_type, status, start_date, 
                                   client_name, description, technologies, outcomes, budget)
    VALUES 
        ('FrankX Personal Brand Development', 'Branding', 'In Progress', 
         TO_DATE('2024-09-01', 'YYYY-MM-DD'), 
         'Self', 
         'Building a comprehensive personal brand focused on AI, cloud technologies, and creative problem-solving. Includes content creation, social media strategy, and thought leadership.',
         'Content Management, Social Media, AI Tools, Cloud Infrastructure',
         'Growing LinkedIn following by 200%, published 15 technical articles, established expertise in OCI and AI.',
         5000);
    
    INSERT INTO creative_projects (project_name, project_type, status, start_date, completion_date,
                                   client_name, description, technologies, outcomes, budget)
    VALUES 
        ('Arcanea World-Building Project', 'Creative Content', 'In Progress', 
         TO_DATE('2024-03-01', 'YYYY-MM-DD'), NULL,
         'Self', 
         'Fantasy world-building project integrating AI-powered content generation, database-driven lore management, and interactive storytelling elements.',
         'Oracle ADB, AI Content Generation, Python, Vector Search',
         'Created 200+ pages of lore, 50 characters with AI-generated descriptions, interactive map system.',
         3000);
    
    -- Add more projects
    INSERT INTO creative_projects (project_name, project_type, status, start_date, completion_date,
                                   client_name, description, technologies, outcomes, budget)
    VALUES 
        ('Enterprise AI Training Workshop Series', 'Training', 'Completed', 
         TO_DATE('2024-04-01', 'YYYY-MM-DD'), TO_DATE('2024-05-30', 'YYYY-MM-DD'),
         'Tech Corp Inc', 
         'Designed and delivered 6-week training series on implementing AI in enterprise environments, focusing on practical applications and ROI.',
         'AI/ML Concepts, Cloud Platforms, Hands-on Labs',
         'Trained 120 employees, 95% satisfaction rate, 30% of participants implemented AI projects within 3 months.',
         25000);
    
    INSERT INTO creative_projects (project_name, project_type, status, start_date,
                                   client_name, description, technologies, outcomes, budget)
    VALUES 
        ('Multi-Cloud AI Integration Framework', 'Development', 'In Progress', 
         TO_DATE('2024-10-01', 'YYYY-MM-DD'),
         'Enterprise Client A', 
         'Building framework to integrate AI services across OCI, AWS, and Azure with unified API interface.',
         'OCI, AWS, Azure, Python, REST APIs, Docker',
         'Phase 1 complete - OCI integration working with 99.9% uptime.',
         45000);
    
    COMMIT;
END;
/

-- Insert content pieces
BEGIN
    INSERT INTO content_pieces (project_id, content_type, title, content_text, platform, 
                               engagement_metrics, publish_date)
    VALUES 
        (1, 'Blog', 'Getting Started with Oracle SELECT AI: A Practical Guide',
         'In this comprehensive guide, we explore Oracle SELECT AI capabilities and how it transforms database interactions using natural language. We cover setup, configuration, and real-world use cases...',
         'LinkedIn', 
         JSON_OBJECT('views' VALUE 2500, 'likes' VALUE 180, 'shares' VALUE 45, 'comments' VALUE 32),
         TO_DATE('2024-08-20', 'YYYY-MM-DD'));
    
    INSERT INTO content_pieces (project_id, content_type, title, content_text, platform, 
                               engagement_metrics, publish_date)
    VALUES 
        (2, 'Video', 'Why AI Professionals Should Master Cloud Infrastructure',
         'Video transcript: Cloud infrastructure is the backbone of modern AI deployments. In this video, I share why understanding OCI, AWS, or Azure is crucial for AI practitioners...',
         'YouTube', 
         JSON_OBJECT('views' VALUE 5200, 'likes' VALUE 320, 'subscribers_gained' VALUE 85),
         TO_DATE('2024-09-15', 'YYYY-MM-DD'));
    
    INSERT INTO content_pieces (project_id, content_type, title, content_text, platform, 
                               engagement_metrics, publish_date)
    VALUES 
        (3, 'Documentation', 'Arcanea Character Database: AI-Generated Lore System',
         'Documentation for the Arcanea character generation system utilizing vector embeddings for character trait similarity search and AI-powered backstory generation...',
         'GitHub', 
         JSON_OBJECT('stars' VALUE 45, 'forks' VALUE 12, 'watchers' VALUE 28),
         TO_DATE('2024-07-10', 'YYYY-MM-DD'));
    
    COMMIT;
END;
/

-- Insert skills
BEGIN
    INSERT INTO skills_tech (skill_name, category, proficiency_level, years_experience, projects_count)
    VALUES ('Oracle Cloud Infrastructure (OCI)', 'Cloud', 'Advanced', 3, 25);
    
    INSERT INTO skills_tech (skill_name, category, proficiency_level, years_experience, projects_count)
    VALUES ('Oracle Autonomous Database', 'Database', 'Advanced', 2, 18);
    
    INSERT INTO skills_tech (skill_name, category, proficiency_level, years_experience, projects_count)
    VALUES ('SELECT AI & Vector Search', 'AI/ML', 'Intermediate', 1, 8);
    
    INSERT INTO skills_tech (skill_name, category, proficiency_level, years_experience, projects_count)
    VALUES ('Python for AI/ML', 'Development', 'Advanced', 4, 35);
    
    INSERT INTO skills_tech (skill_name, category, proficiency_level, years_experience, projects_count)
    VALUES ('Content Creation & Strategy', 'Creative', 'Advanced', 5, 50);
    
    INSERT INTO skills_tech (skill_name, category, proficiency_level, years_experience, projects_count)
    VALUES ('AI Agents & Automation', 'AI/ML', 'Intermediate', 1, 5);
    
    COMMIT;
END;
/

-- Insert client interactions
BEGIN
    INSERT INTO client_interactions (client_name, interaction_type, interaction_date, notes, sentiment, follow_up_required)
    VALUES ('Oracle Internal', 'Demo Presentation', TO_DATE('2024-08-15', 'YYYY-MM-DD'),
            'Presented AI CoE demo to leadership team. Very positive reception. Questions focused on scalability and cost optimization.',
            'Positive', 'Yes');
    
    INSERT INTO client_interactions (client_name, interaction_type, interaction_date, notes, sentiment, follow_up_required)
    VALUES ('Tech Corp Inc', 'Training Feedback', TO_DATE('2024-05-30', 'YYYY-MM-DD'),
            'End of training survey results excellent. Multiple requests for advanced follow-up workshops. Potential for ongoing partnership.',
            'Very Positive', 'Yes');
    
    COMMIT;
END;
/
```

### Step 4.3: Generate Embeddings for Vector Search

```sql
-- Populate vector table with embeddings
BEGIN
    FOR rec IN (
        SELECT project_id, project_name, description, project_type, technologies
        FROM creative_projects
    ) LOOP
        INSERT INTO creative_content_vectors 
            (title, description, content_type, tags, created_date, embedding)
        VALUES (
            rec.project_name,
            rec.description,
            rec.project_type,
            rec.technologies,
            SYSDATE,
            generate_embedding(rec.project_name || ' ' || rec.description)
        );
    END LOOP;
    
    COMMIT;
END;
/
```

---

## Phase 5: MCP Server Setup (45-60 minutes)

### Step 5.1: Install Prerequisites (Local Machine)

```bash
# Install Node.js (if not already installed)
# Download from: https://nodejs.org/ (LTS version)

# Verify installation
node --version
npm --version

# Install Python dependencies for Oracle connectivity
pip install oracledb python-dotenv
```

### Step 5.2: Create MCP Server for Oracle ADB

Create directory structure:
```
C:\Users\Frank\OCI\mcp-oracle-server\
├── server.js
├── package.json
├── .env
└── wallets\
    └── (your wallet files)
```

**package.json**:
```json
{
  "name": "oci-adb-mcp-server",
  "version": "1.0.0",
  "description": "MCP Server for Oracle Autonomous Database 23ai",
  "main": "server.js",
  "type": "module",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "oracledb": "^6.6.0",
    "@modelcontextprotocol/sdk": "^0.5.0",
    "dotenv": "^16.4.5"
  }
}
```

**server.js**:
```javascript
import oracledb from 'oracledb';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import dotenv from 'dotenv';

dotenv.config();

// Oracle DB Configuration
const dbConfig = {
  user: process.env.DB_USER || "ADMIN",
  password: process.env.DB_PASSWORD,
  connectString: process.env.DB_CONNECT_STRING,
  walletLocation: process.env.WALLET_LOCATION,
  walletPassword: process.env.WALLET_PASSWORD
};

// Initialize Oracle Client
oracledb.initOracleClient({ 
  libDir: process.env.ORACLE_CLIENT_LIB || 'C:\\oracle\\instantclient_23_5',
  configDir: dbConfig.walletLocation 
});

class OracleADBServer {
  constructor() {
    this.server = new Server(
      {
        name: 'oci-adb-mcp-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupHandlers();
    this.connection = null;
  }

  async initConnection() {
    if (!this.connection) {
      this.connection = await oracledb.getConnection(dbConfig);
    }
    return this.connection;
  }

  setupHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: 'query_creative_projects',
          description: 'Query FrankX creative projects with filters',
          inputSchema: {
            type: 'object',
            properties: {
              project_type: {
                type: 'string',
                description: 'Filter by project type (Branding, AI Demo, Training, etc.)',
              },
              status: {
                type: 'string',
                description: 'Filter by status (In Progress, Completed)',
              },
              limit: {
                type: 'number',
                description: 'Maximum number of results',
                default: 10,
              },
            },
          },
        },
        {
          name: 'semantic_search',
          description: 'Perform semantic search using vector embeddings',
          inputSchema: {
            type: 'object',
            properties: {
              query: {
                type: 'string',
                description: 'Natural language search query',
              },
              limit: {
                type: 'number',
                description: 'Number of results to return',
                default: 5,
              },
            },
            required: ['query'],
          },
        },
        {
          name: 'select_ai_query',
          description: 'Use SELECT AI for natural language database queries',
          inputSchema: {
            type: 'object',
            properties: {
              natural_language_query: {
                type: 'string',
                description: 'Natural language question about the database',
              },
            },
            required: ['natural_language_query'],
          },
        },
        {
          name: 'get_skills_summary',
          description: 'Get summary of skills and technologies',
          inputSchema: {
            type: 'object',
            properties: {
              category: {
                type: 'string',
                description: 'Filter by category (AI/ML, Cloud, Creative, Development)',
              },
            },
          },
        },
      ],
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        const conn = await this.initConnection();

        switch (name) {
          case 'query_creative_projects': {
            let query = 'SELECT * FROM creative_projects WHERE 1=1';
            const binds = {};

            if (args.project_type) {
              query += ' AND project_type = :project_type';
              binds.project_type = args.project_type;
            }
            if (args.status) {
              query += ' AND status = :status';
              binds.status = args.status;
            }
            query += ' ORDER BY created_at DESC FETCH FIRST :limit ROWS ONLY';
            binds.limit = args.limit || 10;

            const result = await conn.execute(query, binds, { outFormat: oracledb.OUT_FORMAT_OBJECT });
            
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(result.rows, null, 2),
                },
              ],
            };
          }

          case 'semantic_search': {
            // First generate embedding for query
            const embeddingQuery = `SELECT ai_embed(:query_text USING embed_model 'text-embedding-ada-002') AS embedding FROM dual`;
            const embResult = await conn.execute(embeddingQuery, { query_text: args.query });
            
            // Then perform vector search
            const vectorQuery = `
              SELECT title, description, content_type, 
                     VECTOR_DISTANCE(embedding, :query_embedding, COSINE) AS similarity
              FROM creative_content_vectors
              ORDER BY similarity
              FETCH FIRST :limit ROWS ONLY
            `;
            
            const result = await conn.execute(vectorQuery, {
              query_embedding: embResult.rows[0][0],
              limit: args.limit || 5
            }, { outFormat: oracledb.OUT_FORMAT_OBJECT });

            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(result.rows, null, 2),
                },
              ],
            };
          }

          case 'select_ai_query': {
            const aiQuery = `SELECT ai_narrate('${args.natural_language_query}') FROM dual`;
            const result = await conn.execute(aiQuery, {}, { outFormat: oracledb.OUT_FORMAT_OBJECT });

            return {
              content: [
                {
                  type: 'text',
                  text: result.rows[0].AI_NARRATE,
                },
              ],
            };
          }

          case 'get_skills_summary': {
            let query = 'SELECT * FROM skills_tech';
            const binds = {};
            
            if (args.category) {
              query += ' WHERE category = :category';
              binds.category = args.category;
            }
            query += ' ORDER BY proficiency_level DESC, years_experience DESC';

            const result = await conn.execute(query, binds, { outFormat: oracledb.OUT_FORMAT_OBJECT });

            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(result.rows, null, 2),
                },
              ],
            };
          }

          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${error.message}`,
            },
          ],
          isError: true,
        };
      }
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('OCI ADB MCP server running on stdio');
  }
}

const server = new OracleADBServer();
server.run().catch(console.error);
```

**.env**:
```
DB_USER=ADMIN
DB_PASSWORD=your_admin_password
DB_CONNECT_STRING=your_connection_string_high
WALLET_LOCATION=C:\Users\Frank\OCI\Wallets\frankx-creative-ai-db
WALLET_PASSWORD=your_wallet_password
ORACLE_CLIENT_LIB=C:\oracle\instantclient_23_5
```

### Step 5.3: Install Oracle Instant Client

1. Download Oracle Instant Client from: https://www.oracle.com/database/technologies/instant-client/downloads.html
2. Extract to `C:\oracle\instantclient_23_5`
3. Add to PATH environment variable

### Step 5.4: Install and Run

```bash
cd C:\Users\Frank\OCI\mcp-oracle-server
npm install
npm start
```

---

## Phase 6: LLM Integration & Testing (20-30 minutes)

### Step 6.1: Configure Claude Desktop with MCP Server

Edit Claude Desktop config (`%APPDATA%\Claude\claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "oci-adb": {
      "command": "node",
      "args": ["C:\\Users\\Frank\\OCI\\mcp-oracle-server\\server.js"],
      "env": {
        "DB_USER": "ADMIN",
        "DB_PASSWORD": "your_password",
        "DB_CONNECT_STRING": "your_connection_string",
        "WALLET_LOCATION": "C:\\Users\\Frank\\OCI\\Wallets\\frankx-creative-ai-db"
      }
    }
  }
}
```

### Step 6.2: Test Queries

Restart Claude Desktop and test:

1. **Basic query**: "Show me all my AI-related projects"
2. **Semantic search**: "Find content about Oracle demonstrations"
3. **SELECT AI**: "What's the total budget across all completed projects?"
4. **Skills query**: "What are my top cloud skills?"

### Step 6.3: Test SELECT AI Directly in Database

```sql
-- Natural language query examples
SELECT ai_narrate('What are the top 3 projects by budget?') FROM dual;

SELECT ai_narrate('Show me all in-progress projects related to AI') FROM dual;

SELECT ai_narrate('What skills do I have in the AI/ML category?') FROM dual;
```

---

## Cost Optimization Tips

1. **Schedule Auto-Stop**: Set database to stop during non-working hours
2. **Start with 1 OCPU**: Scale only when needed
3. **Monitor usage**: Use OCI Cost Analysis regularly
4. **Use Always Free tier** for testing if possible

---

## Troubleshooting Guide

| Issue | Solution |
|-------|----------|
| Wallet connection fails | Verify wallet files in correct location, check TNS_ADMIN env variable |
| SELECT AI not working | Ensure 23ai version, verify AI profile configuration |
| Vector index slow | Increase target accuracy or reduce dimensions |
| MCP server won't start | Check Node.js version (18+), verify Oracle Client installed |
| Embedding generation fails | Confirm OpenAI API key or OCI GenAI credentials configured |

---

## Next Steps After Setup

1. **Expand synthetic data**: Add more projects from your actual work
2. **Create dashboards**: Use Oracle Analytics Cloud to visualize
3. **Build AI agents**: Implement autonomous agents using this foundation
4. **Document learnings**: Create content for FrankX brand
5. **Share demos**: Use this setup for Oracle CoE presentations

---

This setup gives you a production-ready foundation for demonstrating Oracle's AI capabilities while building practical tools for your personal brand and creative projects. The MCP integration allows seamless LLM interaction with your data, and the vector search enables semantic queries across your content.

Let me know if you need clarification on any steps or run into issues during implementation!
