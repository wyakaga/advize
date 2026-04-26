# AdVize 📊

AdVize is a premium, AI-powered **Ad Optimization Advisor** designed to help marketing teams transform raw campaign data into actionable insights. Built with a focus on speed, precision, and an "Editorial Noir" design aesthetic, AdVize streamlines the path from performance tracking to strategic decision-making.

## ✨ Features

- **📊 Comprehensive Dashboard**: Global aggregate metrics (Impressions, Clicks, Conversions, Cost) and interactive performance charts.
- **🚀 AI Analysis Engine**: Intelligent, Qwen-powered analysis of your campaign data to identify bottlenecks and optimization opportunities.
- **📁 Multi-Channel Import**: Add campaigns manually via a high-fidelity form or bulk-upload performance data using CSV files.
- **📅 Historical Archive**: Fully searchable and paginated history of all generated analysis reports.
- **📄 PDF Export**: Export professionally formatted analysis reports for easy sharing with stakeholders.
- **🔒 Secure Authentication**: Robust session management and user-specific data isolation.
- **📱 Fully Responsive**: A seamless, touch-optimized experience tailored for desktop, tablet, and mobile devices.

## 🛠 Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **UI Library**: [HeroUI](https://heroui.com/) & [Tailwind CSS v4](https://tailwindcss.com/)
- **Database**: [Prisma](https://www.prisma.io/) with PostgreSQL
- **AI Integration**: [SumoPod AI](https://sumopod.com/) (Qwen 2.5)
- **Charts**: [Recharts](https://recharts.org/)
- **State Management**: [React Query](https://tanstack.com/query/latest) & [React Context](https://react.dev/learn/passing-data-deeply-with-context)
- **Export**: [@react-pdf/renderer](https://react-pdf.org/)
- **Icons**: [Lucide React](https://lucide.dev/)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- Environment variables (see `.env.example`)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/wyakaga/advize.git
   cd advize
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the root directory and add your credentials:
   ```env
   DATABASE_URL="postgresql://..."
   NEXTAUTH_SECRET="..."
   NEXTAUTH_URL="..."
   GOOGLE_CLIENT_ID="..."
   GOOGLE_CLIENT_SECRET="..."
   SUMOPOD_API_KEY="..."
   ```

4. **Initialize the database:**
   ```bash
   npx prisma db push
   ```

5. **Run the development server:**
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🎨 Design Philosophy: Editorial Noir

AdVize follows an **Editorial Noir** aesthetic—a design system characterized by:
- **High Contrast**: Deep blacks and off-whites for maximum readability and visual impact.
- **Accented Elegance**: Subtle use of primary coral tones for calls to action.
- **Ample Whitespace**: Giving data "room to breathe" to reduce cognitive load.
- **Refined Typography**: Purposeful use of font weights and hierarchy to guide the user's eye.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request or open an issue for any bugs or feature requests.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
