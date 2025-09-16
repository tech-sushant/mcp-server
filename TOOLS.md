# BrowserStack MCP Tools

As of now we support 20 tools.

---

## 🧾 Test Management

1. `createProjectOrFolder` — Create a Test Management project and/or folders to organize test cases. Returns with Folder ID, Project ID and Test Management Link to access the TM Project Dashboard.
  **Prompt example**

  ```text
  Create a new Test Management project named 'Shopping App' with two folders - Login and Checkout
  ```


2. `createTestCase` — Add a manual test case under a specific project/folder (uses project identifier like PR-xxxxx and a folder ID).
  **Prompt example**

  ```text
  Add a test case named 'Invalid Login Scenario' to the Login folder in the 'Shopping App' project with PR-53617, Folder ID: 117869
  ```

3. `listTestCases` — List test cases for a project (supports filters like priority, status, tags).
  **Prompt example**

  ```text
  List all high-priority test cases in the 'Shopping App' project with project_identifier: PR-59457
  ```

4. `createTestRun` — Create a test run (suite) for selected test cases in a project.
  **Prompt example**

  ```text
  Create a test run for the Login folder in the 'Shopping App' project and name it 'Release v1.0 Login Flow'
  ```

5. `listTestRuns` — List test runs for a project (filter by dates, assignee, state).
  **Prompt example**

  ```text
  List all test runs from the 'Shopping App' project that were executed last week and are currently marked in-progress
  ```

6. `updateTestRun` — Partially update a test run (status, tags, notes, associated test cases).
  **Prompt example**

  ```text
  Update test run ID 1043 in the 'Shopping App' project and mark it as complete with the note 'Regression cycle done'
  ```

7. `addTestResult` — Add a manual execution result (passed/failed/blocked/skipped) for a test case within a run.
  **Prompt example**

  ```text
  Mark the test case 'Invalid Login Scenario' as passed in test run ID 1043 of the 'Shopping App' project
  ```

8. `createTestCasesFromFile` — Bulk-create test cases from an uploaded file (e.g., PDF).
  **Prompt example**

  ```text
  Upload test cases from '/Users/xyz/testcases.pdf' to the 'Shopping App' project in Test Management
  ```

---

## ⚙️ BrowserStack SDK Setup / Automate Test

9. `setupBrowserStackAutomateTests` — Integrate BrowserStack SDK and run web tests on BrowserStack (optionally enable Percy).
  **Prompt example**

  ```text
  Run my Selenium-JUnit5 tests written in Java on Chrome and Firefox. Enable Percy for visual testing.
  ```

10. `fetchAutomationScreenshots` — Fetch screenshots captured during a given Automate/App Automate session.
  **Prompt example**

  ```text
  Get screenshots from Automate session ID abc123xyz for my desktop test run
  ```

---

## 🔍 Observability

11. `getFailureLogs` — Retrieve error logs for Automate/App Automate sessions (optionally by Build ID for App Automate).
  **Prompt example**

  ```text
  Get the error logs from the session ID: 21a864032a7459f1e7634222249b316759d6827f, Build ID: dt7ung4wmjittzff8kksrjadjax9gzvbscoyf9qn of App Automate test session
  ```

---

## 📱 App Live

12. `runAppLiveSession` — Start a manual app testing session on a real device in the cloud.
  **Prompt example**

  ```text
  Open my app on iPhone 15 Pro Max with iOS 17. App path is /Users/xyz/app.ipa
  ```

---

## 💻 Live

13. `runBrowserLiveSession` — Start a Live session for website testing on desktop or mobile browsers.
  **Prompt example**

  ```text
  Open www.google.com on the latest version of Microsoft Edge on Windows 11
  ```

---

## 📲 App Automate

14. `takeAppScreenshot` — Launch the app on a specified device and captures a quick verification screenshot. This tool is just to verify whether your app has been launched.
  **Prompt example**

  ```text
  Take a screenshot of my app on Google Pixel 6 with Android 14 while testing on App Automate. App file path: /Users/xyz/app-debug.apk
  ```

15. `runAppTestsOnBrowserStack` — Run automated mobile tests (Espresso/XCUITest, etc.) on real devices.
  **Prompt example**

  ```text
  Run Espresso tests from /tests/checkout.zip on Galaxy S21 and Pixel 6 with Android 14. App path is /apps/beta-release.apk under project 'Checkout Flow'
  ```

---

## ♿ Accessibility

16. `accessibilityExpert` — Ask A11y Expert (WCAG 2.0/2.1/2.2, mobile/web usability, best practices).
  **Prompt example**

  ```text
  What WCAG guidelines apply to form field error messages on mobile web?
  ```

17. `startAccessibilityScan` — Start a web accessibility scan and return the result link.
  **Prompt example**

  ```text
  Run accessibility scan for "www.example.com"
  ```

---

## 🤖 BrowserStack AI Agents

18. `fetchSelfHealedSelectors` — Retrieve AI self-healed selectors to fix flaky tests due to DOM changes.
  **Prompt example**

  ```text
  Fetch and fix flaky test selectors in Automate session ID session_9482 using MCP
  ```

19. `createLCASteps` — Generate Low Code Automation steps from a manual test case in Test Management.
  **Prompt example**

  ```text
  Convert the manual test case 'Add to Cart' in the 'Shopping App' project into LCA steps
  ```

20. `uploadProductRequirementFile` — Upload a PRD/screenshot/PDF and get a file mapping ID (used with `createTestCasesFromFile`).
  **Prompt example**

  ```text
  Upload PRD from /Users/xyz/Desktop/login-flow.pdf and use BrowserStack AI to generate test cases
  ```


