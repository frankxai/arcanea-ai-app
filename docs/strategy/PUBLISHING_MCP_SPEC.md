# Publishing MCP Server Specification

> Version 1.0 | March 2026
> Status: SPEC (not implemented)

---

## Overview

A Model Context Protocol server that automates the entire book publishing pipeline -- from manuscript formatting through multi-platform distribution, metadata management, cover art direction, social promotion, and sales analytics. Designed for authors who publish across KDP, Apple Books, IngramSpark, and Kobo simultaneously.

---

## Server Configuration

```json
{
  "mcpServers": {
    "arcanea-publishing": {
      "command": "npx",
      "args": ["-y", "@arcanea/publishing-mcp@latest"],
      "env": {
        "PUBLISHING_DATA_DIR": "./publishing",
        "KDP_API_KEY": "${KDP_API_KEY}",
        "APPLE_BOOKS_API_KEY": "${APPLE_BOOKS_API_KEY}",
        "INGRAM_SPARK_API_KEY": "${INGRAM_SPARK_API_KEY}",
        "KOBO_API_KEY": "${KOBO_API_KEY}",
        "ISBN_API_KEY": "${ISBN_API_KEY}",
        "BOWKER_ACCOUNT_ID": "${BOWKER_ACCOUNT_ID}",
        "SOCIAL_TWITTER_TOKEN": "${SOCIAL_TWITTER_TOKEN}",
        "SOCIAL_INSTAGRAM_TOKEN": "${SOCIAL_INSTAGRAM_TOKEN}",
        "SOCIAL_LINKEDIN_TOKEN": "${SOCIAL_LINKEDIN_TOKEN}",
        "NEWSLETTER_PROVIDER": "convertkit|mailchimp|buttondown",
        "NEWSLETTER_API_KEY": "${NEWSLETTER_API_KEY}",
        "ENCRYPTION_KEY": "${ENCRYPTION_KEY}"
      }
    }
  }
}
```

### Required API Keys by Feature

| Feature | Required Keys | Provider |
|---------|--------------|----------|
| KDP Upload | `KDP_API_KEY` | Amazon KDP |
| Apple Books | `APPLE_BOOKS_API_KEY` | Apple iTunes Connect |
| IngramSpark | `INGRAM_SPARK_API_KEY` | IngramSpark Partner API |
| Kobo | `KOBO_API_KEY` | Kobo Writing Life |
| ISBN | `ISBN_API_KEY`, `BOWKER_ACCOUNT_ID` | Bowker / national ISBN agency |
| Social | `SOCIAL_TWITTER_TOKEN`, `SOCIAL_INSTAGRAM_TOKEN`, `SOCIAL_LINKEDIN_TOKEN` | Per platform |
| Newsletter | `NEWSLETTER_API_KEY` | ConvertKit / Mailchimp / Buttondown |

---

## Tools

### `publish_format`

Convert a markdown manuscript to publishing-ready formats.

**Parameters:**

```json
{
  "type": "object",
  "properties": {
    "source_path": {
      "type": "string",
      "description": "Path to the markdown file or directory of chapter files"
    },
    "output_format": {
      "type": "string",
      "enum": ["epub", "pdf", "kindle", "docx", "all"],
      "description": "Target format. 'all' generates every format."
    },
    "book_id": {
      "type": "string",
      "description": "Book identifier for tracking in the pipeline"
    },
    "options": {
      "type": "object",
      "properties": {
        "stylesheet": {
          "type": "string",
          "description": "Path to custom CSS for epub/kindle styling"
        },
        "page_size": {
          "type": "string",
          "enum": ["5x8", "5.5x8.5", "6x9", "a5", "letter"],
          "default": "6x9",
          "description": "Page dimensions for PDF output"
        },
        "font_family": {
          "type": "string",
          "default": "Crimson Pro",
          "description": "Body text font"
        },
        "include_toc": {
          "type": "boolean",
          "default": true
        },
        "front_matter": {
          "type": "array",
          "items": { "type": "string" },
          "description": "Ordered list of front matter file paths (title page, copyright, dedication)"
        },
        "back_matter": {
          "type": "array",
          "items": { "type": "string" },
          "description": "Ordered list of back matter file paths (about author, also by)"
        }
      }
    }
  },
  "required": ["source_path", "output_format", "book_id"]
}
```

