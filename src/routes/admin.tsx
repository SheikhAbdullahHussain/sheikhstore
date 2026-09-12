import { useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Image as ImageIcon, LogOut, Pencil, Plus, Trash2, Upload, X } from "lucide-react";
import { toast } from "sonner";
import type { Session } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { money, useStore } from "@/lib/store";
import { getSession, onAuthStateChange, signIn, signOut } from "@/lib/auth";
import { MAX_FILE_MB, MAX_IMAGES, pickProductImages } from "@/lib/images";
import {
  deleteOrder,
  fetchOrders,
  updateOrderStatus,
  type OrderRow,
  type OrderStatus,
} from "@/lib/orders-api";
import {
  deleteSubscriber,
  fetchSubscribers,
  type Subscriber,
} from "@/lib/subscribers-api";
import { CATEGORIES, SUBCATEGORIES, type Category, type Product, type Subcategory } from "@/data/products";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin — Product Management | SheikhStore" },
      {
        name: "description",
        content:
          "SheikhStore admin dashboard for adding, editing and removing catalogue products, prices and stock levels.",
      },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Admin — SheikhStore" },
      { property: "og:description", content: "Manage the SheikhStore product catalogue." },
    ],
  }),
  component: Admin,
});

const CATS: Category[] = CATEGORIES.filter((c): c is Category => c !== "All");
const ORDER_STATUSES: OrderStatus[] = ["pending", "shipped", "delivered"];
const SIZE_OPTIONS = ["XS", "S", "M", "L", "XL", "XXL"];
const COLOR_OPTIONS: { name: string; hex: string }[] = [
  { name: "Black", hex: "#111111" },
  { name: "White", hex: "#ffffff" },
  { name: "Navy", hex: "#1f2a44" },
  { name: "Maroon", hex: "#6b1f2a" },
  { name: "Beige", hex: "#e8dcc8" },
  { name: "Grey", hex: "#9a9a9a" },
  { name: "Pink", hex: "#e8a0b4" },
  { name: "Mustard", hex: "#d9a441" },
  { name: "Green", hex: "#3f6b4a" },
  { name: "Blue", hex: "#3a5f9e" },
];

/** Rough luminance check so the checkmark on a swatch stays readable. */
function isLight(hex: string): boolean {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 150;
}

type FormState = {
  title: string;
  price: string;
  category: Category;
  subcategory: Subcategory | "";
  description: string;
  images: string[];
  sizes: string[];
  colors: string[];
  inStock: boolean;
};

const emptyForm: FormState = {
  title: "",
  price: "",
  category: "Men",
  subcategory: "",
  description: "",
  images: [],
  sizes: [],
  colors: [],
  inStock: true,
};

