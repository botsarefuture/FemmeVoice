# iOS Readiness Plan

FemmeVoice will remain web-first today, with a future iOS app built from the same React application through [Capacitor](https://capacitorjs.com/docs). Capacitor can be added to an existing modern web project and provides a native iOS container plus a path to native plugins when browser APIs are not enough.

## Decisions already made

- **One product name and one app version.** The repository, package name, visible app version, and future App Store bundle all use FemmeVoice. Keep semantic versions aligned.
- **Server-owned data and documented ownership.** Accounts, progress, encrypted recording metadata, and API routes remain on the FemmeVoice server. The iOS app must use the same data model rather than a parallel store.
- **Local-first sensitive audio.** Pitch analysis and encryption stay on-device. A native wrapper must not change the recording-consent model or upload raw audio without the existing explicit vault choice.
- **Stable web boundaries.** Client networking remains in `src/api.js`; pitch analysis remains in `src/audio.js`; encrypted recording work remains in `src/recordings.js`. New product logic should not call browser or Flask APIs from unrelated UI components.

## Build next, before adding iOS

1. Publish a versioned API contract for `/api/*`, including request/response examples and error codes.
2. Add mobile authentication with short-lived access tokens plus refresh-token rotation. Browser cookie sessions and CSRF should remain for the website; a native app should not rely on a WebView cookie as its only credential model.
3. Extract the practice session state and progression rules from `App.jsx` into platform-neutral modules with tests. The UI should consume those rules, not own them.
4. Define a recording-provider interface. Start with the current browser `MediaRecorder`; later add a Capacitor/Swift provider for iOS microphone permissions, interruptions, and reliable background behaviour.
5. Add a server endpoint for device notification preferences. Keep email reminders as opt-in and make push notifications a separate consent choice.
6. Test the installed web build on a physical iPhone before committing to native plugins, especially microphone permission, `MediaRecorder`, Web Crypto, encrypted playback, viewport layout, and interruption handling.

## When implementation begins

Use Capacitor rather than a rewrite. Add `@capacitor/core`, `@capacitor/cli`, and `@capacitor/ios`; configure the stable app identifier before any TestFlight build; then create the iOS project with `npx cap add ios`. Keep iOS-specific code in a dedicated plugin layer, and do not put Swift assumptions into the shared React UI.

## App Store and safety checklist

- Create a precise privacy nutrition label based on the published FemmeVoice privacy policy.
- Explain microphone use before iOS presents its system permission prompt.
- Keep recordings off by default and make deletion/export reachable in-app.
- Add a support URL, privacy-policy URL, age rating, and a clinical-safety disclaimer that matches the web product.
- Treat App Store screenshots, accessibility, offline/error states, and real-device microphone testing as release blockers.
