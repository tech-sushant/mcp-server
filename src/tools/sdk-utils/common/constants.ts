export const IMPORTANT_SETUP_WARNING = 
"IMPORTANT: DO NOT SKIP ANY STEP. All the setup steps described below MUST be executed regardless of any existing configuration or setup. This ensures proper BrowserStack SDK setup."
  
export const SETUP_PERCY_DESCRIPTION =
  "Set up Percy visual testing for your project. This supports both Percy Web Standalone and Percy Automate.";

export const RUN_ON_BROWSERSTACK_DESCRIPTION =
  "Set up and run automated web-based tests on BrowserStack using the BrowserStack SDK. Use this tool for functional or integration test setup on BrowserStack only. For any visual testing or Percy integration, use the dedicated Percy setup tool. Example prompts: run this test on browserstack; set up this project for browserstack.";

export const SIMULATE_PERCY_CHANGE_DESCRIPTION =
  "Simulate a Percy visual change by guiding the user to inject a visible UI change (such as a large popup) into the app, re-run Percy, and confirm that the visual difference is detected. This tool analyzes the project, provides step-by-step instructions for the simulation, and leverages existing Percy setup logic. No direct code injection is performed; this is an instructional tool for LLM-driven workflows.";

export const PERCY_REPLACE_REGEX =
/MANDATORY: Aggressive, Exhaustive Percy Snapshot Integration[\s\S]*?Iteratively update every relevant test file in the directory and all subdirectories, adding Percy integration to each, one file at a time, until all are complete\./;

export const PERCY_SNAPSHOT_INSTRUCTION = `
MANDATORY: Aggressive, Exhaustive Percy Snapshot Integration

You MUST follow these steps with NO EXCEPTIONS:

1. Recursively search the ENTIRE target directory and ALL subdirectories for EVERY file relevant to the language/framework.
2. For EACH relevant file, analyze the code to find EVERY location where a Percy snapshot (or equivalent) should be called (e.g., after each navigation, UI change, or significant state in tests). Insert snapshot calls at ALL such points, not just the first or most obvious one.
3. At the top of EVERY relevant file, ensure the necessary import/setup is present (do NOT duplicate if already present).
4. Insert the snapshot call (with a clear, descriptive, and unique name) at EVERY identified point in EVERY relevant file.
5. Double-check your work. If in doubt, add more snapshot calls rather than fewer. DO NOT stop until you have processed ALL relevant files and ALL important points within them.

Iteratively update every relevant test file in the directory and all subdirectories, adding Percy integration to each, one file at a time, until all are complete.`;

export const PERCY_SIMULATE_INSTRUCTION = `
MANDATORY: Aggressive, Accurate Percy Snapshots Integration

You MUST follow these steps with NO EXCEPTIONS:
1. Identify 4-5 key test files in the project that are critical for visual testing.
2. For EACH identified test file, analyze the code to find EVERY location where a Percy snapshot should be called (e.g., after each navigation, UI change, or significant state in tests).
3. Insert snapshot calls at ALL such points, not just the first or most obvious one.

Iteratively update every selected test file with percy snapshot calls at all identified points, ensuring comprehensive coverage of visual changes.`;

export const PERCY_SIMULATION_DRIVER_INSTRUCTION = `
MANDATORY: Step-by-Step Percy Visual Change Simulation
You MUST follow these steps with NO EXCEPTIONS:

STEP 1: At this case we have added Percy snapshot commands to the test files at the appropriate locations (e.g., after navigation, UI change, or significant state). 
- Use ONLY existing snapshot names (e.g., "Before Adding to Cart").
- Do NOT add any popup injection or visual changes yet.
- Do NOT run any Percy builds at this stage.

STEP 2: Run a baseline Percy build to capture the original snapshots.
- Ensure all snapshots use the existing names.
- Do NOT add new snapshot names.

STEP 3: Modify your test to inject a visible UI change (such as a popup) IMMEDIATELY BEFORE an EXISTING snapshot command (e.g., before percy_snapshot(self.driver, "Before Adding to Cart")).
- Do NOT add a new snapshot name for the popup.
- The popup must appear in an existing snapshot, not a new one.

Example popup code (Python/Selenium):

\`\`\`python
popup_script = \`
var popup = document.createElement('div');
popup.id = 'percy-test-popup';
popup.style.cssText = popup.style.cssText = \`
  /* TODO: Add styles to make the popup large, centered, and visually noticeable.
     Suggested properties: position: fixed; top/left; transform; background; color; font-size; padding; z-index; animation, etc. */
\`;
popup.innerHTML = 'PERCY TEST<br>VISUAL CHANGE<br>DETECTED!';
document.body.appendChild(popup);
\`;

# Insert this just before the EXISTING snapshot command:
driver.execute_script(popup_script)
percy_snapshot(self.driver, "Before Adding to Cart")  # (Do NOT change the snapshot name, keep existing one)
\`\`\`

STEP 4: Run a second Percy build.
- The snapshot names must remain the same as in the baseline.
- The visual change should now appear in the same snapshot as before.

STEP 5: Compare the two Percy builds to see the detected visual difference.

CONSTRAINTS:
- Do NOT run any builds until explicitly instructed in the steps.
- Do NOT add new snapshot names—only use existing ones.
- Do NOT add popup injection until the baseline is established.
- Visual changes must appear in EXISTING snapshots, not new ones.

VALIDATION CHECKPOINTS (before proceeding to the next step):
- Are you adding only snapshot commands (not running builds)?
- Are you reusing existing snapshot names (not creating new ones)?
- Have you established the baseline first (before adding visual changes)?
`;