function Admin() {
  const { products, addProduct, updateProduct, deleteProduct } = useStore();

  // ---------- auth ----------
  const [session, setSession] = useState<Session | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);

  useEffect(() => {
    getSession()
      .then(setSession)
      .catch(() => setSession(null))
      .finally(() => setAuthChecked(true));

    const unsubscribe = onAuthStateChange(setSession);
    return unsubscribe;
  }, []);

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoggingIn(true);
    try {
      await signIn(email, password);
      setPassword("");
    } catch (err) {
      console.error("Login failed:", err);
      toast.error("Incorrect email or password");
    } finally {
      setLoggingIn(false);
    }
  };

  const logout = async () => {
    try {
      await signOut();
      toast.success("Signed out");
    } catch (err) {
      console.error("Sign out failed:", err);
      toast.error("Couldn't sign out");
    }
  };

  // ---------- orders ----------
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  // ---------- subscribers ----------
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [subscribersLoading, setSubscribersLoading] = useState(false);

  useEffect(() => {
    if (!session) return;

    setOrdersLoading(true);
    fetchOrders()
      .then(setOrders)
      .catch((err) => {
        console.error("Failed to load orders:", err);
        toast.error("Couldn't load orders");
      })
      .finally(() => setOrdersLoading(false));

    setSubscribersLoading(true);
    fetchSubscribers()
      .then(setSubscribers)
      .catch((err) => {
        console.error("Failed to load subscribers:", err);
        toast.error("Couldn't load subscribers");
      })
      .finally(() => setSubscribersLoading(false));
  }, [session]);

  const changeOrderStatus = async (id: string, status: OrderStatus) => {
    try {
      await updateOrderStatus(id, status);
      setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
      toast.success("Order status updated");
    } catch (err) {
      console.error("Failed to update order status:", err);
      toast.error("Couldn't update order status");
    }
  };

  const removeOrder = async (id: string) => {
    try {
      await deleteOrder(id);
      setOrders((prev) => prev.filter((o) => o.id !== id));
      toast.success("Order deleted");
    } catch (err) {
      console.error("Failed to delete order:", err);
      toast.error("Couldn't delete order");
    }
  };

  const removeSubscriber = async (id: string) => {
    try {
      await deleteSubscriber(id);
      setSubscribers((prev) => prev.filter((s) => s.id !== id));
      toast.success("Subscriber removed");
    } catch (err) {
      console.error("Failed to remove subscriber:", err);
      toast.error("Couldn't remove subscriber");
    }
  };

  // ---------- product form ----------
  const [form, setForm] = useState<FormState>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [removeBg, setRemoveBg] = useState(true);
  const [bgColor, setBgColor] = useState("#ffffff");
  const fileRef = useRef<HTMLInputElement>(null);

  const toggleSize = (s: string) =>
    setForm((f) => ({
      ...f,
      sizes: f.sizes.includes(s) ? f.sizes.filter((x) => x !== s) : [...f.sizes, s],
    }));

  const toggleColor = (name: string) =>
    setForm((f) => ({
      ...f,
      colors: f.colors.includes(name) ? f.colors.filter((x) => x !== name) : [...f.colors, name],
    }));

  const onPickFiles = async (files: FileList) => {
    setUploading(true);
    try {
      const { images, errors } = await pickProductImages(files, form.images.length, {
        removeBg,
        bgColor,
      });
      if (images.length) {
        setForm((f) => ({ ...f, images: [...f.images, ...images] }));
        toast.success(`${images.length} image${images.length > 1 ? "s" : ""} added`);
      }
      for (const err of errors) toast.error(`${err.file}: ${err.reason}`);
    } finally {
      setUploading(false);
    }
  };

  if (!authChecked) {
    return (
      <section className="mx-auto max-w-sm px-4 py-24 text-center text-sm text-muted-foreground sm:px-6">
        Checking session…
      </section>
    );
  }

  if (!session) {
    return (
      <section className="mx-auto max-w-sm px-4 py-24 sm:px-6">
        <div className="surface-elevated hairline rounded-2xl p-6 text-center">
          <span className="mx-auto grid size-12 place-items-center rounded-full bg-secondary">
            <LogOut className="size-5 rotate-180 text-gold" />
          </span>
          <h1 className="mt-4 text-xl font-bold">Admin Login</h1>
          <p className="mt-2 text-xs text-muted-foreground">
            Sign in with your Supabase admin account.
          </p>
          <form className="mt-5 space-y-3" onSubmit={login}>
            <Input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              aria-label="Admin email"
              autoComplete="email"
            />
            <Input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              aria-label="Admin password"
              autoComplete="current-password"
            />
            <Button type="submit" className="w-full" disabled={loggingIn}>
              {loggingIn ? "Signing in…" : "Sign in"}
            </Button>
          </form>
        </div>
      </section>
    );
  }

  const startEdit = (p: Product) => {
    setEditingId(p.id);
    setForm({
      title: p.title,
      price: String(p.price),
      category: p.category,
      subcategory: p.subcategory ?? "",
      description: p.description,
      images: p.images?.length ? p.images : p.image ? [p.image] : [],
      sizes: p.sizes ?? [],
      colors: p.colors ?? [],
      inStock: p.stock > 0,
    });
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.images.length) {
      toast.error("Upload at least one product image from your device");
      return;
    }
    if (form.category !== "Toddlers" && !form.subcategory) {
      toast.error("Select a type (Stitched / Unstitched)");
      return;
    }
    const payload = {
      title: form.title,
      price: Number(form.price),
      category: form.category,
      subcategory: form.category === "Toddlers" ? undefined : (form.subcategory as Subcategory),
      description: form.description,
      image: form.images[0]!,
      images: form.images,
      sizes: form.sizes,
      colors: form.colors,
      stock: form.inStock ? 50 : 0,
    };
    try {
      if (editingId) {
        await updateProduct(editingId, payload);
        toast.success("Product updated");
      } else {
        await addProduct(payload);
        toast.success("Product added to the catalogue");
      }
      setForm(emptyForm);
      setEditingId(null);
    } catch (err) {
      console.error("Failed to save product:", err);
      toast.error("Couldn't save the product. Check the console for details.");
    }
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.24em] text-gold">Dashboard</p>
          <h1 className="mt-2 text-3xl font-bold">Product Management</h1>
        </div>
        <Button variant="outline" size="sm" onClick={logout}>
          <LogOut className="size-4" /> Sign out
        </Button>
      </div>

      {/* ================= PRODUCTS ================= */}
      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_1.6fr]">
        <form onSubmit={submit} className="surface-elevated hairline h-fit space-y-4 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">
              {editingId ? "Edit product" : "Add new product"}
            </h2>
            {editingId && (
              <Button
                type="button"
                size="icon"
                variant="ghost"
                aria-label="Cancel editing"
                onClick={() => {
                  setEditingId(null);
                  setForm(emptyForm);
                }}
              >
                <X className="size-4" />
              </Button>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="a-title">Title</Label>
            <Input
              id="a-title"
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="a-price">Price (PKR)</Label>
              <Input
                id="a-price"
                type="number"
                min="0"
                required
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Availability</Label>
              <Select
                value={form.inStock ? "in" : "out"}
                onValueChange={(v) => setForm({ ...form, inStock: v === "in" })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="in">In Stock</SelectItem>
                  <SelectItem value="out">Out of Stock</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select
                value={form.category}
                onValueChange={(v) =>
                  setForm({
                    ...form,
                    category: v as Category,
                    subcategory: v === "Toddlers" ? "" : form.subcategory,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATS.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {form.category !== "Toddlers" && (
              <div className="space-y-2">
                <Label>Type</Label>
                <Select
                  value={form.subcategory}
                  onValueChange={(v) => setForm({ ...form, subcategory: v as Subcategory })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {SUBCATEGORIES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label>Sizes</Label>
            <div className="flex flex-wrap gap-2">
              {SIZE_OPTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => toggleSize(s)}
                  className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                    form.sizes.includes(s)
                      ? "border-foreground bg-foreground text-background"
                      : "hover:bg-secondary"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-muted-foreground">Leave all unselected if not applicable.</p>
          </div>

          <div className="space-y-2">
            <Label>Colours</Label>
            <div className="flex flex-wrap gap-3">
              {COLOR_OPTIONS.map((c) => {
                const selected = form.colors.includes(c.name);
                return (
                  <button
                    key={c.name}
                    type="button"
                    title={c.name}
                    aria-label={c.name}
                    aria-pressed={selected}
                    onClick={() => toggleColor(c.name)}
                    className={`relative size-9 rounded-full border-2 transition-transform ${
                      selected ? "scale-110 border-gold" : "border-transparent"
                    }`}
                    style={{
                      backgroundColor: c.hex,
                      boxShadow: c.hex === "#ffffff" ? "inset 0 0 0 1px rgba(0,0,0,0.15)" : undefined,
                    }}
                  >
                    {selected && (
                      <span
                        className="absolute inset-0 grid place-items-center text-xs font-bold"
                        style={{ color: isLight(c.hex) ? "#000" : "#fff" }}
                      >
                        ✓
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            <p className="text-[11px] text-muted-foreground">
              {form.colors.length ? form.colors.join(", ") : "No colours selected"}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="a-images">Product images</Label>
            <input
              ref={fileRef}
              id="a-images"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif"
              multiple
              className="sr-only"
              onChange={(e) => {
                if (e.target.files) void onPickFiles(e.target.files);
                e.target.value = "";
              }}
            />

            <div className="flex flex-wrap items-center gap-4 rounded-lg border border-dashed p-3 text-xs">
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={removeBg}
                  onChange={(e) => setRemoveBg(e.target.checked)}
                  className="size-4 rounded border"
                />
                Auto-remove background
              </label>
              {removeBg && (
                <label className="flex items-center gap-2">
                  Background colour
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="h-7 w-10 cursor-pointer rounded border"
                    aria-label="Background colour"
                  />
                </label>
              )}
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              disabled={uploading || form.images.length >= MAX_IMAGES}
              onClick={() => fileRef.current?.click()}
            >
              <Upload className="size-4" />
              {uploading
                ? removeBg
                  ? "Removing background…"
                  : "Processing…"
                : "Upload from this device"}
            </Button>
            <p className="text-[11px] text-muted-foreground">
              Single or multiple images from your device · JPG, PNG, WEBP or AVIF · up to{" "}
              {MAX_FILE_MB}MB each · max {MAX_IMAGES} per product ({form.images.length}/{MAX_IMAGES}{" "}
              added){removeBg ? " · first upload downloads the AI model, may take a moment" : ""}
            </p>
            {form.images.length ? (
              <div className="grid grid-cols-3 gap-2 pt-1">
                {form.images.map((src, i) => (
                  <div key={src.slice(0, 40) + i} className="relative">
                    <img
                      src={src}
                      alt={`Product image ${i + 1}`}
                      className="aspect-square w-full rounded-lg border object-cover"
                    />
                    {i === 0 && (
                      <span className="absolute left-1 top-1 rounded bg-gold-soft px-1 text-[10px] font-semibold text-accent-foreground">
                        Main
                      </span>
                    )}
                    <button
                      type="button"
                      aria-label={`Remove image ${i + 1}`}
                      className="absolute right-1 top-1 grid size-6 place-items-center rounded-full bg-background/90 shadow"
                      onClick={() =>
                        setForm((f) => ({ ...f, images: f.images.filter((_, n) => n !== i) }))
                      }
                    >
                      <X className="size-3" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid place-items-center gap-1 rounded-lg border border-dashed py-6 text-center text-xs text-muted-foreground">
                <ImageIcon className="size-5" />
                No images yet — upload at least one.
              </div>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="a-desc">Description</Label>
            <Textarea
              id="a-desc"
              rows={4}
              required
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>
          <Button type="submit" size="lg" className="w-full">
            <Plus className="size-4" /> {editingId ? "Save changes" : "Add product"}
          </Button>
        </form>

        <div className="surface-elevated hairline overflow-hidden rounded-2xl">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <img
                          src={p.image}
                          alt={p.title}
                          loading="lazy"
                          width={40}
                          height={40}
                          className="size-10 rounded-lg object-cover"
                        />
                        <span className="text-sm font-medium">{p.title}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {p.category}
                      {p.subcategory ? ` · ${p.subcategory}` : ""}
                    </TableCell>
                    <TableCell className="text-sm">{money(p.price)}</TableCell>
                    <TableCell className="text-sm">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          p.stock > 0
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {p.stock > 0 ? "In Stock" : "Out of Stock"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          aria-label={`Edit ${p.title}`}
                          onClick={() => startEdit(p)}
                        >
                          <Pencil className="size-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          aria-label={`Delete ${p.title}`}
                          onClick={async () => {
                            try {
                              await deleteProduct(p.id);
                              toast.success("Product deleted");
                            } catch (err) {
                              console.error("Failed to delete product:", err);
                              toast.error("Couldn't delete the product");
                            }
                          }}
                        >
                          <Trash2 className="size-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* ================= ORDERS ================= */}
      <div className="mt-14">
        <h2 className="text-xl font-bold">Orders</h2>
        <div className="surface-elevated hairline mt-4 overflow-hidden rounded-2xl">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ordersLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="py-8 text-center text-sm text-muted-foreground">
                      Loading orders…
                    </TableCell>
                  </TableRow>
                ) : orders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="py-8 text-center text-sm text-muted-foreground">
                      No orders yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  orders.map((o) => (
                    <TableRow key={o.id}>
                      <TableCell className="text-sm font-medium">{o.id}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(o.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-sm">
                        <div>{o.shipping.name}</div>
                        <div className="text-xs text-muted-foreground">{o.shipping.phone}</div>
                      </TableCell>
                      <TableCell className="text-sm">{money(o.total)}</TableCell>
                      <TableCell className="text-sm uppercase text-muted-foreground">
                        {o.payment}
                      </TableCell>
                      <TableCell>
                        <Select
                          value={o.status}
                          onValueChange={(v) => changeOrderStatus(o.id, v as OrderStatus)}
                        >
                          <SelectTrigger className="w-32 capitalize">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {ORDER_STATUSES.map((s) => (
                              <SelectItem key={s} value={s} className="capitalize">
                                {s}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="icon"
                          variant="ghost"
                          aria-label={`Delete order ${o.id}`}
                          onClick={() => removeOrder(o.id)}
                        >
                          <Trash2 className="size-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* ================= SUBSCRIBERS ================= */}
      <div className="mt-14 mb-4">
        <h2 className="text-xl font-bold">Newsletter Subscribers</h2>
        <div className="surface-elevated hairline mt-4 overflow-hidden rounded-2xl">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Subscribed on</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subscribersLoading ? (
                  <TableRow>
                    <TableCell colSpan={3} className="py-8 text-center text-sm text-muted-foreground">
                      Loading subscribers…
                    </TableCell>
                  </TableRow>
                ) : subscribers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="py-8 text-center text-sm text-muted-foreground">
                      No subscribers yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  subscribers.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell className="text-sm font-medium">{s.email}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(s.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="icon"
                          variant="ghost"
                          aria-label={`Remove ${s.email}`}
                          onClick={() => removeSubscriber(s.id)}
                        >
                          <Trash2 className="size-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </section>
  );
}