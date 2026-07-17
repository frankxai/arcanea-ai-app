---
title: "Open Source World Building Documentation Tools"
uuid: dd0c0732-d5cc-4de9-8885-c2fa8f420cce
created: 2025-09-03T20:38:32.870106Z
updated: 2025-09-03T20:42:53.035464Z
source: claude.ai export
---

# Open Source World Building Documentation Tools

**Frank**:

Can we fork gitbook and similar? What can sync with github but is focused on world building or book writing so we use for Arcanea but oss

**Claude**:

I'll search for information about GitBook's licensing and open-source alternatives that focus on world building and book writing.
```
This block is not supported on your current device yet.
```

Now let me search for world building and creative writing focused documentation tools.
```
This block is not supported on your current device yet.
```

Let me search more specifically for creative writing and world building tools that sync with Git.
```
This block is not supported on your current device yet.
```

Now let me search for open source alternatives specifically designed for creative writing and world building.
```
This block is not supported on your current device yet.
```

Let me search for more specific alternatives like mdBook and Bookstack that were mentioned earlier.
```
This block is not supported on your current device yet.
```

Based on my research, here's what I found about forking GitBook and open-source alternatives for world building and book writing:

## GitBook Forking

**Yes, you can fork GitBook!** GitBook's rendering engine is fully open source under the GNU GPLv3 license. You can clone their repository and even distribute the code, but you must keep the source code public to comply with the GPLv3. GitBook encourages contributions to their main project rather than creating your own fork, and they cannot guarantee support for forked instances.

## Better Open Source Alternatives for World Building

For your Arcanea project, here are several open-source alternatives that offer GitHub sync and are better suited for creative writing and world building:

### **BookStack** - Top Recommendation
BookStack is a simple, self-hosted, easy-to-use platform for organizing information that's fully free and open source under MIT license. It organizes content into three simple groups: Books, Chapters, and Pages, with full search capabilities and the ability to link directly to any paragraph. It includes built-in diagrams.net drawing capability for creating diagrams, supports Markdown editing with live preview, and offers both light and dark themes.

### **Obsidian + Git Plugin**
Obsidian with the obsidian-git plugin provides powerful Git integration with automatic commit-and-sync, source control view to stage/unstage files, and history browsing. Obsidian is widely used for world building, with extensive plugin support and the ability to create interconnected notes - files are stored as plain text with markdown so you can edit them in any text editor.

### **Nexus-Forge** - Purpose-Built for World Building
Nexus-Forge is an open source worldbuilding tool specifically designed to help creators build immersive, detailed worlds with customizable templates and AI assistance integration. It's built with modern tech stack (Supabase/Vercel) and includes AI writing assistance features.

### **Docusaurus** - React-Based 
Docusaurus is a static-site generator built on React that allows you to write Markdown files and includes advanced features like versioning, i18n, search, and theme customizations. It supports JSX and React components embedded in Markdown for interactive content.

### **mdBook** - Rust-Based Simplicity
mdBook is a command-line tool built in Rust for creating online portals from Markdown files, focusing on being easy to use and fast with support for various output formats like HTML, PDF, and ePub.

## Recommendations for Arcanea

For a world building project like Arcanea that needs GitHub sync:

1. **BookStack** if you want a traditional wiki-style organization with excellent self-hosting capabilities
2. **Obsidian + Git plugin** if you prefer a more flexible, graph-based approach with extensive customization
3. **Nexus-Forge** if you want something purpose-built for world building with modern features
4. **Docusaurus** if you want a polished, React-based solution with excellent theming

All of these can sync with GitHub and are open source, giving you full control over your world building documentation while avoiding vendor lock-in.

**Frank**:

It seems Nexus forge is a similar too stage i am in. What is best way to do much better? And other options you gave me is my content synced with github? It woll be essential for the other AI agents to work with it or?

**Claude**:

Great questions! Let me search for more details about Nexus-Forge's current state and clarify the GitHub sync capabilities of the other options.
```
This block is not supported on your current device yet.
```

Now let me search for GitHub sync capabilities of the other tools and how they work with AI agents.
```
This block is not supported on your current device yet.
```

Let me search for how AI agents typically work with documentation systems and version control.
```
This block is not supported on your current device yet.
```

Based on my research, here's what I found about improving on Nexus-Forge's approach and GitHub sync options for AI agents:

## About Nexus-Forge's Current State

Nexus-Forge is still in early development stage with many features not yet implemented. While it shows promise as a purpose-built worldbuilding tool, you're right that you're at a similar early stage, which presents an opportunity to build something better.

## How to Do Much Better Than Nexus-Forge

**Focus on these key advantages:**

1. **True GitHub-native approach** - Store everything as markdown files in Git from day one
2. **AI agent integration from the ground up** - Design specifically for AI agent workflows  
3. **Mature ecosystem leverage** - Build on proven tools rather than starting from scratch
4. **Better content organization** - World building has specific needs (characters, locations, timelines, relationships)

## GitHub Sync Options & AI Agent Compatibility

**YES - Your content synced with GitHub is essential for AI agents!** Here's how each option handles this:

### **Best Options for AI Agent Integration:**

**1. Obsidian + Git Plugin ⭐ (Recommended for Arcanea)**
- ✅ **Native markdown files** stored directly in Git 
- ✅ Full Git integration with automatic commit-and-sync
- ✅ Already supports MCP integration for AI agents like Claude
- ✅ Plugin ecosystem for world building features
- ✅ AI agents can read/write markdown files directly

**2. mdBook/Docusaurus + Custom Scripts**
- ✅ **Pure markdown files** in Git repositories
- ✅ AI agents work excellently with markdown-based documentation systems
- ✅ Can build custom world building templates
- ✅ Static site generation for beautiful presentation

**3. BookStack with Custom Sync**
- ⚠️ **Partial sync** - BookStack doesn't natively sync with Git, but community tools exist for one-way sync from Git to BookStack
- ⚠️ Can export to markdown but requires manual workflow
- ❌ Not ideal for AI agents that need direct file access

## Why GitHub Sync is Essential for AI Agents

AI agents work best with markdown files and Git repositories because they can directly read, modify, and commit changes to documentation. Modern AI workflows use Model Context Protocol (MCP) to access documentation stored in version control systems.

## My Recommendation for Arcanea

**Go with Obsidian + Git Plugin + Custom World Building Templates**

**Why this approach beats Nexus-Forge:**
1. **Mature foundation** - Obsidian is battle-tested with huge plugin ecosystem
2. **True Git-native** - Everything is markdown files in your repository 
3. **AI agent ready** - Already supports MCP and direct file access
4. **Extensible** - You can build world building specific plugins/templates
5. **Future-proof** - Your content is portable markdown files, not locked in a database

**Implementation approach:**
1. Start with Obsidian + obsidian-git plugin
2. Create custom templates for world building (characters, locations, cultures, etc.)
3. Set up automated Git sync
4. Build MCP integration for AI agents to read/write your world content
5. Add custom plugins for world building specific features (relationship graphs, timeline views, etc.)

This gives you all the benefits of a purpose-built tool while leveraging a mature ecosystem and ensuring perfect AI agent compatibility through native markdown + Git storage.
