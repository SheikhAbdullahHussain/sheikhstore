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
import { MAX_FILE_MB, MAX_IMAGES, compressImage, pickProductImages } from "@/lib/images";
import { deleteHeroBanner, fetchHeroBanners, upsertHeroBanner } from "@/lib/hero-banners-api";
import { HERO_SLIDES } from "@/data/hero-slides";
import {
  deleteOrder,
  fetchOrders,
  updateOrderStatus,
  type OrderRow,
  type OrderStatus,
} from "@/lib/orders-api";
import { deleteSubscriber, fetchSubscribers, type Subscriber } from "@/lib/subscribers-api";
import {
  CATEGORIES,
  CLOTHING_TYPES,
  KIDS_GENDERS,
  type Category,
  type Measurements,
  type Product,
  type Subcategory,
} from "@/data/products";

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

const MEASUREMENT_FIELDS: { key: keyof Measurements; label: string }[] = [
  { key: "chest", label: "Chest" },
  { key: "length", label: "Length" },
  { key: "shoulder", label: "Shoulder" },
  { key: "waist", label: "Waist" },
  { key: "sleeve", label: "Sleeve" },
];

const KNOWN_COLOR_HEX: Record<string, string> = {
  black: "#111111",
  white: "#ffffff",
  navy: "#1f2a44",
  maroon: "#6b1f2a",
  beige: "#e8dcc8",
  grey: "#9a9a9a",
  gray: "#9a9a9a",
  pink: "#e8a0b4",
  mustard: "#d9a441",
  green: "#3f6b4a",
  blue: "#3a5f9e",
  red: "#c0392b",
  yellow: "#e6c229",
  orange: "#d9772b",
  purple: "#6b3fa0",
  brown: "#6b4a2f",
  gold: "#c9a227",
  silver: "#c0c0c0",
  teal: "#1f6b6b",
  olive: "#6b6b1f",
  cream: "#f2e9d8",
  turquoise: "#2fa5a0",
};

function hslToHex(h: number, s: number, l: number): string {
  s /= 100;
  l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  const toHex = (x: number) =>
    Math.round(x * 255)
      .toString(16)
      .padStart(2, "0");
  return `#${toHex(f(0))}${toHex(f(8))}${toHex(f(4))}`;
}

/** Deterministic fallback colour for names we don't recognize or don't have a picked hex for. */
function nameToHex(name: string): string {
  const key = name.trim().toLowerCase();
  if (KNOWN_COLOR_HEX[key]) return KNOWN_COLOR_HEX[key];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return hslToHex(Math.abs(hash) % 360, 45, 55);
}

const emptyMeasurements: Measurements = {
  chest: "",
  length: "",
  shoulder: "",
  waist: "",
  sleeve: "",
};