**Example Request:**

```json
{
  "tool": "publish_format",
  "arguments": {
    "source_path": "book/legends-of-arcanea/",
    "output_format": "all",
    "book_id": "legends-001",
    "options": {
      "stylesheet": "styles/book-theme.css",
      "page_size": "5.5x8.5",
      "font_family": "Crimson Pro",
      "include_toc": true,
      "front_matter": ["book/front/title.md", "book/front/copyright.md"],
      "back_matter": ["book/back/about-author.md", "book/back/also-by.md"]
    }
  }
}
```

**Example Response:**

```json
{
  "status": "success",
  "book_id": "legends-001",
  "outputs": [
    { "format": "epub", "path": "publishing/output/legends-001.epub", "size_kb": 842 },
    { "format": "pdf", "path": "publishing/output/legends-001.pdf", "size_kb": 3240 },
    { "format": "kindle", "path": "publishing/output/legends-001.mobi", "size_kb": 910 },
    { "format": "docx", "path": "publishing/output/legends-001.docx", "size_kb": 1520 }
  ],
  "warnings": [
    "Chapter 7 image exceeds KDP recommended DPI (150 vs 300). Consider replacing."
  ],
  "word_count": 78420,
  "chapter_count": 17
}
```

---

### `publish_upload`

Upload formatted manuscript to one or more publishing platforms.

**Parameters:**

```json
{
  "type": "object",
  "properties": {
    "book_id": {
      "type": "string",
      "description": "Book identifier"
    },
    "platforms": {
      "type": "array",
      "items": {
        "type": "string",
        "enum": ["kdp", "apple", "ingram_spark", "kobo"]
      },
      "description": "Target platforms. Omit for all connected platforms."
    },
    "action": {
      "type": "string",
      "enum": ["draft", "publish", "update"],
      "default": "draft",
      "description": "draft = save without publishing. publish = go live. update = revise existing listing."
    },
    "pricing": {
      "type": "object",
      "properties": {
        "currency": { "type": "string", "default": "USD" },
        "ebook_price": { "type": "number" },
        "paperback_price": { "type": "number" },
        "hardcover_price": { "type": "number" },
        "enrollment": {
          "type": "string",
          "enum": ["kdp_select", "wide"],
          "description": "KDP Select (exclusive) or wide distribution"
        }
      }
    },
    "schedule": {
      "type": "string",
      "format": "date-time",
      "description": "ISO 8601 datetime for scheduled publishing. Omit for immediate."
    }
  },
  "required": ["book_id"]
}
```

**Example Request:**

```json
{
  "tool": "publish_upload",
  "arguments": {
    "book_id": "legends-001",
    "platforms": ["kdp", "apple"],
    "action": "draft",
    "pricing": {
      "currency": "USD",
      "ebook_price": 9.99,
      "paperback_price": 16.99,
      "enrollment": "wide"
    }
  }
}
```

**Example Response:**

```json
{
  "status": "success",
  "book_id": "legends-001",
  "uploads": [
    {
      "platform": "kdp",
      "status": "draft_saved",
      "listing_url": "https://kdp.amazon.com/bookshelf/...",
      "review_required": true,
      "estimated_review_time": "72 hours"
    },
    {
      "platform": "apple",
      "status": "draft_saved",
      "listing_url": "https://itunesconnect.apple.com/...",
      "review_required": true,
      "estimated_review_time": "48 hours"
    }
  ]
}
```

---

### `publish_metadata`

Generate, validate, and manage book metadata including ISBN, categories, keywords, and descriptions.

**Parameters:**

