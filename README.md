# BrowserStack MCP Server

<div style="display: flex; justify-content: space-between; padding: 20px;">
<img src="assets/browserstack-logo.png" alt="BrowserStack Logo" height="100"> <img src="assets/mcp-logo.png" alt="MCP Server Logo" width="100">
</div>

<h3 align="center">One Platform For All Your Testing Needs</h4>

Enable every developer and tester in your team, whether they are testing manually, starting their automation journey, or scaling test automation.
BrowserStack MCP Server allows you to use our cutting-edge [Test Platform](https://www.browserstack.com/test-platform) directly from your favorite AI tools.

### Why BrowserStack ?

<p align="center">
  <img src="assets/overview.png" alt="overview">
</p>

## 💡 Usage Examples

### 📱 Manual App Testing

Use the following prompts to use your **mobile apps** on BrowserStack's extensive cloud of real devices. Stop using emulators!

```bash
# Open app on specific device
"open my app on a iPhone 15 Pro Max"

# Debug app crashes
"My app crashed on Android 14 device, can you help me debug?"
```

Video Walkthrough:

[![Watch the video](https://img.youtube.com/vi/vy1sx0J7sTk/0.jpg)](https://www.youtube.com/watch?v=vy1sx0J7sTk)

- Unlike emulators, test your app's real-world performance on actual devices. With advanced [App-Profiling features](https://www.browserstack.com/docs/app-live/app-performance-testing), you can debug crashes and performance issues in real-time.
- Access all major devices and OS versions from our [device grid](https://www.browserstack.com/list-of-browsers-and-platforms/app_live), We have strict SLAs to provision our global datacenters with newly released devices on [launch day](https://www.browserstack.com/blog/browserstack-launches-iphone-15-on-day-0-behind-the-scenes/).

### 🌐 Manual Web Testing

Similar to the app testing, you can use the following prompts to test your **websites** on BrowserStack's extensive cloud of real browsers and devices. Don't have a Windows machine to test on Internet Explorer? We've got you covered!

```bash
# Test your local websites
"open my website hosted on localhost:3001 on Internet Explorer"
```

- Test websites across different browsers and devices. We support [every major browser](https://www.browserstack.com/list-of-browsers-and-platforms/live) across every major OS.
- Seamlessly test websites hosted locally on your machine, no need to deploy to a remote server!

### 🧪 Automated Testing (Playwright, Selenium, A11y and more..)

Use the following prompts to run/debug/fix your **automated tests** on BrowserStack's [Test Platform](https://www.browserstack.com/test-platform).

```bash
# Port test suite to BrowserStack
"run my test suite on BrowserStack infra"

# Debug test failures
"My test suite failed, can you help me fix the new failures?"

# Accessibility testing
"check for accessibility issues on my www.mywebsite.com"
```

- Fix test failures reported by your CI/CD pipeline by utilising our industry leading [Test Observability](https://www.browserstack.com/docs/test-observability) features. Find more info [here](https://www.browserstack.com/docs/test-observability/features/smart-tags).
- Run tests written in Jest, Playwright, Selenium, and more on BrowserStack's [Test Platform](https://www.browserstack.com/test-platform)
- **Accessibility Testing**: Ensure WCAG and ADA compliance with our [Accessibility Testing](https://www.browserstack.com/accessibility-testing) tool

## 🚀 Overview

BrowserStack MCP Server brings the power of BrowserStack's [Test Platform](https://www.browserstack.com/test-platform) directly into your development workflow. It enables you to run tests, debug applications, and perform cross-browser testing through any [MCP-compliant client](https://modelcontextprotocol.io/clients#feature-support-matrix).

## 🛠️ Installation

1. **Create a BrowserStack Account**

   - Sign up for [BrowserStack](https://www.browserstack.com/signup) if you don't have an account already.
   - Note down your `username` and `access_key` from [Account Settings](https://www.browserstack.com/accounts/profile/details)

2. **Install the MCP Server**
   - On VSCode (Copilot - Agent Mode): `.vscode/mcp.json`:
   ```json
   {
     "servers": {
       "browserstack": {
         "command": "npx",
         "args": ["-y", "@browserstack/mcp-server@latest"],
         "env": {
           "BROWSERSTACK_USERNAME": "<username>",
           "BROWSERSTACK_ACCESS_KEY": "<access_key>"
         }
       }
     }
   }
   ```
   - On Cursor: `.cursor/mcp.json`:
   ```json
   {
     "mcpServers": {
       "browserstack": {
         "command": "npx",
         "args": ["-y", "@browserstack/mcp-server@latest"],
         "env": {
           "BROWSERSTACK_USERNAME": "<username>",
           "BROWSERSTACK_ACCESS_KEY": "<access_key>"
         }
       }
     }
   }
   ```
   - On Claude Desktop: `~/claude_desktop_config.json`:
   ```json
   {
     "mcpServers": {
       "browserstack": {
         "command": "npx",
         "args": ["-y", "@browserstack/mcp-server@latest"],
         "env": {
           "BROWSERSTACK_USERNAME": "<username>",
           "BROWSERSTACK_ACCESS_KEY": "<access_key>"
         }
       }
     }
   }
   ```


## 🤝 Recommended MCP Clients

- We recommend using **Github Copilot or Cursor** for automated testing + debugging use cases.
- For manual testing use cases (Live Testing), we recommend using **Claude Desktop**.

## ⚠️ Important Notes

- The BrowserStack MCP Server is under active development and currently supports a subset of the MCP protocol, i.e. `tools`. More features will be added soon.
- As tool invocation relies on the MCP Client which in turn rely on LLMs for tool calling. There can be some non-deterministic behaviour and can lead to unexpected results. If you have any suggestions or feedback, please open an issue to discuss.

## 📝 Contributing

We welcome contributions! Please open an issue to discuss any changes you'd like to make.

## 📞 Support

For support, please:

- Check our [documentation](https://www.browserstack.com/docs)
- Open an issue in our [GitHub repository](https://github.com/browserstack/mcp-server) if you face any issues related to the MCP Server.
- Contact our [support team](https://www.browserstack.com/contact) for any other queries.

## 🔗 Resources

- [BrowserStack Test Platform](https://www.browserstack.com/test-platform)
- [MCP Protocol Documentation](https://modelcontextprotocol.io)
- [Device Grid](https://www.browserstack.com/list-of-browsers-and-platforms/app_live)
- [Accessibility Testing](https://www.browserstack.com/accessibility-testing)
