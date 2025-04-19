# BrowserStack MCP Server
The power of BrowserStack's [Test Platform](https://www.browserstack.com/test-platform) at your fingertips, install our MCP server on any of the [MCP compliant clients](https://modelcontextprotocol.io/clients#feature-support-matrix) to start testing your apps and websites.

## For App Developers 📱
- Install and Run your mobile apps on BrowserStack's cloud of real devices 📲
    - We support all major devices and OS versions. Check out our [device grid](https://www.browserstack.com/list-of-browsers-and-platforms/app_live) to see the full list.
- Unlike emulators or simulators, BrowserStack's real devices can be used to test your app's real-world performance. Check more on [testing app performance here](https://www.browserstack.com/docs/app-live/app-performance-testing).

Sample Prompts:
- "open my app on a iPhone 15 Pro Max"
- "My app crashed on Android 14 device, can you help me debug?"

## For Web Developers 🌐
- Test local websites on BrowserStack infrastructure to ensure compatibility across all browsers and devices.

Sample Prompts:
- "open my website hosted on localhost:3001 on a Windows Edge browser and take a screenshot"
- "open test.com on Samsung Browser and check for readability issues"

## For QA Engineers, Automation Engineers, and SDETs 🧪
- Utilise the power of AI-first IDEs like Cursor, Windsurf and more to fix test case failures in your code by utilising [Smart Test Case Tagging](https://www.browserstack.com/docs/test-observability/features/smart-tags).
- Check for WCAG, ADA compliance, and more a11y goodness with our industry leading [Accessibility Testing](https://www.browserstack.com/accessibility-testing) tool.

Sample Prompts:
- "My test suite failed, can you help me fix the new failures?"
- "check for accessibility issues on my www.mywebsite.com"


# Installation
* Create an account on [BrowserStack](https://www.browserstack.com/signup) if you don't have one already.
* Note down your `username` and `access_key` from [here](https://www.browserstack.com/accounts/profile/details)
* Install the MCP server on any MCP compatible client. Refer:
    * For Cursor update your `.cursor/mcp.json` file to include the following:
    ```json
    {
     "mcpServers": {
        "browserstack_mcp_server": {
           "command": "npx",
            "args": ["@browserstack/mcp-server"],
            "env": {
                "BROWSERSTACK_USERNAME": "<username>",
                "BROWSERSTACK_ACCESS_KEY": "<access_key>"
            }
        }
   }
   ```

## Recommended MCP Clients
* BrowserStack MCP Server has been tested thoroughly on Claude Desktop and Cursor.
    * For use cases involving code modifications we recommend using Cursor.