```json
{
  "type": "object",
  "properties": {
    "book_id": {
      "type": "string"
    },
    "action": {
      "type": "string",
      "enum": ["generate", "validate", "assign_isbn"],
      "description": "generate = AI-draft metadata from manuscript. validate = check existing. assign_isbn = request new ISBN."
    },
    "metadata": {
      "type": "object",
      "properties": {
        "title": { "type": "string" },
        "subtitle": { "type": "string" },
        "author_name": { "type": "string" },
        "series_name": { "type": "string" },
        "series_position": { "type": "integer" },
        "description": {
          "type": "string",
          "maxLength": 4000,
          "description": "HTML-formatted book description"
        },
        "bisac_categories": {
          "type": "array",
          "items": { "type": "string" },
          "maxItems": 3,
          "description": "BISAC subject codes (e.g., FIC009020 for Fantasy/Epic)"
        },
        "keywords": {
          "type": "array",
          "items": { "type": "string" },
          "maxItems": 7,
          "description": "Discovery keywords (max 7 for KDP)"
        },
        "language": { "type": "string", "default": "en" },
        "age_range": {
          "type": "string",
          "enum": ["all_ages", "young_adult", "new_adult", "adult"]
        },
        "isbn_ebook": { "type": "string" },
        "isbn_paperback": { "type": "string" },
        "isbn_hardcover": { "type": "string" }
      }
    },
    "source_path": {
      "type": "string",
      "description": "Manuscript path for AI-generated metadata (required for action=generate)"
    }
  },
  "required": ["book_id", "action"]
}
```

**Example Request:**

```json
{
  "tool": "publish_metadata",
  "arguments": {
    "book_id": "legends-001",
    "action": "generate",
    "source_path": "book/legends-of-arcanea/"
  }
}
```

**Example Response:**

```json
{
  "status": "success",
  "book_id": "legends-001",
  "metadata": {
    "title": "Legends of Arcanea",
    "subtitle": "The First Dawn and the Founding Myths",
    "author_name": "FrankX",
    "series_name": "The Library of Arcanea",
    "series_position": 1,
    "description": "<p>In the beginning there was only Nero -- the vast, fertile darkness where all potential sleeps...</p><p>From the first spark of Lumina to the fall of Malachar Lumenbright, these founding myths reveal the cosmic architecture beneath all creation.</p>",
    "bisac_categories": [
      "FIC009020",
      "FIC061000",
      "FIC019000"
    ],
    "keywords": [
      "mythology fantasy",
      "creation myth",
      "elemental magic system",
      "cosmic fantasy",
      "world building",
      "AI fantasy",
      "light and darkness duality"
    ],
    "language": "en",
    "age_range": "all_ages"
  },
  "validation": {
    "description_length": 312,
    "keyword_count": 7,
    "bisac_valid": true,
    "warnings": []
  }
}
```

---

### `publish_cover`

Generate cover art direction brief and request mockup generation.

**Parameters:**

```json
{
  "type": "object",
  "properties": {
    "book_id": {
      "type": "string"
    },
    "action": {
      "type": "string",
      "enum": ["brief", "mockup", "finalize"],
      "description": "brief = generate art direction document. mockup = generate visual mockup. finalize = prepare print-ready files."
    },
    "specifications": {
      "type": "object",
      "properties": {
        "format": {
          "type": "string",
          "enum": ["ebook", "paperback", "hardcover"],
          "default": "ebook"
        },
        "trim_size": {
          "type": "string",
          "default": "6x9"
        },
        "spine_width_inches": {
          "type": "number",
          "description": "Calculated from page count. Required for paperback/hardcover."
        },
        "bleed": {
          "type": "boolean",
          "default": true
        },
        "style_references": {
          "type": "array",
          "items": { "type": "string" },
          "description": "Paths to reference images or URLs for style direction"
        },
        "color_palette": {
          "type": "array",
          "items": { "type": "string" },
          "description": "Hex colors to use (e.g., from Arcanean Design System)"
        },
        "typography": {
          "type": "object",
          "properties": {
            "title_font": { "type": "string" },
            "author_font": { "type": "string" }
          }
        }
      }
    },
    "content_summary": {
      "type": "string",
      "description": "Brief summary for cover concept generation. Auto-extracted from manuscript if omitted."
    }
  },
  "required": ["book_id", "action"]
}
```

**Example Response (action=brief):**