type FormState = {
  title: string;
  price: string;
  category: Category;
  subcategory: Subcategory | "";
  description: string;
  images: string[];
  sizes: string[];
  colors: string[];
  measurements: Measurements;
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
  measurements: emptyMeasurements,
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

  // ---------- hero banners ----------
  const [banners, setBanners] = useState<Record<string, string>>({});
  const [bannerUploadingKey, setBannerUploadingKey] = useState<string | null>(null);
  const bannerFileRef = useRef<HTMLInputElement>(null);
  const pendingSlideKeyRef = useRef<string | null>(null);

  useEffect(() => {
    if (!session) return;
    fetchHeroBanners()
      .then(setBanners)
      .catch((err) => {
        console.error("Failed to load hero banners:", err);
        toast.error("Couldn't load homepage banners");
      });
  }, [session]);

  const triggerBannerUpload = (slideKey: string) => {
    pendingSlideKeyRef.current = slideKey;
    bannerFileRef.current?.click();
  };

  const BANNER_ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];
  const BANNER_MAX_FILE_MB = 8;

  const onBannerFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only one file is ever selected here (the input has no `multiple`
    // attribute), but guard anyway in case that ever changes.
    const files = e.target.files;
    const file = files?.[0];
    e.target.value = "";
    const slideKey = pendingSlideKeyRef.current;
    if (!file || !slideKey) return;

    if (files && files.length > 1) {
      toast.error("Please select only one image per banner slot");
      return;
    }
    if (!BANNER_ACCEPTED_TYPES.includes(file.type)) {
      toast.error("Only JPG, PNG, WEBP or AVIF images are allowed");
      return;
    }
    if (file.size > BANNER_MAX_FILE_MB * 1024 * 1024) {
      toast.error(`Banner image must be under ${BANNER_MAX_FILE_MB}MB`);
      return;
    }

    setBannerUploadingKey(slideKey);
    try {
      const dataUrl = await compressImage(file, 1600);
      await upsertHeroBanner(slideKey, dataUrl);
      setBanners((m) => ({ ...m, [slideKey]: dataUrl }));
      toast.success("Banner updated");
    } catch (err) {
      console.error("Banner upload failed:", err);
      toast.error("Couldn't upload banner");
    } finally {
      setBannerUploadingKey(null);
    }
  };

  const removeBanner = async (slideKey: string) => {
    try {
      await deleteHeroBanner(slideKey);
      setBanners((m) => {
        const next = { ...m };
        delete next[slideKey];
        return next;
      });
      toast.success("Banner removed — slide will use a product photo instead");
    } catch (err) {
      console.error("Failed to remove banner:", err);
      toast.error("Couldn't remove banner");
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

  const [sizeInput, setSizeInput] = useState("");
  const [colorNameInput, setColorNameInput] = useState("");
  const [colorHexInput, setColorHexInput] = useState("#000000");
  const [colorHexMap, setColorHexMap] = useState<Record<string, string>>({});

  const addSize = () => {
    const v = sizeInput.trim();
    if (!v) return;
    if (form.sizes.includes(v)) {
      toast.error("Size already added");
      return;
    }
    setForm((f) => ({ ...f, sizes: [...f.sizes, v] }));
    setSizeInput("");
  };

  const removeSize = (v: string) =>
    setForm((f) => ({ ...f, sizes: f.sizes.filter((x) => x !== v) }));

  const addColor = () => {
    const v = colorNameInput.trim();
    if (!v) return;
    if (form.colors.includes(v)) {
      toast.error("Colour already added");
      return;
    }
    setForm((f) => ({ ...f, colors: [...f.colors, v] }));
    setColorHexMap((m) => ({ ...m, [v]: colorHexInput }));
    setColorNameInput("");
  };

  const removeColor = (v: string) =>
    setForm((f) => ({ ...f, colors: f.colors.filter((x) => x !== v) }));

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
    const hexMap: Record<string, string> = {};
    (p.colors ?? []).forEach((name) => {
      hexMap[name] = nameToHex(name);
    });
    setColorHexMap(hexMap);
    setForm({
      title: p.title,
      price: String(p.price),
      category: p.category,
      subcategory: p.subcategory ?? "",
      description: p.description,
      images: p.images?.length ? p.images : p.image ? [p.image] : [],
      sizes: p.sizes ?? [],
      colors: p.colors ?? [],
      measurements: { ...emptyMeasurements, ...(p.measurements ?? {}) },
      inStock: p.stock > 0,
    });
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setColorHexMap({});
    setSizeInput("");
    setColorNameInput("");
    setColorHexInput("#000000");
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.images.length) {
      toast.error("Upload at least one product image from your device");
      return;
    }
    if (!form.subcategory) {
      toast.error(
        form.category === "Kids" ? "Select Boys or Girls" : "Select a type (Stitched / Unstitched)",
      );
      return;
    }
    const trimmedMeasurements = Object.fromEntries(
      Object.entries(form.measurements).filter(([, v]) => v.trim() !== ""),
    ) as Measurements;
    const hasMeasurements = Object.keys(trimmedMeasurements).length > 0;

    const payload = {
      title: form.title,
      price: Number(form.price),
      category: form.category,
      subcategory: form.subcategory as Subcategory,
      description: form.description,
      image: form.images[0]!,
      images: form.images,
      sizes: form.sizes,
      colors: form.colors,
      measurements: hasMeasurements ? trimmedMeasurements : undefined,
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
      resetForm();
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
        <form
          onSubmit={submit}
          className="surface-elevated hairline h-fit space-y-4 rounded-2xl p-6"
        >
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
                onClick={resetForm}
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
                    subcategory: "",
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
            <div className="space-y-2">
              <Label>{form.category === "Kids" ? "Gender" : "Type"}</Label>
              <Select
                value={form.subcategory}
                onValueChange={(v) => setForm({ ...form, subcategory: v as Subcategory })}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={form.category === "Kids" ? "Select gender" : "Select type"}
                  />
                </SelectTrigger>
                <SelectContent>
                  {(form.category === "Kids" ? KIDS_GENDERS : CLOTHING_TYPES).map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* ---------- Sizes (not applicable to unstitched fabric, sold by the metre) ---------- */}
          {form.subcategory !== "Unstitched" && (
            <div className="space-y-2">
              <Label>Sizes</Label>
              <p className="text-[11px] text-muted-foreground">
                Add each size this product is available in (e.g. S, M, L, XL, 38, One Size).
              </p>
              <div className="flex gap-2">
                <Input
                  value={sizeInput}
                  onChange={(e) => setSizeInput(e.target.value)}
                  placeholder="e.g. M"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addSize();
                    }
                  }}
                />
                <Button type="button" variant="outline" onClick={addSize}>
                  Add
                </Button>
              </div>
              {form.sizes.length ? (
                <div className="flex flex-wrap gap-2 pt-1">
                  {form.sizes.map((s) => (
                    <span
                      key={s}
                      className="flex items-center gap-1.5 rounded-full border bg-secondary px-3 py-1 text-xs font-medium"
                    >
                      {s}
                      <button
                        type="button"
                        aria-label={`Remove size ${s}`}
                        onClick={() => removeSize(s)}
                      >
                        <X className="size-3" />
                      </button>
                    </span>
                  ))}
                </div>
              ) : null}
            </div>
          )}

          {/* ---------- Colours ---------- */}
          <div className="space-y-2">
            <Label>Colours</Label>
            <p className="text-[11px] text-muted-foreground">
              Add each colour option with a name and swatch.
            </p>
            <div className="flex gap-2">
              <Input
                value={colorNameInput}
                onChange={(e) => {
                  const v = e.target.value;
                  setColorNameInput(v);
                  const key = v.trim().toLowerCase();
                  if (key) setColorHexInput(KNOWN_COLOR_HEX[key] ?? nameToHex(v));
                }}
                placeholder="e.g. Black"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addColor();
                  }
                }}
              />
              <input
                type="color"
                value={colorHexInput}
                onChange={(e) => setColorHexInput(e.target.value)}
                className="h-10 w-12 shrink-0 cursor-pointer rounded border"
                aria-label="Colour swatch"
              />
              <Button type="button" variant="outline" onClick={addColor}>
                Add
              </Button>
            </div>
            {form.colors.length ? (
              <div className="flex flex-wrap gap-2 pt-1">
                {form.colors.map((name) => {
                  const hex = colorHexMap[name] ?? nameToHex(name);
                  return (
                    <span
                      key={name}
                      className="flex items-center gap-2 rounded-full border bg-secondary px-3 py-1 text-xs font-medium"
                    >
                      <span
                        className="size-3.5 rounded-full border"
                        style={{
                          backgroundColor: hex,
                          boxShadow:
                            hex === "#ffffff" ? "inset 0 0 0 1px rgba(0,0,0,0.15)" : undefined,
                        }}
                      />
                      {name}
                      <button
                        type="button"
                        aria-label={`Remove colour ${name}`}
                        onClick={() => removeColor(name)}
                      >
                        <X className="size-3" />
                      </button>
                    </span>
                  );
                })}
              </div>
            ) : null}
          </div>

          {/* ---------- Measurements (optional) ---------- */}
          <div className="space-y-2">
            <Label>Measurements (optional)</Label>
            <p className="text-[11px] text-muted-foreground">
              Useful for items like maxis/kurtas where exact fit matters. Leave blank if not needed.
            </p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {MEASUREMENT_FIELDS.map(({ key, label }) => (
                <div key={key} className="space-y-1">
                  <Label
                    htmlFor={`a-m-${key}`}
                    className="text-xs font-normal text-muted-foreground"
                  >
                    {label}
                  </Label>
                  <Input
                    id={`a-m-${key}`}
                    placeholder="e.g. 40 in"
                    value={form.measurements[key] ?? ""}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        measurements: { ...f.measurements, [key]: e.target.value },
                      }))
                    }
                  />
                </div>
              ))}
            </div>
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
                          p.stock > 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
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
                    <TableCell
                      colSpan={7}
                      className="py-8 text-center text-sm text-muted-foreground"
                    >
                      Loading orders…
                    </TableCell>
                  </TableRow>
                ) : orders.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="py-8 text-center text-sm text-muted-foreground"
                    >
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
                    <TableCell
                      colSpan={3}
                      className="py-8 text-center text-sm text-muted-foreground"
                    >
                      Loading subscribers…
                    </TableCell>
                  </TableRow>
                ) : subscribers.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      className="py-8 text-center text-sm text-muted-foreground"
                    >
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

      {/* ================= HOMEPAGE BANNERS ================= */}
      <div className="mt-14 mb-4">
        <h2 className="text-xl font-bold">Homepage Banners</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Upload a custom wide banner for each slide. Leave empty and the slide falls back to a real
          product photo from that category.
        </p>
        <input
          ref={bannerFileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif"
          className="sr-only"
          onChange={onBannerFileChange}
        />
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {HERO_SLIDES.map((s) => (
            <div key={s.key} className="hairline overflow-hidden rounded-2xl">
              <div className="relative aspect-[21/8] bg-secondary">
                {banners[s.key] ? (
                  <img src={banners[s.key]} alt={s.label} className="h-full w-full object-cover" />
                ) : (
                  <div className="grid h-full place-items-center px-4 text-center text-xs text-muted-foreground">
                    No banner uploaded — using a product photo
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between gap-2 p-3">
                <span className="text-sm font-medium">{s.label}</span>
                <div className="flex gap-1">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    disabled={bannerUploadingKey === s.key}
                    onClick={() => triggerBannerUpload(s.key)}
                  >
                    {bannerUploadingKey === s.key
                      ? "Uploading…"
                      : banners[s.key]
                        ? "Replace"
                        : "Upload"}
                  </Button>
                  {banners[s.key] && (
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      aria-label={`Remove ${s.label} banner`}
                      onClick={() => removeBanner(s.key)}
                    >
                      <Trash2 className="size-4 text-destructive" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
