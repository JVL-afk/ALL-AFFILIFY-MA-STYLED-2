# Architectural Design for Flozy CRM Integration into AFFILIFY

## 1. Goal and Philosophy

The goal is to seamlessly integrate the core functionalities of Flozy CRM—specifically **Client Portals, Proposal/Contract Creation, Lead Management, and Task Management**—into the AFFILIFY platform. The integration will transform these features to serve the needs of **Affiliate Marketers** managing their clients, partners, and campaigns, rather than a general agency CRM.

**Key Transformation:**
*   **Leads** become **Affiliate Partners** or **High-Value Campaign Prospects**.
*   **Clients** become **Affiliate Program Managers** or **Website Buyers**.
*   **Proposals/Contracts** become **Affiliate Partnership Agreements** or **Website Development Quotes**.
*   **Tasks** become **Campaign Milestones** or **Website Development Sprints**.

The implementation will be 100% real, utilizing the existing Next.js/Node.js/MongoDB stack, and adhering to the AFFILIFY styling and "Rolex-quality" engineering standard.

## 2. New File Structure and Routing

The new features will be grouped under a new top-level dashboard route: `/dashboard/client-management`.

| Path | Type | Purpose |
| :--- | :--- | :--- |
| `/src/app/dashboard/client-management/page.tsx` | Page | Main landing page for the integrated CRM features. |
| `/src/app/dashboard/client-management/leads/page.tsx` | Page | Kanban-style Lead/Partner Management Board. |
| `/src/app/dashboard/client-management/tasks/page.tsx` | Page | Task/Campaign Milestone Management. |
| `/src/app/dashboard/client-management/proposals/page.tsx` | Page | Proposal and Contract Creation/Management. |
| `/src/app/portal/[clientId]/page.tsx` | Page | Public-facing Custom Client Portal. |
| `/src/app/api/crm/leads/route.ts` | API Route | CRUD operations for Leads/Partners. |
| `/src/app/api/crm/tasks/route.ts` | API Route | CRUD operations for Tasks/Milestones. |
| `/src/app/api/crm/proposals/route.ts` | API Route | CRUD operations for Proposals/Contracts. |
| `/src/app/api/crm/clients/route.ts` | API Route | CRUD operations for Clients/Portal Access. |
| `/src/lib/models/Client.ts` | Model | MongoDB Schema for Client/Portal data. |
| `/src/lib/models/Lead.ts` | Model | MongoDB Schema for Lead/Partner data. |
| `/src/lib/models/Proposal.ts` | Model | MongoDB Schema for Proposal/Contract data. |
| `/src/lib/models/Task.ts` | Model | MongoDB Schema for Task/Milestone data. |
| `/src/lib/crm-service.ts` | Service | Core business logic for CRM operations. |
| `/src/components/crm/` | Components | Reusable UI components for the new features (e.g., `LeadCard.tsx`, `ProposalEditor.tsx`). |

## 3. Data Models (MongoDB Schemas)

New Mongoose models will be created in `/src/lib/models/` to handle the data persistence for the new features.

### Lead.ts (Affiliate Partner/Campaign Prospect)
*   `name: string`
*   `email: string`
*   `status: 'New' | 'Contacted' | 'Proposal Sent' | 'Won' | 'Lost'`
*   `source: string` (e.g., 'LinkedIn', 'Affiliate Network', 'AFFILIFY Website')
*   `campaigns: [string]` (IDs of related AFFILIFY campaigns/websites)
*   `notes: string`
*   `userId: string` (Owner)

### Client.ts (Affiliate Program Manager/Website Buyer)
*   `name: string`
*   `email: string`
*   `portalId: string` (Unique ID for public portal access)
*   `associatedLeads: [string]` (IDs of Leads/Partners managed by this client)
*   `portalAccess: boolean`
*   `userId: string` (Owner)

### Proposal.ts (Affiliate Partnership Agreement/Quote)
*   `title: string`
*   `clientId: string`
*   `status: 'Draft' | 'Sent' | 'Viewed' | 'Accepted' | 'Rejected'`
*   `content: string` (Markdown or rich text content of the proposal)
*   `price: number`
*   `signature: { client: string, date: Date }`
*   `userId: string` (Owner)

### Task.ts (Campaign Milestone/Website Sprint)
*   `title: string`
*   `description: string`
*   `status: 'To Do' | 'In Progress' | 'Review' | 'Complete'`
*   `dueDate: Date`
*   `assignedTo: string` (User ID or Client ID)
*   `relatedLead: string` (ID of related Lead/Partner)
*   `userId: string` (Owner)

## 4. Feature Adaptation for Affiliate Marketing

| Flozy Feature | AFFILIFY Adaptation | Affiliate Marketing Benefit |
| :--- | :--- | :--- |
| **Lead Management** | **Affiliate Partner/Campaign Prospect Board** | Track potential high-value affiliates or new campaign ideas through a visual pipeline. |
| **Task Management** | **Campaign Milestone Tracker** | Manage the development sprints for new affiliate websites, content creation, and A/B testing schedules. |
| **Proposal/Contract** | **Affiliate Partnership Agreement Generator** | Quickly generate professional, legally sound agreements for new affiliate deals or website sales. |
| **Custom Client Portal** | **Affiliate Performance Portal** | A secure, branded space for clients/partners to view real-time website analytics, campaign progress, and shared tasks. |

## 5. Implementation Strategy (Phased)

1.  **Phase 1 (Current):** Design and update navigation.
2.  **Phase 2 (Lead & Task Management):** Implement all models, service logic, API routes, and the Kanban UI for Leads and Tasks.
3.  **Phase 3 (Client Portal):** Implement the Client model, API for portal data, and the public-facing portal page (`/src/app/portal/[clientId]/page.tsx`).
4.  **Phase 4 (Proposals & Contracts):** Implement the Proposal model, API, and a rich-text editor component for creating agreements.
5.  **Phase 5 (Finalization):** Full-stack testing, styling consistency check, and final build verification.