```json
{
  "status": "success",
  "book_id": "legends-001",
  "brief": {
    "concept": "A cosmic scene showing the duality of Lumina (golden light) and Nero (deep indigo void) converging at a central point where ten gates spiral outward. Cinematic scale, painterly style.",
    "composition": "Central focal point with radiating symmetry. Title at top third, author name at bottom.",
    "color_palette": ["#09090b", "#ffd700", "#0d47a1", "#00bcd4"],
    "mood": "Epic, mythic, contemplative. Not action-oriented -- more cosmic wonder.",
    "typography_direction": "Cinzel Decorative for title (gold foil effect), Space Grotesk for subtitle, author name in clean sans-serif.",
    "reference_comps": [
      "Brandon Sanderson 'Way of Kings' (scale)",
      "Ursula K. Le Guin editions (restraint)",
      "Yoshitaka Amano (painterly fantasy)"
    ],
    "specs": {
      "ebook_dimensions": "1600x2560px",
      "paperback_dimensions": "6.125x9.25in (with bleed)",
      "dpi": 300,
      "color_space": "CMYK for print, sRGB for ebook"
    }
  }
}
```

---

### `publish_social`

Generate platform-specific social media posts from book content.

**Parameters:**

```json
{
  "type": "object",
  "properties": {
    "book_id": {
      "type": "string"
    },
    "content_source": {
      "type": "string",
      "description": "Path to specific chapter/section to promote, or 'launch' for general book announcement"
    },
    "platforms": {
      "type": "array",
      "items": {
        "type": "string",
        "enum": ["twitter", "instagram", "linkedin", "threads", "bluesky", "mastodon"]
      }
    },
    "post_type": {
      "type": "string",
      "enum": ["excerpt", "announcement", "behind_the_scenes", "question", "thread", "launch"],
      "description": "Style of post to generate"
    },
    "schedule": {
      "type": "string",
      "format": "date-time",
      "description": "When to post. Omit for draft only."
    },
    "hashtags": {
      "type": "boolean",
      "default": true
    }
  },
  "required": ["book_id", "platforms", "post_type"]
}
```

**Example Response:**

```json
{
  "status": "success",
  "book_id": "legends-001",
  "posts": [
    {
      "platform": "twitter",
      "content": "\"In the beginning there was only Nero -- not darkness, but the fertile unknown where all potential sleeps.\"\n\nThe founding myth of Arcanea begins not with light, but with the silence before it.\n\nLegends of Arcanea, coming soon.\n\n#FantasyBooks #Mythology #WorldBuilding",
      "character_count": 264,
      "within_limit": true
    },
    {
      "platform": "instagram",
      "content": "The creation myth you didn't know you needed.\n\nNero isn't evil. Lumina isn't good. They're the inhale and exhale of a universe learning to exist.\n\nLegends of Arcanea explores the cosmic duality beneath all creation -- where potential meets manifestation, and the first light is born from the deepest dark.\n\nLink in bio.\n\n#FantasyBooks #CreationMyth #WorldBuilding #EpicFantasy #Mythology #IndieAuthor #BookRelease #DarkFantasy #CosmicFantasy #WritingCommunity",
      "character_count": 498,
      "within_limit": true,
      "suggested_image": "Cover art or cosmic duality visual (Lumina gold / Nero indigo split)"
    },
    {
      "platform": "linkedin",
      "content": "I spent two years building a mythology from scratch.\n\nNot as a hobby -- as a framework. Arcanea's founding myths encode a creative system: ten gates of mastery, five elements of expression, and a cosmic architecture designed so other creators can build their own worlds inside it.\n\nThe first volume, Legends of Arcanea, launches soon. It's both a fantasy book and a reference implementation.\n\nMore at arcanea.ai",
      "character_count": 432,
      "within_limit": true
    }
  ]
}
```

---

### `publish_newsletter`

Draft a newsletter from new content (chapter release, update, announcement).

**Parameters:**

```json
{
  "type": "object",
  "properties": {
    "book_id": {
      "type": "string"
    },
    "content_source": {
      "type": "string",
      "description": "Path to new chapter or content to base newsletter on"
    },
    "newsletter_type": {
      "type": "string",
      "enum": ["chapter_release", "launch_announcement", "behind_the_scenes", "monthly_update", "preorder"],
      "description": "Template style"
    },
    "audience_segment": {
      "type": "string",
      "enum": ["all", "beta_readers", "early_supporters", "new_subscribers"],
      "default": "all"
    },
    "include_excerpt": {
      "type": "boolean",
      "default": true,
      "description": "Include a content excerpt in the newsletter"
    },
    "excerpt_length": {
      "type": "integer",
      "default": 500,
      "description": "Max word count for excerpt"
    },
    "send": {
      "type": "boolean",
      "default": false,
      "description": "false = draft only. true = send via configured provider."
    }
  },
  "required": ["book_id", "newsletter_type"]
}
```

