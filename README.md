# BrowserStack MCP Server

<div style="display: flex; justify-content: space-between; padding: 20px;">
<img src="assets/browserstack-logo.png" alt="BrowserStack Logo" height="100"> <img src="assets/mcp-logo.png" alt="MCP Server Logo" width="100">
</div>

▶️ [See it in action](https://www.youtube.com/watch?v=vy1sx0J7sTk)

[![Watch the video](https://img.youtube.com/vi/vy1sx0J7sTk/0.jpg)](https://www.youtube.com/watch?v=vy1sx0J7sTk)


## 💡 Usage Examples
After installing the BrowserStack MCP Server, use the prompts below in your favorite AI clients: Github Copilot, Cursor, Claude Desktop, etc.

### 📱 Manual App Testing
Use the following prompts to use your **mobile apps** on BrowserStack's extensive cloud of real devices. Stop using emulators!

```bash
# Open app on specific device
"open my app on a iPhone 15 Pro Max"

# Debug app crashes
"My app crashed on Android 14 device, can you help me debug?"
```

- Test your mobile apps on BrowserStack's extensive cloud of real devices
- Unlike emulators, test your app's real-world performance on actual devices
- Debug crashes and performance issues in real-time
- Access all major devices and OS versions from our [device grid](https://www.browserstack.com/list-of-browsers-and-platforms/app_live).


### 🌐 Manual Web Testing
Similar to the app testing, you can use the following prompts to test your **websites** on BrowserStack's extensive cloud of real browsers and devices. Don't have a Windows machine to test on Internet Explorer? We've got you covered!

```bash
# Test your local websites
"open my website hosted on localhost:3001 on a internet explorer"
```
- Test websites across different browsers and devices. We support all major browsers and devices.
- Seamlessly test websites hosted locally, no need to deploy to a remote server!



### 🧪 Automated Testing (Playwright, Selenium, etc.)

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

   - Sign up at [BrowserStack](https://www.browserstack.com/signup)
   - Get your credentials from [Account Settings](https://www.browserstack.com/accounts/profile/details)

2. **Install the MCP Server**
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
   - On Github Copilot (Agent Mode): `.vscode/mcp.json`:
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

## ✨ Supported Features - More Coming Soon!

### 🌐 Web Testing

### 🧪 Automated Testing

## 🤝 Recommended MCP Clients

- **Github Copilot or Cursor** (Recommended for automated testing + debugging)
- **Claude Desktop** (Recommended for manual testing)

## ⚠️ Important Notes

- The BrowserStack MCP Server is under active development and currently supports a subset of the MCP protocol, i.e. `tools`. More features will be added soon.
- As tool invocation relies on the MCP Client which in turn rely on LLMs for tool calling. There can be some non-deterministic behaviour and can lead to unexpected results. If you have any suggestions or feedback, please open an issue to discuss.

## 📝 Contributing

We welcome contributions! Please read our [Contributing Guidelines](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support, please:

- Check our [documentation](https://www.browserstack.com/docs)
- Open an issue in our [GitHub repository](https://github.com/browserstack/mcp-server)
- Contact our [support team](https://www.browserstack.com/contact)

## 🔗 Resources

- [BrowserStack Test Platform](https://www.browserstack.com/test-platform)
- [MCP Protocol Documentation](https://modelcontextprotocol.io)
- [Device Grid](https://www.browserstack.com/list-of-browsers-and-platforms/app_live)
- [Accessibility Testing](https://www.browserstack.com/accessibility-testing)
