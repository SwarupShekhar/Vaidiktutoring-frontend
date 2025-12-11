# Reviews & Success Stories Section

This directory contains the components for the "What families are saying" section on the homepage.

## Components

- `ReviewsSection.tsx`: The main container that handles the carousel logic and auto-rotation.
- `ReviewCard.tsx`: Displays a single review with animations and stats.
- `MorphingBlob.tsx`: Background aesthetic element.

## Data

The reviews data is sourced from `src/data/reviews.json`.

### Adding a new review

1. Open `src/data/reviews.json`.
2. Add a new object to the array with the following structure:
   ```json
   {
     "id": "unique-id",
     "name": "Name",
     "role": "Role (e.g., Parent, Grade 8)",
     "rating": 5,
     "short": "Short headline",
     "long": "Full testimonial text...",
     "avatar": "/path/to/image.jpg",
     "highlightMetrics": { "metricKey": 123 }, // Optional
     "tag": "Tag text"
   }
   ```
3. Commit the changes. The carousel currently handles any number of items.

## Styles

Tailwind CSS is used for styling.
Global CSS variables (e.g., `--color-text-primary`) are used for theming.