**Example Response:**

```json
{
  "status": "success",
  "book_id": "legends-001",
  "newsletter": {
    "subject": "The First Dawn -- Chapter 1 of Legends of Arcanea is live",
    "preview_text": "In the beginning there was only Nero...",
    "html_body": "<h2>The story begins.</h2><p>Chapter 1 of Legends of Arcanea is now available...</p>",
    "plain_text": "The story begins.\n\nChapter 1 of Legends of Arcanea is now available...",
    "word_count": 380,
    "audience_segment": "all",
    "subscriber_count": 1247
  },
  "draft_id": "nl_2026_03_15_001",
  "sent": false
}
```

---

### `publish_analytics`

Pull sales, reviews, and performance data from connected publishing platforms.

**Parameters:**

```json
{
  "type": "object",
  "properties": {
    "book_id": {
      "type": "string",
      "description": "Specific book, or omit for all books"
    },
    "platforms": {
      "type": "array",
      "items": {
        "type": "string",
        "enum": ["kdp", "apple", "ingram_spark", "kobo", "all"]
      },
      "default": ["all"]
    },
    "date_range": {
      "type": "object",
      "properties": {
        "start": { "type": "string", "format": "date" },
        "end": { "type": "string", "format": "date" }
      },
      "description": "Date range for analytics. Defaults to last 30 days."
    },
    "metrics": {
      "type": "array",
      "items": {
        "type": "string",
        "enum": ["sales", "revenue", "page_reads", "reviews", "rankings", "returns"]
      },
      "default": ["sales", "revenue", "reviews"]
    },
    "granularity": {
      "type": "string",
      "enum": ["daily", "weekly", "monthly"],
      "default": "daily"
    }
  }
}
```

**Example Response:**

```json
{
  "status": "success",
  "book_id": "legends-001",
  "period": { "start": "2026-02-15", "end": "2026-03-15" },
  "summary": {
    "total_sales": 342,
    "total_revenue_usd": 2847.58,
    "total_page_reads": 18420,
    "average_rating": 4.6,
    "review_count": 23,
    "best_platform": "kdp",
    "best_day": "2026-03-01"
  },
  "by_platform": {
    "kdp": {
      "ebook_sales": 210,
      "paperback_sales": 45,
      "page_reads_kenp": 18420,
      "revenue_usd": 1920.30,
      "average_rating": 4.7,
      "review_count": 18,
      "best_seller_rank": { "category": "Fantasy/Epic", "rank": 2847 }
    },
    "apple": {
      "sales": 52,
      "revenue_usd": 519.48,
      "average_rating": 4.5,
      "review_count": 5
    },
    "kobo": {
      "sales": 35,
      "revenue_usd": 307.80,
      "average_rating": 4.4,
      "review_count": 0
    }
  },
  "recent_reviews": [
    {
      "platform": "kdp",
      "rating": 5,
      "title": "Mythology that actually means something",
      "excerpt": "This isn't just another fantasy origin story...",
      "date": "2026-03-12"
    }
  ]
}
```

---

### `publish_status`

Check the publishing pipeline status for a book across all stages.

**Parameters:**

```json
{
  "type": "object",
  "properties": {
    "book_id": {
      "type": "string",
      "description": "Specific book ID, or omit for all books"
    },
    "verbose": {
      "type": "boolean",
      "default": false,
      "description": "Include detailed per-platform status"
    }
  }
}
```

**Example Response:**

