# AFFILIFY Create-Website Page Updates

This document outlines the modifications made to the create-website pages for the Basic, Pro, and Enterprise plans in the AFFILIFY dashboard. The goal of these changes was to streamline the website creation process by requiring only an affiliate link, similar to the generic create-website page.

## Changes Implemented

The following files have been updated to reflect the new simplified website creation flow:

- `src/app/dashboard/create-website/basic/page.tsx`
- `src/app/dashboard/create-website/pro/page.tsx`
- `src/app/dashboard/create-website/enterprise/page.tsx`

### Key Modifications

1.  **Simplified Input Form**: The complex forms for website name, niche, description, and template selection have been replaced with a single input field for the affiliate link. This simplifies the user experience and makes website creation faster.

2.  **Consistent User Experience**: All three plan-specific create-website pages now follow the same user flow as the generic create-website page, providing a consistent experience across the application.

3.  **Plan-Specific Theming and Features**: While the core functionality is now consistent, each page retains its unique plan-specific theming, feature highlights, and upgrade prompts:
    *   **Basic Plan**: The page is styled with the Basic plan theme and includes prompts to upgrade to the Pro or Enterprise plans.
    *   **Pro Plan**: The page features Pro plan branding and encourages users to upgrade to the Enterprise plan for unlimited features.
    *   **Enterprise Plan**: The page showcases the premium Enterprise branding and highlights the unlimited nature of the plan.

4.  **Backend Integration**: The `handleSubmit` function in each page has been updated to call the `/api/ai/generate-from-link` endpoint, passing the affiliate link and the corresponding plan (`basic`, `pro`, or `enterprise`) to the backend. This ensures that the backend can apply the correct features and limitations based on the user's subscription.

## How to Test

The development server is running. You can test the updated create-website pages by navigating to the following URLs:

-   **Basic Plan**: `http://localhost:3000/dashboard/create-website/basic`
-   **Pro Plan**: `http://localhost:3000/dashboard/create-website/pro`
-   **Enterprise Plan**: `http://localhost:3000/dashboard/create-website/enterprise`

Enter a valid affiliate link into the input field and click the "Generate Website" button to test the functionality. You should see a success message and the details of the generated website upon successful creation.

