import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { toast } from "sonner";
// import { seedProducts, type Product } from "@/data/products";
import type { Product } from "@/data/products";
import {
  deleteProductRow,
  fetchProducts,
  insertProduct,
  updateProductRow,
} from "@/lib/products-api";
import { insertOrder } from "@/lib/orders-api";

export type CartItem = {
  key: string;
  productId: string;
  title: string;
  price: number;
  image: string;
  qty: number;
  size?: string | undefined;
  color?: string | undefined;
};

export type Order = {
  id: string;
  createdAt: string;
  items: CartItem[];
  total: number;
  shipping: { name: string; email: string; address: string; city: string; phone: string };
  payment: "cod" | "card";
};

type StoreValue = {
  products: Product[];
  productsLoading: boolean;
  addProduct: (p: Omit<Product, "id" | "rating" | "reviews">) => Promise<void>;
  updateProduct: (id: string, p: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  cart: CartItem[];
  cartCount: number;
  cartTotal: number;
  addToCart: (
    p: Product,
    opts?: { qty?: number | undefined; size?: string | undefined; color?: string | undefined },
  ) => void;
  setQty: (key: string, qty: number) => void;
  removeFromCart: (key: string) => void;
  clearCart: () => void;
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  orders: Order[];
  placeOrder: (o: Omit<Order, "id" | "createdAt" | "items" | "total">) => Promise<Order>;
};

const StoreContext = createContext<StoreValue | null>(null);

// Cart stays in the browser — no need for a DB round-trip for a shopping cart.
const CART_KEY = "sheikhstore.cart.v1";

function readLocal<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Load cart from localStorage, products from Supabase.
  useEffect(() => {
    setCart(readLocal<CartItem[]>(CART_KEY, []));
    setHydrated(true);
    
    fetchProducts()
      .then(setProducts)
      .catch((err) => {
        console.error("Failed to load products from Supabase:", err);
        toast.error("Couldn't load products from the database. Please try again.");
      })
      .finally(() => setProductsLoading(false));
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart, hydrated]);

  const addProduct = useCallback(async (p: Omit<Product, "id" | "rating" | "reviews">) => {
    const created = await insertProduct(p);
    setProducts((prev) => [created, ...prev]);
  }, []);

  const updateProduct = useCallback(async (id: string, patch: Partial<Product>) => {
    const updated = await updateProductRow(id, patch);
    setProducts((prev) => prev.map((p) => (p.id === id ? updated : p)));
  }, []);

  const deleteProduct = useCallback(async (id: string) => {
    await deleteProductRow(id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const addToCart = useCallback<StoreValue["addToCart"]>((p, opts) => {
    const qty = opts?.qty ?? 1;
    const size = opts?.size ?? p.sizes?.[0];
    const color = opts?.color ?? p.colors?.[0];
    const key = [p.id, size ?? "-", color ?? "-"].join("::");
    setCart((prev) => {
      const found = prev.find((i) => i.key === key);
      if (found) return prev.map((i) => (i.key === key ? { ...i, qty: i.qty + qty } : i));
      return [
        ...prev,
        { key, productId: p.id, title: p.title, price: p.price, image: p.image, qty, size, color },
      ];
    });
  }, []);

  const setQty = useCallback((key: string, qty: number) => {
    setCart((prev) =>
      qty <= 0
        ? prev.filter((i) => i.key !== key)
        : prev.map((i) => (i.key === key ? { ...i, qty } : i)),
    );
  }, []);

  const removeFromCart = useCallback((key: string) => {
    setCart((prev) => prev.filter((i) => i.key !== key));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const cartCount = cart.reduce((n, i) => n + i.qty, 0);
  const cartTotal = cart.reduce((n, i) => n + i.qty * i.price, 0);

  const placeOrder = useCallback<StoreValue["placeOrder"]>(
    async (o) => {
      const order: Order = {
        ...o,
        id: `SS-${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 90 + 10)}`,
        createdAt: new Date().toISOString(),
        items: cart,
        total: cartTotal,
      };
      await insertOrder(order);
      setOrders((prev) => [order, ...prev]);
      setCart([]);
      return order;
    },
    [cart, cartTotal],
  );

  const value = useMemo<StoreValue>(
    () => ({
      products,
      productsLoading,
      addProduct,
      updateProduct,
      deleteProduct,
      cart,
      cartCount,
      cartTotal,
      addToCart,
      setQty,
      removeFromCart,
      clearCart,
      cartOpen,
      setCartOpen,
      orders,
      placeOrder,
    }),
    [
      products,
      productsLoading,
      addProduct,
      updateProduct,
      deleteProduct,
      cart,
      cartCount,
      cartTotal,
      addToCart,
      setQty,
      removeFromCart,
      clearCart,
      cartOpen,
      orders,
      placeOrder,
    ],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}

export const money = (n: number) =>
  n.toLocaleString("en-PK", {
    style: "currency",
    currency: "PKR",
    currencyDisplay: "narrowSymbol",
    maximumFractionDigits: 0,
  });