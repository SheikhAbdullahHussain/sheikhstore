# SheikhStore: Your Premium Online Shop

Act as a Senior Full-Stack Web Developer. I want you to build a responsive, modern E-Commerce Web Application named "SheikhStore". ### General Technical Specifications: - Framework: React (Next.js App Router preferred) or Vite + React - Styling: Tailwind CSS - Icons: Lucide React or FontAwesome - State Management: React Context API or Zustand (for Cart and Products) --- ### Step-by-Step Requirements: #### Step 1: Branding & Logo - Create a clean, modern header brand element for "SheikhStore". - Display a stylized logo icon alongside bold typography reading "SheikhStore". #### Step 2: Navigation Bar (Navbar) - Fixed top navigation bar containing: - Brand Logo ("SheikhStore") - Navigation links: Home, Collections, About, Contact - Right-aligned Cart Icon displaying a dynamic item count badge (e.g., "3") - Mobile-responsive hamburger menu toggle. #### Step 3: Featured Products Slider / Carousel - A dynamic, auto-playing product carousel on the home page. - Highlights featured or top-selling products. - Each slide shows a high-quality product image, title, discounted price, and a direct "Quick Add to Cart" button. #### Step 4: Hero & Main Product Listing Section - Hero Section: Catchy headline ("Discover Premium Quality"), brief subtitle, and a "Shop Now" call-to-action button. - Main Product Grid: - Product Cards featuring image, title, price, star rating, and a "View Details" button. - Category filters (e.g., All, Clothing, Accessories, Electronics) and a search bar. #### Step 5: Product Details Page / Modal - When a product card is clicked, navigate to a detailed view or open a modal containing: - High-resolution product gallery image - Full product title, rating, price, and detailed description - Variant selectors (e.g., Size, Color) - Quantity selector (+ / -) - "Add to Cart" and "Buy Now" buttons. #### Step 6: Shopping Cart & Multi-Step Order Checkout - Slide-over or dedicated Cart Page listing added items with quantity controls and total calculation. - Order Confirmation Flow (3 Steps): 1. Shipping Address: Form capturing Name, Email, Address, City, and Phone Number. 2. Payment Method: Option selection (Cash on Delivery, Credit Card mock form). 3. Order Summary & Success Screen: Summary of items, total cost, order ID, and a "Thank You for Ordering" confirmation view. #### Step 7: Admin Panel (Product Management) - Protected Admin View/Dashboard featuring: - Form to add new products: Title, Price, Category, Description, Image URL, and Stock quantity. - Table listing existing products with options to Edit or Delete. #### Step 8: Footer - Professional footer with: - "SheikhStore" brand summary - Quick Links (Home, Shop, Privacy Policy, Terms of Service) - Customer Service info & Social Media links - Newsletter subscription input field. --- ### Output Guidelines: Please output cleanly structured, modular code components for each step above, ensuring proper state connectivity between the product catalog, cart, checkout flow, and admin creation panel.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://sheikh-store-shop.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/7944b604-6cfb-4b18-bc43-a3030e9001b5).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
