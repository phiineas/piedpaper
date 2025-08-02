export interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  content: string;
  tags: string[];
  icon: string;
}

export const templates: Template[] = [
  {
    id: 'github-readme',
    name: 'GitHub README',
    description: 'A comprehensive GitHub repository README template',
    category: 'Documentation',
    tags: ['github', 'readme', 'documentation', 'open-source'],
    icon: '📚',
    content: `# Project Title

A brief description of what this project does and who it's for

## Demo

Add a link to the live demo here

## Screenshots

![App Screenshot](https://via.placeholder.com/468x300?text=App+Screenshot+Here)

## Features

- Light/dark mode toggle
- Live previews
- Fullscreen mode
- Cross platform

## Installation

Install my-project with npm

\`\`\`bash
  npm install my-project
  cd my-project
\`\`\`

## Usage/Examples

\`\`\`javascript
import Component from 'my-project'

function App() {
  return <Component />
}
\`\`\`

## API Reference

#### Get all items

\`\`\`http
  GET /api/items
\`\`\`

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| \`api_key\` | \`string\` | **Required**. Your API key |

#### Get item

\`\`\`http
  GET /api/items/\${id}
\`\`\`

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| \`id\`      | \`string\` | **Required**. Id of item to fetch |

## Contributing

Contributions are always welcome!

See \`contributing.md\` for ways to get started.

Please adhere to this project's \`code of conduct\`.

## License

[MIT](https://choosealicense.com/licenses/mit/)

## Authors

- [@octokatherine](https://www.github.com/octokatherine)

## Badges

Add badges from somewhere like: [shields.io](https://shields.io/)

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![GPLv3 License](https://img.shields.io/badge/License-GPL%20v3-yellow.svg)](https://opensource.org/licenses/)
[![AGPL License](https://img.shields.io/badge/license-AGPL-blue.svg)](http://www.gnu.org/licenses/agpl-3.0)

## Support

For support, email fake@fake.com or join our Slack channel.`
  },
  {
    id: 'project-proposal',
    name: 'Project Proposal',
    description: 'A structured template for project proposals',
    category: 'Business',
    tags: ['proposal', 'business', 'project', 'planning'],
    icon: '📋',
    content: `# Project Proposal: [Project Name]

## Executive Summary

A brief overview of the project, its objectives, and expected outcomes.

## Problem Statement

### Current Situation
Describe the current situation and the problems that need to be addressed.

### Impact
Explain how these problems affect the organization or target audience.

## Proposed Solution

### Overview
Provide a high-level description of the proposed solution.

### Key Features
- Feature 1: Description
- Feature 2: Description
- Feature 3: Description

### Benefits
- Benefit 1
- Benefit 2
- Benefit 3

## Project Scope

### In Scope
- Task 1
- Task 2
- Task 3

### Out of Scope
- Task A
- Task B
- Task C

## Timeline

| Phase | Duration | Start Date | End Date | Deliverables |
|-------|----------|------------|----------|-------------|
| Phase 1 | 2 weeks | TBD | TBD | Deliverable 1 |
| Phase 2 | 3 weeks | TBD | TBD | Deliverable 2 |
| Phase 3 | 1 week | TBD | TBD | Deliverable 3 |

## Resources Required

### Team Members
- Role 1: [Name/TBD]
- Role 2: [Name/TBD]
- Role 3: [Name/TBD]

### Technology Stack
- Technology 1
- Technology 2
- Technology 3

### Budget
| Item | Cost |
|------|------|
| Development | $X,XXX |
| Tools/Software | $XXX |
| **Total** | **$X,XXX** |

## Risk Assessment

| Risk | Probability | Impact | Mitigation Strategy |
|------|-------------|---------|-------------------|
| Risk 1 | Medium | High | Mitigation 1 |
| Risk 2 | Low | Medium | Mitigation 2 |

## Success Criteria

- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3

## Next Steps

1. Step 1
2. Step 2
3. Step 3

## Approval

**Project Sponsor:** _____________________  **Date:** ___________

**Project Manager:** _____________________  **Date:** ___________`
  },
  {
    id: 'meeting-notes',
    name: 'Meeting Notes',
    description: 'Template for structured meeting documentation',
    category: 'Business',
    tags: ['meeting', 'notes', 'documentation', 'business'],
    icon: '📝',
    content: `# Meeting Notes

**Date:** [Date]  
**Time:** [Start Time] - [End Time]  
**Location:** [Location/Virtual]  
**Meeting Type:** [Weekly Standup/Project Review/etc.]

## Attendees

**Present:**
- [Name] - [Role]
- [Name] - [Role]
- [Name] - [Role]

**Absent:**
- [Name] - [Role] - [Reason]

## Agenda

1. [Agenda Item 1]
2. [Agenda Item 2]
3. [Agenda Item 3]

## Discussion Points

### [Topic 1]
- Key points discussed
- Decisions made
- Concerns raised

### [Topic 2]
- Key points discussed
- Decisions made
- Concerns raised

## Action Items

| Action Item | Assigned To | Due Date | Status |
|-------------|-------------|----------|---------|
| [Action 1] | [Name] | [Date] | [ ] Pending |
| [Action 2] | [Name] | [Date] | [ ] Pending |
| [Action 3] | [Name] | [Date] | [ ] Pending |

## Decisions Made

1. **Decision 1:** [Description]
   - **Rationale:** [Why this decision was made]
   - **Impact:** [Who/what this affects]

2. **Decision 2:** [Description]
   - **Rationale:** [Why this decision was made]
   - **Impact:** [Who/what this affects]

## Key Takeaways

- Takeaway 1
- Takeaway 2
- Takeaway 3

## Next Meeting

**Date:** [Next Meeting Date]  
**Agenda Preview:**
- Follow up on action items
- [Other agenda items]

## Additional Notes

[Any additional notes or observations]

---
*Meeting notes taken by: [Name]*  
*Reviewed by: [Name]*`
  },
  {
    id: 'api-documentation',
    name: 'API Documentation',
    description: 'Comprehensive API documentation template',
    category: 'Technical',
    tags: ['api', 'documentation', 'technical', 'development'],
    icon: '🔌',
    content: `# API Documentation

## Overview

Brief description of the API, its purpose, and what it provides.

## Base URL

\`\`\`
https://api.example.com/v1
\`\`\`

## Authentication

### API Key Authentication

Include your API key in the header of all requests:

\`\`\`http
Authorization: Bearer your_api_key_here
\`\`\`

### Getting an API Key

1. Sign up for an account
2. Navigate to your dashboard
3. Generate a new API key

## Rate Limiting

- **Rate Limit:** 100 requests per minute
- **Rate Limit Headers:**
  - \`X-RateLimit-Limit\`: Request limit per minute
  - \`X-RateLimit-Remaining\`: Requests remaining in current window
  - \`X-RateLimit-Reset\`: Time when rate limit resets

## Endpoints

### Users

#### Get All Users

\`\`\`http
GET /users
\`\`\`

**Query Parameters:**

| Parameter | Type | Description | Default |
|-----------|------|-------------|---------|
| \`page\` | integer | Page number | 1 |
| \`limit\` | integer | Items per page | 20 |
| \`sort\` | string | Sort field | created_at |

**Response:**

\`\`\`json
{
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "created_at": "2023-01-01T00:00:00Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 100
  }
}
\`\`\`

#### Get User by ID

\`\`\`http
GET /users/{id}
\`\`\`

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| \`id\` | integer | User ID |

**Response:**

\`\`\`json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "created_at": "2023-01-01T00:00:00Z"
}
\`\`\`

#### Create User

\`\`\`http
POST /users
\`\`\`

**Request Body:**

\`\`\`json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secure_password"
}
\`\`\`

**Response:**

\`\`\`json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "created_at": "2023-01-01T00:00:00Z"
}
\`\`\`

## Error Handling

### Error Response Format

\`\`\`json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "The request contains invalid parameters",
    "details": [
      {
        "field": "email",
        "message": "Email is required"
      }
    ]
  }
}
\`\`\`

### HTTP Status Codes

| Status Code | Description |
|-------------|-------------|
| 200 | OK - Request successful |
| 201 | Created - Resource created |
| 400 | Bad Request - Invalid request |
| 401 | Unauthorized - Invalid credentials |
| 403 | Forbidden - Access denied |
| 404 | Not Found - Resource not found |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error - Server error |

## SDKs and Libraries

### JavaScript/Node.js

\`\`\`bash
npm install @example/api-client
\`\`\`

\`\`\`javascript
import { ApiClient } from '@example/api-client';

const client = new ApiClient('your_api_key');
const users = await client.users.getAll();
\`\`\`

### Python

\`\`\`bash
pip install example-api-client
\`\`\`

\`\`\`python
from example_api import ApiClient

client = ApiClient('your_api_key')
users = client.users.get_all()
\`\`\`

## Changelog

### v1.1.0 (2023-06-01)
- Added user creation endpoint
- Improved error messages

### v1.0.0 (2023-01-01)
- Initial API release`
  },
  {
    id: 'personal-blog-post',
    name: 'Blog Post',
    description: 'Template for writing engaging blog posts',
    category: 'Content',
    tags: ['blog', 'writing', 'content', 'personal'],
    icon: '✍️',
    content: `# [Your Blog Post Title Here]

*Published on [Date] by [Your Name]*

---

## Introduction

Start with a compelling hook that draws readers in. This could be:
- A thought-provoking question
- A surprising statistic
- A personal anecdote
- A bold statement

Briefly introduce what the post will cover and why it matters to your readers.

## The Problem/Challenge

Describe the main problem or challenge that your post addresses. Make it relatable to your audience by:
- Using specific examples
- Sharing personal experiences
- Citing relevant statistics or research

## Your Solution/Insights

### Key Point 1

Elaborate on your first main point. Use:
- **Subheadings** to break up content
- *Emphasis* for important terms
- Lists for clarity

### Key Point 2

Continue with your second main point. Consider including:
- Real-world examples
- Case studies
- Screenshots or images

### Key Point 3

Present your third key insight. You might want to:
- Share actionable tips
- Provide step-by-step instructions
- Include code examples if relevant

## Implementation/Action Steps

Give your readers concrete steps they can take:

1. **Step 1:** [Specific action]
   - Why this step matters
   - How to execute it effectively

2. **Step 2:** [Specific action]
   - Tips for success
   - Common pitfalls to avoid

3. **Step 3:** [Specific action]
   - Expected outcomes
   - How to measure success

## Results/Benefits

Explain what readers can expect when they implement your advice:
- Short-term benefits
- Long-term advantages
- Potential challenges and how to overcome them

## Personal Experience

Share a relevant personal story or experience that reinforces your main points. This helps:
- Build trust with readers
- Make abstract concepts concrete
- Add authenticity to your content

## Conclusion

Summarize your key points and:
- Reinforce the main takeaway
- Encourage readers to take action
- Pose a question for engagement

## Call to Action

End with a clear call to action:
- Ask readers to share their experiences in comments
- Encourage them to try your suggestions
- Invite them to connect with you on social media

---

### About the Author

[Brief bio about yourself and your expertise in this topic]

### Related Posts

- [Link to related post 1]
- [Link to related post 2]
- [Link to related post 3]

### Tags

\`#blogging\` \`#content\` \`#writing\` \`#[relevant-tags]\``
  },
  {
    id: 'technical-tutorial',
    name: 'Technical Tutorial',
    description: 'Step-by-step tutorial template for technical content',
    category: 'Technical',
    tags: ['tutorial', 'technical', 'documentation', 'guide'],
    icon: '🎓',
    content: `# How to [Tutorial Title]

## Overview

Brief description of what this tutorial covers and what the reader will learn.

**What you'll learn:**
- Learning objective 1
- Learning objective 2
- Learning objective 3

**Estimated time:** [X] minutes

## Prerequisites

Before starting this tutorial, you should have:
- [ ] Prerequisite 1
- [ ] Prerequisite 2
- [ ] Prerequisite 3

**Required tools/software:**
- Tool 1 (version X.X or higher)
- Tool 2
- Tool 3

## Getting Started

### Step 1: Initial Setup

Brief description of what this step accomplishes.

\`\`\`bash
# Example command
command --option value
\`\`\`

**Expected output:**
\`\`\`
Expected output here
\`\`\`

### Step 2: Configuration

Explain what you're configuring and why.

\`\`\`javascript
// Example code
const config = {
  option1: 'value1',
  option2: 'value2'
};
\`\`\`

> **💡 Tip:** Include helpful tips and best practices.

### Step 3: Implementation

Main implementation step with detailed explanation.

\`\`\`python
# Example Python code
def example_function(param):
    """
    Function description
    """
    return result
\`\`\`

> **⚠️ Warning:** Highlight important warnings or common mistakes.

## Advanced Configuration (Optional)

For users who want to go further:

### Custom Settings

\`\`\`json
{
  "advanced_option": true,
  "custom_setting": "value"
}
\`\`\`

### Performance Optimization

Tips for optimizing performance:
1. Optimization tip 1
2. Optimization tip 2
3. Optimization tip 3

## Troubleshooting

### Common Issues

#### Issue 1: [Error Description]

**Symptoms:**
- Symptom 1
- Symptom 2

**Solution:**
\`\`\`bash
solution command here
\`\`\`

#### Issue 2: [Error Description]

**Symptoms:**
- Symptom 1
- Symptom 2

**Solution:**
Step-by-step solution...

## Testing Your Setup

Verify everything is working correctly:

\`\`\`bash
# Test command
test-command --verify
\`\`\`

**Expected result:**
\`\`\`
✅ All tests passed
\`\`\`

## Next Steps

Now that you've completed this tutorial:
- [ ] Try [related task]
- [ ] Explore [advanced feature]
- [ ] Read [related documentation]

## Additional Resources

- [Official Documentation](https://example.com)
- [Community Forum](https://example.com)
- [Related Tutorial](https://example.com)

## Conclusion

Summary of what was accomplished and encourage experimentation.

---

**Did this tutorial help you?** Leave a comment below or share it with others!

**Tags:** \`#tutorial\` \`#technical\` \`#programming\` \`#guide\``
  },
  {
    id: 'product-requirements',
    name: 'Product Requirements Document',
    description: 'Comprehensive PRD template for product development',
    category: 'Product',
    tags: ['prd', 'product', 'requirements', 'development'],
    icon: '📋',
    content: `# Product Requirements Document (PRD)

**Product:** [Product Name]  
**Version:** [Version Number]  
**Date:** [Date]  
**Author:** [Your Name]  
**Stakeholders:** [List of stakeholders]

---

## Executive Summary

### Problem Statement
Brief description of the problem this product aims to solve.

### Solution Overview
High-level description of the proposed solution.

### Business Impact
Expected business outcomes and success metrics.

## Product Overview

### Vision
Long-term vision for this product.

### Mission
What this product aims to achieve in the short to medium term.

### Success Metrics
- Metric 1: [Description and target]
- Metric 2: [Description and target]
- Metric 3: [Description and target]

## User Research

### Target Users

#### Primary User Persona
- **Name:** [Persona Name]
- **Demographics:** [Age, role, etc.]
- **Goals:** [What they want to achieve]
- **Pain Points:** [Current challenges]
- **Behaviors:** [How they currently solve problems]

#### Secondary User Persona
- **Name:** [Persona Name]
- **Demographics:** [Age, role, etc.]
- **Goals:** [What they want to achieve]
- **Pain Points:** [Current challenges]
- **Behaviors:** [How they currently solve problems]

### User Journey
1. **Discovery:** How users become aware of their need
2. **Evaluation:** How they assess potential solutions
3. **Onboarding:** First experience with the product
4. **Usage:** Regular interaction patterns
5. **Advocacy:** Sharing and recommending

## Product Requirements

### Functional Requirements

#### Feature 1: [Feature Name]
- **Description:** What this feature does
- **User Story:** As a [user type], I want [functionality] so that [benefit]
- **Acceptance Criteria:**
  - [ ] Criterion 1
  - [ ] Criterion 2
  - [ ] Criterion 3
- **Priority:** High/Medium/Low

#### Feature 2: [Feature Name]
- **Description:** What this feature does
- **User Story:** As a [user type], I want [functionality] so that [benefit]
- **Acceptance Criteria:**
  - [ ] Criterion 1
  - [ ] Criterion 2
  - [ ] Criterion 3
- **Priority:** High/Medium/Low

#### Feature 3: [Feature Name]
- **Description:** What this feature does
- **User Story:** As a [user type], I want [functionality] so that [benefit]
- **Acceptance Criteria:**
  - [ ] Criterion 1
  - [ ] Criterion 2
  - [ ] Criterion 3
- **Priority:** High/Medium/Low

### Non-Functional Requirements

#### Performance
- Page load time: < 2 seconds
- API response time: < 500ms
- Uptime: 99.9%

#### Security
- Data encryption at rest and in transit
- Multi-factor authentication
- Regular security audits

#### Usability
- Accessible to users with disabilities (WCAG 2.1 AA)
- Mobile-responsive design
- Intuitive user interface

#### Scalability
- Support for [X] concurrent users
- Horizontal scaling capability
- Database optimization for large datasets

## Technical Specifications

### Architecture Overview
High-level description of the technical architecture.

### Technology Stack
- **Frontend:** [Technology]
- **Backend:** [Technology]
- **Database:** [Technology]
- **Infrastructure:** [Cloud provider/services]

### Integration Requirements
- **External APIs:** [List of required integrations]
- **Data Sources:** [Where data comes from]
- **Third-party Services:** [Required services]

## Implementation Plan

### Phase 1: MVP (Weeks 1-4)
- [ ] Core feature 1
- [ ] Core feature 2
- [ ] Basic user interface

### Phase 2: Enhancement (Weeks 5-8)
- [ ] Advanced feature 1
- [ ] Performance optimizations
- [ ] User feedback integration

### Phase 3: Scale (Weeks 9-12)
- [ ] Additional features
- [ ] Mobile optimization
- [ ] Analytics implementation

## Risk Assessment

| Risk | Probability | Impact | Mitigation Strategy |
|------|-------------|---------|-------------------|
| Technical complexity | Medium | High | Prototype early, get technical review |
| User adoption | Low | High | Conduct user testing, gather feedback |
| Resource constraints | Medium | Medium | Plan buffer time, prioritize features |

## Success Criteria

### Launch Criteria
- [ ] All MVP features implemented and tested
- [ ] Performance benchmarks met
- [ ] Security review completed
- [ ] User acceptance testing passed

### Post-Launch Success Metrics
- **Week 1:** [Target metrics]
- **Month 1:** [Target metrics]
- **Month 3:** [Target metrics]

## Open Questions

1. Question 1?
2. Question 2?
3. Question 3?

## Appendix

### Research Data
Links to user research, surveys, and data analysis.

### Mockups and Wireframes
Links to design assets and prototypes.

### Technical Documentation
Links to technical specifications and API documentation.

---

**Document History:**

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | [Date] | Initial version | [Name] |
| 1.1 | [Date] | Updated requirements | [Name] |`
  }
];

export const categories = [
  'All',
  'Documentation',
  'Business', 
  'Technical',
  'Content',
  'Product'
];
