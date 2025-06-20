import { PercyConfigMapping } from "./types.js";

const javaSeleniumInstructions = `
To manually capture screenshots, implement the following steps in your test script:

1.  **Import the BrowserStack Percy SDK** in your test script.
2.  Add the \`PercySDK.screenshot(driver, name)\` method at required points in your test script to capture the screenshots.

Here's an example:

\`\`\`java
// ...imports
import com.browserstack.PercySDK;

public class YourTestClass extends YourBaseTest {
    @Test
    public void test() throws Exception {
         // your test logic
         // ...
         
         // Capture a Percy screenshot
         PercySDK.screenshot(driver, "My Screenshot Name");
         
         // ...
         // more test logic
    }
}
\`\`\`
`;

export const nodejsSeleniumInstructions = `
To manually capture screenshots, implement the following steps in your test script:
   - Import the BrowserStack Percy SDK in your test script.
   - Add the \`percy.snapshot(driver, name)\` method at required points in your test script to capture the screenshots you want.

   \`\`\`javascript
   const { percy } = require('browserstack-node-sdk');
   describe("sample Test", () => {
     // ... other imports and setup
     
     test("my test", async () => {
       // ....
       await percy.snapshot(driver, "My Snapshot")
       // ....
     });
   })
   \`\`\`
`;

const webdriverioPercyInstructions = `
**1. Enable Percy in \`wdio.conf.js\`**

In your WebdriverIO configuration file, modify the 'browserstack' service options to enable Percy.

- Set \`percy: true\`.
- Set a \`projectName\`. This is required and will be used for both your Automate and Percy projects.
- Set \`percyCaptureMode\`. The default \`auto\` mode is recommended, which captures screenshots on events like clicks. Other modes are \`testcase\`, \`click\`, \`screenshot\`, and \`manual\`.

Here's how to modify the service configuration:
\`\`\`javascript
// in wdio.conf.js

exports.config = {
  // ... other configs
  services: [
    [
      'browserstack',
      { 
        // ... other service options
        percy: true,
        percyCaptureMode: 'auto' // or 'manual', 'testcase', etc.
      },
    ],
  ],

  commonCapabilities: {
    'bstack:options': {
      projectName: "My Percy Project", // This is required for Percy
      // ... other common capabilities
    }
  },
  // ... rest of your config
};
\`\`\`

**2. Manually Capturing Screenshots (Optional)**

If you set \`percyCaptureMode: 'manual'\` or want to take extra screenshots in \`auto\` mode, you need to add screenshot commands to your tests.

First, install \`browserstack-node-sdk\`:
\`\`\`bash
npm install browserstack-node-sdk
\`\`\`

Then, in your test script, import \`percy\` and use it to take a snapshot:
\`\`\`javascript
// your_test_file.js
const { percy } = require('browserstack-node-sdk');

describe("My WebdriverIO Test", () => {
  it("should take a percy snapshot", async () => {
    // ... your test logic (e.g., browser.url('https://example.com'))
    
    // Capture a Percy screenshot
    await percy.screenshot(driver, "My Snapshot Name");
    
    // ... more test logic
  });
});
\`\`\`
`;

export const PERCY_INSTRUCTIONS: PercyConfigMapping = {
  java: {
    selenium: {
      testng: { script_updates: javaSeleniumInstructions },
      cucumber: { script_updates: javaSeleniumInstructions },
      junit: { script_updates: javaSeleniumInstructions },
    },
  },
  nodejs: {
    selenium: {
      mocha: {
        script_updates: nodejsSeleniumInstructions,
      },
      jest: {
        script_updates: nodejsSeleniumInstructions,
      },
      webdriverio: {
        script_updates: webdriverioPercyInstructions,
      },
      cucumber: {
        script_updates: nodejsSeleniumInstructions,
      },
    },
  },
  // You can add instructions for other stacks like nodejs+playwright here
};