```json
{
  "status": "success",
  "book_id": "legends-001",
  "pipeline": {
    "manuscript": { "status": "complete", "word_count": 78420, "last_modified": "2026-03-10" },
    "formatting": {
      "epub": "complete",
      "pdf": "complete",
      "kindle": "complete",
      "docx": "complete"
    },
    "metadata": { "status": "complete", "isbn_ebook": "978-1-234567-89-0", "isbn_paperback": "978-1-234567-90-6" },
    "cover": { "status": "finalized", "ebook": true, "paperback": true, "hardcover": false },
    "platforms": {
      "kdp": { "status": "live", "published_date": "2026-02-15", "url": "https://amazon.com/dp/..." },
      "apple": { "status": "in_review", "submitted_date": "2026-03-13" },
      "ingram_spark": { "status": "draft" },
      "kobo": { "status": "live", "published_date": "2026-02-20" }
    },
    "marketing": {
      "social_posts_drafted": 12,
      "social_posts_published": 8,
      "newsletters_sent": 3,
      "last_newsletter": "2026-03-01"
    }
  },
  "next_actions": [
    "Apple Books submission is in review -- expect approval within 48 hours",
    "IngramSpark draft needs pricing and distribution settings",
    "Consider hardcover cover preparation"
  ]
}
```

---

## Resources

Resources provide read-only access to publishing data via URI.

### `publish://books`

List all books in the publishing pipeline.

```json
{
  "uri": "publish://books",
  "mimeType": "application/json",
  "content": {
    "books": [
      {
        "id": "legends-001",
        "title": "Legends of Arcanea",
        "status": "live",
        "platforms_live": 2,
        "platforms_pending": 2,
        "word_count": 78420
      },
      {
        "id": "meditations-001",
        "title": "Meditations on the Five Elements",
        "status": "formatting",
        "platforms_live": 0,
        "platforms_pending": 0,
        "word_count": 45200
      }
    ],
    "total": 2
  }
}
```

### `publish://book/{id}`

Full status and metadata for a single book.

```json
{
  "uri": "publish://book/legends-001",
  "mimeType": "application/json",
  "content": {
    "id": "legends-001",
    "title": "Legends of Arcanea",
    "subtitle": "The First Dawn and the Founding Myths",
    "author": "FrankX",
    "series": { "name": "The Library of Arcanea", "position": 1 },
    "word_count": 78420,
    "chapter_count": 17,
    "isbns": {
      "ebook": "978-1-234567-89-0",
      "paperback": "978-1-234567-90-6"
    },
    "platforms": {
      "kdp": { "status": "live", "url": "https://amazon.com/dp/..." },
      "apple": { "status": "in_review" },
      "ingram_spark": { "status": "draft" },
      "kobo": { "status": "live", "url": "https://kobo.com/..." }
    },
    "metadata": {
      "description": "...",
      "bisac_categories": ["FIC009020", "FIC061000", "FIC019000"],
      "keywords": ["mythology fantasy", "creation myth", "elemental magic system", "cosmic fantasy", "world building", "AI fantasy", "light and darkness duality"]
    },
    "files": {
      "manuscript": "book/legends-of-arcanea/",
      "epub": "publishing/output/legends-001.epub",
      "pdf": "publishing/output/legends-001.pdf",
      "cover_ebook": "publishing/covers/legends-001-ebook.jpg",
      "cover_print": "publishing/covers/legends-001-print.pdf"
    }
  }
}
```

### `publish://platforms`

Connected publishing platforms and their status.

```json
{
  "uri": "publish://platforms",
  "mimeType": "application/json",
  "content": {
    "platforms": [
      {
        "id": "kdp",
        "name": "Amazon KDP",
        "connected": true,
        "account_email": "author@arcanea.ai",
        "supports": ["ebook", "paperback", "hardcover"],
        "royalty_rates": { "ebook_70": "2.99-9.99 USD", "ebook_35": "any price", "paperback": "60%" }
      },
      {
        "id": "apple",
        "name": "Apple Books",
        "connected": true,
        "supports": ["ebook"],
        "royalty_rates": { "ebook": "70%" }
      },
      {
        "id": "ingram_spark",
        "name": "IngramSpark",
        "connected": true,
        "supports": ["paperback", "hardcover", "ebook"],
        "distribution": "40,000+ retailers and libraries worldwide"
      },
      {
        "id": "kobo",
        "name": "Kobo Writing Life",
        "connected": true,
        "supports": ["ebook"],
        "royalty_rates": { "ebook_70": "2.99-12.99 USD", "ebook_45": "any price" }
      }
    ]
  }
}
```

### `publish://analytics/{id}`

