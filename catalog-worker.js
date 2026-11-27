// Cloudflare Worker: bind DB (D1), threeditron-product-images (R2), and
// CATALOG_WORKER_SECRET before deploying.
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

const categories = ["designs", "filaments", "microcontrollers", "sensors", "motors", "power"];
const productImagesBinding = "threeditron-product-images";
const json = (data, status = 200) => Response.json(data, { status, headers: corsHeaders });
const isAdmin = (request, env) => Boolean(env.CATALOG_WORKER_SECRET) && request.headers.get("Authorization") === `Bearer ${env.CATALOG_WORKER_SECRET}`;

function imageUrl(origin, key) {
  if (key.startsWith("https://")) return key;
  return `${origin}/images/${key.split("/").map(encodeURIComponent).join("/")}`;
}

function groupProducts(rows, origin) {
  const products = new Map();
  for (const row of rows) {
    if (!products.has(row.id)) {
      let specs = [];
      try { specs = JSON.parse(row.specs || "[]"); } catch { /* Invalid legacy data. */ }
      const product = { id: row.id, slug: row.slug, name: row.name, category: row.category, price: row.price, stock: row.stock, description: row.description, specs, images: [] };
      if (row.is_published !== undefined) product.isPublished = Boolean(row.is_published);
      products.set(row.id, product);
    }
    if (row.r2_key) products.get(row.id).images.push({ key: row.r2_key, altText: row.alt_text || row.name, url: imageUrl(origin, row.r2_key), position: row.position });
  }
  return [...products.values()];
}

function parseProduct(body) {
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const slug = typeof body.slug === "string" ? body.slug.trim() : "";
  const category = typeof body.category === "string" ? body.category.trim() : "";
  const price = Number(body.price);
  const stock = Number(body.stock);
  if (!name || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || !categories.includes(category) || !Number.isFinite(price) || price < 0 || !Number.isInteger(stock) || stock < 0 || (body.images !== undefined && (!Array.isArray(body.images) || body.images.some((image) => typeof image !== "string" || !image.startsWith("https://"))))) return null;
  return { name, slug, category, price: Math.round(price), stock, description: typeof body.description === "string" ? body.description.trim() : null, specs: Array.isArray(body.specs) ? body.specs.filter((spec) => typeof spec === "string" && spec.trim()) : [], isPublished: Boolean(body.isPublished), images: body.images };
}

