# KeyDeck Pro ⌨️

A premium, modern Keyboard Tester and Speed Test application built with React, Vite, and TailwindCSS.

## Features

*   **Keyboard Tester**: Visualize your key presses with a neat UI. Supports multiple layouts (60%, 65%, 75%, TKL, Full Size, Alice, etc.).
*   **Speed Test**: A "MonkeyType" inspired typing test with:
    *   **Infinite Fluent Paragraphs**: Read naturally generated English text that never runs out.
    *   **Real-time Stats**: WPM, Accuracy, and character breakdown.
    *   **Premium Visuals**: Smooth caret, live error highlighting, and "KeyDeck" aesthetics.
*   **Themes**: Dark/Light mode and a special **RGB Mode** for gamers.
*   **Sound Packs**: Choose between Mechanical, Opto-Mechanical, or Thocky sound profiles.

## Deployment

### Vercel / Netlify

This project is optimized for deployment on Vercel or Netlify.

1.  Push this repository to your GitHub.
2.  Import the project into Vercel/Netlify.
3.  The build settings should be automatically detected:
    *   **Framework Preset**: Vite
    *   **Build Command**: `npm run build`
    *   **Output Directory**: `dist`

### Local Development

1.  Install dependencies:
    ```bash
    npm install
    ```
2.  Run the development server:
    ```bash
    npm run dev
    ```
3.  Build for production:
    ```bash
    npm run build
    ```

## Tech Stack

*   React 18
*   Vite
*   TailwindCSS
*   Lucide Icons

## License

MIT