Sales and review analytics for a specific book.

```json
{
  "uri": "publish://analytics/legends-001",
  "mimeType": "application/json",
  "content": {
    "book_id": "legends-001",
    "lifetime": {
      "total_sales": 1247,
      "total_revenue_usd": 10842.30,
      "total_page_reads": 89400,
      "average_rating": 4.6,
      "total_reviews": 67
    },
    "last_30_days": {
      "sales": 342,
      "revenue_usd": 2847.58,
      "page_reads": 18420,
      "new_reviews": 8
    },
    "trends": {
      "sales_trend": "up_12_percent",
      "rating_trend": "stable"
    }
  }
}
```

---

## Security Considerations

### API Key Management

1. **Storage**: All API keys stored in environment variables, never in configuration files or source code. The server reads from `process.env` at startup.

2. **Encryption at rest**: The `ENCRYPTION_KEY` env var enables AES-256-GCM encryption for cached platform credentials and session tokens stored in `PUBLISHING_DATA_DIR`.

3. **Rotation**: The server exposes no tool for key management. Keys are rotated externally and the server process restarted.

4. **Least privilege**: Each platform API key should be scoped to the minimum permissions required:
   - KDP: `bookshelf:read`, `bookshelf:write`, `reports:read`
   - Apple: `books:manage`, `sales:read`
   - IngramSpark: `titles:manage`, `reports:read`
   - Social tokens: `post:write` only (no DM, no follow, no profile edit)

### Data Protection

1. **Manuscript content**: Never sent to third-party services beyond the publishing platforms themselves. Format conversion happens locally via Pandoc/Calibre.

2. **Analytics caching**: Sales data cached locally in encrypted SQLite. Cache TTL configurable (default 1 hour). No analytics data sent to external analytics services.

3. **Newsletter content**: Sent only to the configured newsletter provider. Subscriber lists never downloaded or cached by the MCP server.

4. **Cover art**: Art direction briefs may reference manuscript content. The `publish_cover` tool with action=mockup sends only the brief (not the manuscript) to image generation services.

### Access Control

1. **Single-user model**: This MCP server is designed for a single author. No multi-tenant access control.

2. **Confirmation for destructive actions**: `publish_upload` with `action: "publish"` requires explicit confirmation. The server returns a confirmation token that must be passed in a follow-up call.

3. **Audit log**: All tool invocations logged to `PUBLISHING_DATA_DIR/audit.log` with timestamp, tool name, parameters (keys redacted), and result status.

### Platform-Specific Notes

| Platform | Auth Method | Token Refresh | Notes |
|----------|-------------|---------------|-------|
| KDP | OAuth 2.0 | Auto-refresh | Requires MWS developer registration |
| Apple | App Store Connect API Key | JWT (20min) | Requires .p8 key file |
| IngramSpark | API Key + Secret | No expiry | Contact IngramSpark for API access |
| Kobo | OAuth 2.0 | Auto-refresh | Writing Life API beta program |

---

## Error Handling

All tools return errors in a consistent format:

```json
{
  "status": "error",
  "error": {
    "code": "PLATFORM_AUTH_FAILED",
    "message": "KDP authentication failed. API key may be expired or revoked.",
    "platform": "kdp",
    "recoverable": true,
    "suggestion": "Check KDP_API_KEY environment variable and verify credentials at https://kdp.amazon.com"
  }
}
```

### Error Codes

| Code | Description |
|------|-------------|
| `PLATFORM_AUTH_FAILED` | API key invalid or expired |
| `PLATFORM_UNAVAILABLE` | Platform API is down or unreachable |
| `FORMAT_FAILED` | Manuscript conversion failed (malformed markdown, missing images) |
| `METADATA_INVALID` | Required metadata fields missing or invalid |
| `ISBN_UNAVAILABLE` | No ISBNs available in Bowker account |
| `COVER_SPEC_INVALID` | Cover dimensions or DPI don't meet platform requirements |
| `RATE_LIMITED` | Platform API rate limit exceeded |
| `CONTENT_POLICY` | Platform rejected content (policy violation) |
| `FILE_NOT_FOUND` | Source file or manuscript path does not exist |
| `ENCRYPTION_FAILED` | Encryption key missing or invalid |