function imageStatements(env, id, product, origin) {
  return product.images.map((url, position) => {
    // Keep existing R2 keys in their original form; Backblaze uploads use URLs.
    const prefix = `${origin}/images/`;
    const key = url.startsWith(prefix) ? decodeURIComponent(url.slice(prefix.length)) : url;
    return env.DB.prepare("INSERT INTO product_images (product_id, r2_key, alt_text, position) VALUES (?, ?, ?, ?)").bind(id, key, product.name, position);
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (request.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
    const create = url.pathname === "/admin/products" && request.method === "POST";
    const update = url.pathname.startsWith("/admin/products/") && request.method === "PUT";
    const remove = url.pathname.startsWith("/admin/products/") && request.method === "DELETE";
    const upload = url.pathname === "/admin/uploads" && request.method === "POST";
    if (request.method !== "GET" && !create && !update && !remove && !upload) return json({ error: "Method not allowed" }, 405);

    if (url.pathname === "/products" && request.method === "GET") {
      const { results } = await env.DB.prepare(`SELECT p.id, p.slug, p.name, p.category, p.price, p.stock, p.description, p.specs, pi.r2_key, pi.alt_text, pi.position FROM products p LEFT JOIN product_images pi ON pi.product_id = p.id WHERE p.is_published = 1 ORDER BY p.created_at DESC, pi.position ASC`).all();
      return json(groupProducts(results, url.origin));
    }
    if (url.pathname.startsWith("/products/") && request.method === "GET") {
      const slug = decodeURIComponent(url.pathname.slice("/products/".length));
      const { results } = await env.DB.prepare(`SELECT p.id, p.slug, p.name, p.category, p.price, p.stock, p.description, p.specs, pi.r2_key, pi.alt_text, pi.position FROM products p LEFT JOIN product_images pi ON pi.product_id = p.id WHERE p.slug = ? AND p.is_published = 1 ORDER BY pi.position ASC`).bind(slug).all();
      const products = groupProducts(results, url.origin);
      return products.length ? json(products[0]) : json({ error: "Product not found" }, 404);
    }
    if (url.pathname.startsWith("/images/") && request.method === "GET") {
      const key = decodeURIComponent(url.pathname.slice("/images/".length));
      const object = await env[productImagesBinding]?.get(key);
      if (!object) return json({ error: "Image not found" }, 404);
      const headers = new Headers(corsHeaders);
      object.writeHttpMetadata(headers);
      headers.set("etag", object.httpEtag);
      headers.set("Cache-Control", "public, max-age=31536000, immutable");
      return new Response(object.body, { headers });
    }
    if (upload) {
      if (!isAdmin(request, env)) return json({ error: "Unauthorized" }, 401);
      const formData = await request.formData();
      const file = formData.get("file");
      if (!file || typeof file !== "object" || !("arrayBuffer" in file) || typeof file.type !== "string" || !file.type.startsWith("image/")) {
        return json({ error: "Please select an image file." }, 400);
      }
      const productImages = env[productImagesBinding];
      if (!productImages) {
        return json({ error: `R2 binding ${productImagesBinding} is not configured on this Worker.` }, 500);
      }
      try {
        const safeName = (file.name || "image").replace(/[^a-zA-Z0-9._-]/g, "-");
        const key = `products/${Date.now()}-${safeName}`;
        await productImages.put(key, await file.arrayBuffer(), {
          httpMetadata: { contentType: file.type },
        });
        return json({ success: true, key, url: imageUrl(url.origin, key) }, 201);
      } catch (error) {
        console.error("R2 image upload failed:", error);
        return json({ error: `Unable to write the image to R2. Check the ${productImagesBinding} binding and R2 bucket permissions.` }, 500);
      }
    }
    if (url.pathname === "/admin/products" && request.method === "GET") {
      if (!isAdmin(request, env)) return json({ error: "Unauthorized" }, 401);
      const { results } = await env.DB.prepare(`SELECT p.id, p.slug, p.name, p.category, p.price, p.stock, p.description, p.specs, p.is_published, pi.r2_key, pi.alt_text, pi.position FROM products p LEFT JOIN product_images pi ON pi.product_id = p.id ORDER BY p.created_at DESC, pi.position ASC`).all();
      return json(groupProducts(results, url.origin));
    }
    if (create || update) {
      if (!isAdmin(request, env)) return json({ error: "Unauthorized" }, 401);
      const product = parseProduct(await request.json());
      if (!product) return json({ error: "Please provide valid product details and image URLs." }, 400);
      const id = create ? crypto.randomUUID() : decodeURIComponent(url.pathname.slice("/admin/products/".length));
      if (!id) return json({ error: "Product ID is required" }, 400);
      if (update && !(await env.DB.prepare("SELECT id FROM products WHERE id = ?").bind(id).first())) return json({ error: "Product not found" }, 404);
      const statement = create
        ? env.DB.prepare("INSERT INTO products (id, slug, name, category, price, stock, description, specs, is_published) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)").bind(id, product.slug, product.name, product.category, product.price, product.stock, product.description, JSON.stringify(product.specs), product.isPublished ? 1 : 0)
        : env.DB.prepare("UPDATE products SET slug = ?, name = ?, category = ?, price = ?, stock = ?, description = ?, specs = ?, is_published = ? WHERE id = ?").bind(product.slug, product.name, product.category, product.price, product.stock, product.description, JSON.stringify(product.specs), product.isPublished ? 1 : 0, id);
      const statements = [statement];
      if (product.images !== undefined) {
        if (update) statements.push(env.DB.prepare("DELETE FROM product_images WHERE product_id = ?").bind(id));
        statements.push(...imageStatements(env, id, product, url.origin));
      }
      await env.DB.batch(statements);
      return create ? json({ id, ...product }, 201) : json({ success: true });
    }
    if (remove) {
      if (!isAdmin(request, env)) return json({ error: "Unauthorized" }, 401);
      const id = decodeURIComponent(url.pathname.slice("/admin/products/".length));
      if (!(await env.DB.prepare("SELECT id FROM products WHERE id = ?").bind(id).first())) return json({ error: "Product not found" }, 404);
      await env.DB.batch([env.DB.prepare("DELETE FROM product_images WHERE product_id = ?").bind(id), env.DB.prepare("DELETE FROM products WHERE id = ?").bind(id)]);
      return json({ success: true });
    }
    return json({ error: "Not found" }, 404);
  },
};
