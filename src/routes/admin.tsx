import { useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Image as ImageIcon, Lock, Pencil, Plus, Trash2, Upload, X } from "lucide-react";
import { toast } from "sonner";
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
import {
  MAX_FILE_MB,
  MAX_IMAGES,
  parseVariants,
  pickProductImages,
} from "@/lib/images";
import type { Category, Product } from "@/data/products";

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

const CATS: Category[] = ["Clothing", "Accessories", "Electronics"];

type FormState = {
  title: string;
  price: string;
  category: Category;
  description: string;
  images: string[];
  sizes: string;
  colors: string;
  stock: string;
  featured: boolean;
};

const emptyForm: FormState = {
  title: "",
  price: "",
  category: "Clothing",
  description: "",
  images: [],
  sizes: "",
  colors: "",
  stock: "",
  featured: false,
};

function Admin() {
  const { products, addProduct, updateProduct, deleteProduct } = useStore();
  const [unlocked, setUnlocked] = useState(false);
  const [pass, setPass] = useState("");
  const [form, setForm] = useState<FormState>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const onPickFiles = async (files: FileList) => {
    setUploading(true);
    try {
      const { images, errors } = await pickProductImages(files, form.images.length);
      if (images.length) {
        setForm((f) => ({ ...f, images: [...f.images, ...images] }));
        toast.success(`${images.length} image${images.length > 1 ? "s" : ""} added`);
      }
      for (const err of errors) toast.error(`${err.file}: ${err.reason}`);
    } finally {
      setUploading(false);
    }
  };

  if (!unlocked) {
    return (
      <section className="mx-auto max-w-sm px-4 py-24 sm:px-6">
        <div className="surface-elevated hairline rounded-2xl p-6 text-center">
          <span className="mx-auto grid size-12 place-items-center rounded-full bg-secondary">
            <Lock className="size-5 text-gold" />
          </span>
          <h1 className="mt-4 text-xl font-bold">Admin Access</h1>
          <p className="mt-2 text-xs text-muted-foreground">
            Demo gate — passcode is <span className="font-mono">sheikh2026</span>. Connect Lovable
            Cloud for real accounts and roles.
          </p>
          <form
            className="mt-5 space-y-3"
            onSubmit={(e) => {
              e.preventDefault();
              if (pass === "sheikh2026") setUnlocked(true);
              else toast.error("Incorrect passcode");
            }}
          >
            <Input
              type="password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              placeholder="Passcode"
              aria-label="Admin passcode"
            />
            <Button type="submit" className="w-full">
              Unlock dashboard
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
      description: p.description,
      images: p.images?.length ? p.images : p.image ? [p.image] : [],
      sizes: (p.sizes ?? []).join(", "),
      colors: (p.colors ?? []).join(", "),
      stock: String(p.stock),
      featured: p.featured ?? false,
    });
  };

  // const submit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (!form.images.length) {
  //     toast.error("Upload at least one product image from your device");
  //     return;
  //   }
  //   const payload = {
  //     title: form.title,
  //     price: Number(form.price),
  //     category: form.category,
  //     description: form.description,
  //     image: form.images[0]!,
  //     images: form.images,
  //     sizes: parseVariants(form.sizes),
  //     colors: parseVariants(form.colors),
  //     stock: Number(form.stock),
  //     featured: form.featured,
  //   };
  //   if (editingId) {
  //     updateProduct(editingId, payload);
  //     toast.success("Product updated");
  //   } else {
  //     addProduct(payload);
  //     toast.success("Product added to the catalogue");
  //   }
  //   setForm(emptyForm);
  //   setEditingId(null);
  // };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.images.length) {
      toast.error("Upload at least one product image from your device");
      return;
    }
    const payload = {
      title: form.title,
      price: Number(form.price),
      category: form.category,
      description: form.description,
      image: form.images[0]!,
      images: form.images,
      sizes: parseVariants(form.sizes),
      colors: parseVariants(form.colors),
      stock: Number(form.stock),
      featured: form.featured,
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
      <p className="text-[11px] uppercase tracking-[0.24em] text-gold">Dashboard</p>
      <h1 className="mt-2 text-3xl font-bold">Product Management</h1>

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
              <Label htmlFor="a-stock">Stock</Label>
              <Input
                id="a-stock"
                type="number"
                min="0"
                required
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Category</Label>
            <Select
              value={form.category}
              onValueChange={(v) => setForm({ ...form, category: v as Category })}
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
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="a-sizes">Sizes</Label>
              <Input
                id="a-sizes"
                placeholder="S, M, L, XL"
                value={form.sizes}
                onChange={(e) => setForm({ ...form, sizes: e.target.value })}
              />
              <p className="text-[11px] text-muted-foreground">Comma separated. Leave blank if none.</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="a-colors">Colours</Label>
              <Input
                id="a-colors"
                placeholder="Black, Camel, Charcoal"
                value={form.colors}
                onChange={(e) => setForm({ ...form, colors: e.target.value })}
              />
              <p className="text-[11px] text-muted-foreground">Comma separated. Leave blank if none.</p>
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
            <Button
              type="button"
              variant="outline"
              className="w-full"
              disabled={uploading || form.images.length >= MAX_IMAGES}
              onClick={() => fileRef.current?.click()}
            >
              <Upload className="size-4" />
              {uploading ? "Processing…" : "Upload from this device"}
            </Button>
            <p className="text-[11px] text-muted-foreground">
              Single or multiple images from your device · JPG, PNG, WEBP or AVIF · up to{" "}
              {MAX_FILE_MB}MB each · max {MAX_IMAGES} per product ({form.images.length}/{MAX_IMAGES}{" "}
              added)
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
          {/* <div className="flex items-center gap-2">
            <input
              id="a-featured"
              type="checkbox"
              checked={form.featured}
              onChange={(e) => setForm({ ...form, featured: e.target.checked })}
              className="size-4 rounded border"
            />
            <Label htmlFor="a-featured" className="cursor-pointer">
              Show in "Featured & Top Selling"
            </Label>
          </div> */}
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
                    <TableCell className="text-sm text-muted-foreground">{p.category}</TableCell>
                    <TableCell className="text-sm">{money(p.price)}</TableCell>
                    <TableCell className="text-sm">{p.stock}</TableCell>
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
                          onClick={() => {
                            deleteProduct(p.id);
                            toast.success("Product deleted");
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
    </section>
  );
}