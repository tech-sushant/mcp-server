# BrowserStack MCP Server
<div style="display: flex; justify-content: space-between;">
<img src="assets/browserstack-logo.png" alt="BrowserStack Logo" height="100"> <img src="assets/mcp-logo.png" alt="MCP Server Logo" width="100">
</div>

> Seamlessly integrate BrowserStack's powerful testing infrastructure with your favorite AI-first development environments, check the video below to see it in action..
 
[![Watch the video](https://img.youtube.com/vi/vy1sx0J7sTk/0.jpg)](https://www.youtube.com/watch?v=vy1sx0J7sTk)


## 🚀 Overview

BrowserStack MCP Server brings the power of BrowserStack's [Test Platform](https://www.browserstack.com/test-platform) directly into your development workflow. It enables you to run tests, debug applications, and perform cross-browser testing through any [MCP-compliant client](https://modelcontextprotocol.io/clients#feature-support-matrix).

## ✨ Features

### 📱 App Testing
- **Real Device Testing**: Test your mobile apps on BrowserStack's extensive cloud of real devices
- **Comprehensive Device Coverage**: Access all major devices and OS versions from our [device grid](https://www.browserstack.com/list-of-browsers-and-platforms/app_live)
- **Performance Testing**: Unlike emulators, test your app's real-world performance on actual devices
- **Live Debugging**: Debug crashes and performance issues in real-time

### 🌐 Web Testing
- **Local Testing**: Seamlessly test websites hosted on localhost
- **Cross-Browser Testing**: Test websites across different browsers and devices
- **Screenshot Testing**: Capture and compare screenshots across different environments

### 🧪 Automated Testing
- **Framework Support**: Run tests written in Jest, Playwright, Selenium, and more
- **Smart Test Case Tagging**: Leverage AI to identify and fix test failures
- **Accessibility Testing**: Ensure WCAG and ADA compliance with our [Accessibility Testing](https://www.browserstack.com/accessibility-testing) tool

## 🛠️ Installation

1. **Create a BrowserStack Account**
   - Sign up at [BrowserStack](https://www.browserstack.com/signup)
   - Get your credentials from [Account Settings](https://www.browserstack.com/accounts/profile/details)

2. **Install the MCP Server**
   - For Cursor users, update your `.cursor/mcp.json`:
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
   }
   ```

## 💡 Usage Examples

### App Testing
```bash
# Open app on specific device
"open my app on a iPhone 15 Pro Max"

# Debug app crashes
"My app crashed on Android 14 device, can you help me debug?"
```

### Web Testing
```bash
# Test local website
"open my website hosted on localhost:3001 on a Windows Edge browser and take a screenshot"

# Check website compatibility
"open test.com on Samsung Browser and check for readability issues"
```

### Automated Testing
```bash
# Run test suite
"run my test suite on BrowserStack"

# Debug test failures
"My test suite failed, can you help me fix the new failures?"

# Accessibility testing
"check for accessibility issues on my www.mywebsite.com"
```

## 🤝 Supported MCP Clients

- **Cursor** (Recommended for code modifications)
- **Claude Desktop**
- Other MCP-compliant clients

## ⚠️ Important Notes

- The BrowserStack MCP Server is under active development
- Currently supports a subset of the MCP protocol
- Due to the non-deterministic nature of LLMs, tool invocation may vary

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
