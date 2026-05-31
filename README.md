# Bio Generator Pro

Professional bio generator for social media platforms with free and Pro tiers.

## ✨ Features

- **Platform Selection**: Choose from LinkedIn, Instagram, Twitter/X, Telegram, TikTok
- **Template-Based Generation**: Creative, professional, friendly, witty tones (free)
- **ChatGPT Integration**: AI-powered bio generation (Pro only)
- **Hashtag Generator**: Relevant hashtags based on profession and hobbies
- **Usage Tracking**: Daily and total generation counters (localStorage)
- **History**: View and reuse previous bios
- **Examples**: Ready-to-use bio examples for various professions
- **Export Options**: Copy to clipboard, download as image, email placeholder
- **Pro Features** (one-time $9 via lava.top):
  - Unlimited generations
  - ChatGPT API integration
  - All tones (including mysterious, inspiring, humorous)
  - No watermark
  - All platforms unlocked
  - Priority support

## 🛠️ Installation & Setup

1. **Clone or download** this repository
2. **Open `index.html`** in any modern browser (Chrome, Firefox, Safari, Edge)
3. **Optional**: Deploy to a static host (Vercel, Netlify, GitHub Pages) for public access
4. **For ChatGPT Pro features**:
   - Get an API key from [OpenAI](https://platform.openai.com/api-keys)
   - Click the key icon in the app (appears after Pro activation) or wait for prompt
   - Enter and save your key securely in localStorage

## 💰 Монетизация (Pro Activation)

To unlock Pro features:

1. Click **"Купить Pro"** in the app
2. You will be redirected to [lava.top](https://app.lava.top/products/c277d241-1187-453b-8b98-b042dbfbffec)
3. Complete the purchase
4. After successful payment, you will be redirected back to the app with `?pro=activated` in the URL
5. The app will automatically detect this and unlock Pro features
6. If redirect doesn't work manually, you can add `?pro=activated` to the URL and reload

> **Note:** Configure your lava.top product settings to redirect to `https://yourdomain.com/?pro=activated` after purchase.

## 📱 Usage

### Free Tier
- Enter your profession and optional hobby
- Select platform, tone, and length
- Click **"Сгенерировать bio"**
- Use up to 3 generations per day
- View history and examples
- Note: Free version includes a small watermark

### Pro Tier
- All free features plus:
  - Unlimited daily generations
  - AI-powered generation via ChatGPT (requires API key)
  - Access to all tones (mysterious, inspiring, humorous)
  - No watermark on results
  - All platforms available

## 🧠 How It Works

The app combines:
- **Template Engine**: Handcrafted bio templates for quick, reliable results
- **Platform Optimization**: Adjusts tone and style based on selected platform
- **AI Integration**: For Pro users, sends prompts to OpenAI's GPT-3.5-turbo for unique, creative bios
- **Smart Hashtags**: Generates relevant hashtags from a profession-based map and hobby keywords
- **Persistent Storage**: Uses localStorage to track usage, history, and Pro status

## 🔧 Customization

- **Templates**: Edit `templates` and `proTemplates` objects in `app.js` to add more variations
- **Hashtags**: Modify `hashtagMap` in `app.js` to add profession-specific tags
- **Styling**: Update `style.css` for colors, fonts, animations
- **Platforms**: Add new platforms in `platformAdjustments` and the HTML radio buttons

## 📸 Screenshots

*(Add screenshots here showing:)*
1. Main form with platform selection
2. Generated bio result with actions
3. Examples section
4. History panel
5. Pro upgrade modal
6. Mobile responsive view

## 🚀 Deployment

To deploy as a static site:

### Vercel
1. Push repo to GitHub
2. Import project on [Vercel](https://vercel.com)
3. Vercel automatically detects static site and deploys

### Netlify
1. Connect GitHub repo
2. Set build command: `none` and publish directory: `/`
3. Deploy

### GitHub Pages
1. Push to `main` or `master` branch
2. Go to repo Settings → Pages
3. Select branch and folder (`/root`)
4. Save and wait for deployment

## 🛡️ Privacy & Security

- All data (usage, history, API key) is stored **only in your browser's localStorage**
- No data is sent to any server except:
  - Optional: OpenAI API calls (only when using ChatGPT generation)
  - Optional: lava.top for Pro verification (via URL parameter)
- We never store or transmit your personal data
- For maximum security, consider using incognito/private browsing if sharing a computer

## 📞 Support & Feedback

For issues, suggestions, or Pro activation problems:
- Email: support@biogenerator.example
- Telegram: @BioGenSupport
- Or leave an issue in the GitHub repository

## 🙏 Credits

- Built with vanilla HTML/CSS/JS
- Icons from [Font Awesome](https://fontawesome.com)
- Html2canvas library for image export
- Inspired by the need for quick, professional social media bios

---

*Bio Generator Pro - Create impressive bios in seconds. No design skills needed.*  
*© 2026 Bio Generator. All rights reserved.*
