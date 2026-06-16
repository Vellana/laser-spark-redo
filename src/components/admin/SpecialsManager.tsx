import { useState, useEffect, useRef, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Plus, Trash2, Save, Eye, EyeOff, ImagePlus, X,
  Bold, Italic, Underline, Heading1, Heading2, Link,
  List, ListOrdered, Minus, AlignCenter, AlignLeft, Palette, GripVertical,
} from "lucide-react";

type ImagePosition = "above" | "below" | "left" | "right";

type ButtonOrder = "primary_first" | "secondary_first";

interface Special {
  id: string;
  title: string;
  body: string;
  highlight_text: string;
  disclaimer: string;
  image_urls: string[];
  image_position: ImagePosition;
  primary_cta_label: string;
  primary_cta_url: string;
  secondary_cta_label: string;
  secondary_cta_url: string;
  button_order: ButtonOrder;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

const DEFAULT_FORM = {
  title: "",
  body: "",
  highlight_text: "",
  disclaimer: "",
  image_urls: [] as string[],
  image_position: "above" as ImagePosition,
  primary_cta_label: "View Specials",
  primary_cta_url: "/specials",
  secondary_cta_label: "Maybe Later",
  secondary_cta_url: "",
  button_order: "primary_first" as ButtonOrder,
  is_active: true,
};

const SpecialsManager = () => {
  const [specials, setSpecials] = useState<Special[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(DEFAULT_FORM);
  const [saving, setSaving] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchSpecials = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("specials")
      .select("*")
      .order("display_order", { ascending: true });
    if (error) toast.error("Failed to fetch specials");
    else setSpecials((data as any) || []);
    setLoading(false);
  };

  useEffect(() => { fetchSpecials(); }, []);

  const execCmd = (cmd: string, value?: string) => {
    editorRef.current?.focus();
    document.execCommand(cmd, false, value);
    requestAnimationFrame(() => syncEditor());
  };

  const syncEditor = () => {
    if (editorRef.current) {
      setForm((f) => ({ ...f, body: editorRef.current!.innerHTML }));
    }
  };

  const startNew = () => {
    setEditingId("new");
    setForm(DEFAULT_FORM);
    setTimeout(() => { if (editorRef.current) editorRef.current.innerHTML = ""; }, 50);
  };

  const startEdit = (s: Special) => {
    setEditingId(s.id);
    setForm({
      title: s.title,
      body: s.body,
      highlight_text: s.highlight_text || "",
      disclaimer: s.disclaimer || "",
      image_urls: s.image_urls || [],
      image_position: (s.image_position as ImagePosition) || "above",
      primary_cta_label: s.primary_cta_label || "View Specials",
      primary_cta_url: s.primary_cta_url || "/specials",
      secondary_cta_label: s.secondary_cta_label || "Maybe Later",
      secondary_cta_url: s.secondary_cta_url || "",
      button_order: (s.button_order as ButtonOrder) || "primary_first",
      is_active: s.is_active,
    });
    setTimeout(() => { if (editorRef.current) editorRef.current.innerHTML = s.body; }, 50);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    setImageUploading(true);
    try {
      for (const file of Array.from(files)) {
        if (!file.type.startsWith("image/")) { toast.error("Only images allowed"); continue; }
        if (file.size > 5 * 1024 * 1024) { toast.error("Max 5MB per image"); continue; }
        const ext = file.name.split(".").pop();
        const path = `specials/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const { error } = await supabase.storage.from("email-assets").upload(path, file);
        if (error) { toast.error("Upload failed"); continue; }
        const { data: urlData } = supabase.storage.from("email-assets").getPublicUrl(path);
        setForm((f) => ({ ...f, image_urls: [...f.image_urls, urlData.publicUrl] }));
      }
    } finally {
      setImageUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const removeImage = (idx: number) => {
    setForm((f) => ({ ...f, image_urls: f.image_urls.filter((_, i) => i !== idx) }));
  };

  const handleSave = async () => {
    if (!form.title.trim()) { toast.error("Title is required"); return; }
    if (!form.primary_cta_label.trim() || !form.primary_cta_url.trim()) {
      toast.error("Primary button needs both label and link"); return;
    }
    setSaving(true);
    try {
      const payload = {
        title: form.title.trim(),
        body: form.body,
        highlight_text: form.highlight_text.trim(),
        disclaimer: form.disclaimer.trim(),
        image_urls: form.image_urls,
        image_position: form.image_position,
        primary_cta_label: form.primary_cta_label.trim(),
        primary_cta_url: form.primary_cta_url.trim(),
        secondary_cta_label: form.secondary_cta_label.trim(),
        secondary_cta_url: form.secondary_cta_url.trim(),
        button_order: form.button_order,
        is_active: form.is_active,
        updated_at: new Date().toISOString(),
      };

      if (payload.is_active) {
        await supabase.from("specials").update({ is_active: false } as any).neq("id", editingId === "new" ? "" : editingId!);
      }

      if (editingId === "new") {
        const { error } = await supabase.from("specials").insert({ ...payload, display_order: specials.length } as any);
        if (error) throw error;
        toast.success("Special created");
      } else {
        const { error } = await supabase.from("specials").update(payload as any).eq("id", editingId!);
        if (error) throw error;
        toast.success("Special updated");
      }
      setEditingId(null);
      fetchSpecials();
    } catch {
      toast.error("Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this special permanently?")) return;
    const { error } = await supabase.from("specials").delete().eq("id", id);
    if (error) toast.error("Failed to delete");
    else { toast.success("Special deleted"); fetchSpecials(); }
  };

  const toggleActive = async (s: Special) => {
    const newActive = !s.is_active;
    if (newActive) {
      await supabase.from("specials").update({ is_active: false } as any).neq("id", s.id);
    }
    const { error } = await supabase.from("specials").update({ is_active: newActive } as any).eq("id", s.id);
    if (error) toast.error("Failed to update");
    else {
      toast.success(newActive ? "Special activated (others deactivated)" : "Special deactivated");
      fetchSpecials();
    }
  };

  // Live preview HTML - mirrors SpecialsPopup styling using theme tokens
  const previewHtml = useMemo(() => {
    const esc = (s: string) => s.replace(/</g, "&lt;");
    const title = esc(form.title || "Special Title");
    const body = form.body || '<p style="opacity:0.5;">Your content will appear here...</p>';
    const highlight = form.highlight_text
      ? `<p style="font-size:20px;font-weight:700;color:hsl(var(--accent));margin:16px 0 0;">${esc(form.highlight_text)}</p>` : "";
    const disclaimer = form.disclaimer
      ? `<p style="font-size:12px;opacity:0.7;font-style:italic;margin:12px 0 0;">${esc(form.disclaimer)}</p>` : "";

    const imgsBlock = form.image_urls.length
      ? `<div style="display:flex;flex-wrap:wrap;justify-content:center;gap:8px;margin:12px 0;">${
          form.image_urls.map((u) => `<img src="${u}" style="max-width:100%;max-height:180px;object-fit:cover;border-radius:8px;box-shadow:0 4px 8px rgba(0,0,0,0.15);" />`).join("")
        }</div>`
      : "";

    const textBlock = `
      <div style="color:hsl(var(--foreground));font-size:14px;line-height:1.7;">${body}</div>
      ${highlight}
      ${disclaimer}
    `;

    let mediaAndText = "";
    if (form.image_position === "above") {
      mediaAndText = `<div style="text-align:center;">${imgsBlock}${textBlock}</div>`;
    } else if (form.image_position === "below") {
      mediaAndText = `<div style="text-align:center;">${textBlock}${imgsBlock}</div>`;
    } else if (form.image_position === "left") {
      mediaAndText = `<div style="display:flex;gap:16px;align-items:flex-start;text-align:left;flex-wrap:wrap;">
        <div style="flex:1 1 140px;min-width:140px;">${imgsBlock || ""}</div>
        <div style="flex:2 1 220px;min-width:200px;">${textBlock}</div>
      </div>`;
    } else {
      mediaAndText = `<div style="display:flex;gap:16px;align-items:flex-start;text-align:left;flex-wrap:wrap;">
        <div style="flex:2 1 220px;min-width:200px;">${textBlock}</div>
        <div style="flex:1 1 140px;min-width:140px;">${imgsBlock || ""}</div>
      </div>`;
    }

    const primaryLabel = esc(form.primary_cta_label || "View Specials");
    const primaryUrl = esc(form.primary_cta_url || "#");
    const secondaryLabel = esc(form.secondary_cta_label || "");
    const secondaryUrl = esc(form.secondary_cta_url || "");

    const primaryBtn = `<a href="${primaryUrl}" style="flex:1;background:hsl(var(--accent));color:hsl(var(--accent-foreground));text-align:center;padding:10px 16px;border-radius:6px;font-size:14px;font-weight:600;text-decoration:none;display:inline-block;">${primaryLabel}<div style="font-size:10px;opacity:0.8;font-weight:400;margin-top:2px;">→ ${primaryUrl}</div></a>`;
    const secondaryBtn = secondaryLabel
      ? `<a href="${secondaryUrl || "#"}" style="flex:1;border:1px solid hsl(var(--border));color:hsl(var(--foreground));text-align:center;padding:10px 16px;border-radius:6px;font-size:14px;text-decoration:none;display:inline-block;background:transparent;">${secondaryLabel}<div style="font-size:10px;opacity:0.7;margin-top:2px;">→ ${secondaryUrl || "(closes popup)"}</div></a>`
      : "";

    return `<div style="max-width:448px;margin:0 auto;background:hsl(var(--card));border:1px solid hsl(var(--border));border-radius:16px;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;padding:28px;color:hsl(var(--foreground));">
      <h3 style="color:hsl(var(--foreground));font-size:24px;margin:0 0 16px;font-weight:700;text-align:center;">${title}</h3>
      ${mediaAndText}
      <div style="border-top:1px solid hsl(var(--border));padding-top:16px;margin-top:20px;">
        <p style="font-size:14px;font-weight:500;color:hsl(var(--foreground));margin:0 0 8px;text-align:center;">Get <span style="color:hsl(var(--accent));font-weight:700;">10% off</span> your next service when you join our email list!</p>
        <div style="display:flex;gap:8px;background:hsl(var(--background));border:1px solid hsl(var(--border));border-radius:6px;padding:6px;margin-bottom:12px;">
          <div style="flex:1;padding:6px 8px;font-size:12px;opacity:0.6;">your@email.com</div>
          <div style="background:hsl(var(--accent));color:hsl(var(--accent-foreground));padding:6px 14px;border-radius:4px;font-size:12px;font-weight:600;">Sign Up</div>
        </div>
        <div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap;">${form.button_order === "secondary_first" ? `${secondaryBtn}${primaryBtn}` : `${primaryBtn}${secondaryBtn}`}</div>
      </div>
    </div>`;
  }, [form]);

  const toolbarButtons = [
    { icon: Bold, label: "Bold", cmd: "bold" },
    { icon: Italic, label: "Italic", cmd: "italic" },
    { icon: Underline, label: "Underline", cmd: "underline" },
  ] as const;

  if (loading) return <p className="text-center text-muted-foreground py-8">Loading specials...</p>;

  // Editor view
  if (editingId) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">{editingId === "new" ? "Create Special" : "Edit Special"}</h2>
          <Button variant="outline" size="sm" onClick={() => setEditingId(null)}>← Back</Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Compose side */}
          <div className="bg-card border border-border rounded-lg p-6 space-y-4">
            <div className="space-y-2">
              <Label>Title *</Label>
              <Input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="e.g. Summer Special!" maxLength={200} />
            </div>

            <div className="space-y-2">
              <Label>Content</Label>
              <div className="border border-border rounded-lg overflow-hidden">
                <TooltipProvider delayDuration={200}>
                  <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 bg-muted/30 border-b border-border">
                    {toolbarButtons.map(({ icon: Icon, label, cmd }) => (
                      <Tooltip key={label}>
                        <TooltipTrigger asChild>
                          <button type="button" className="p-1.5 rounded-md hover:bg-accent/50 text-muted-foreground hover:text-foreground transition-colors" onMouseDown={(e) => { e.preventDefault(); execCmd(cmd); }}>
                            <Icon className="w-4 h-4" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="text-xs">{label}</TooltipContent>
                      </Tooltip>
                    ))}
                    <div className="h-5 w-px bg-border mx-1" />
                    <Tooltip><TooltipTrigger asChild>
                      <button type="button" className="p-1.5 rounded-md hover:bg-accent/50 text-muted-foreground hover:text-foreground transition-colors" onMouseDown={(e) => { e.preventDefault(); execCmd("formatBlock", "h2"); }}><Heading1 className="w-4 h-4" /></button>
                    </TooltipTrigger><TooltipContent side="top" className="text-xs">Large Heading</TooltipContent></Tooltip>
                    <Tooltip><TooltipTrigger asChild>
                      <button type="button" className="p-1.5 rounded-md hover:bg-accent/50 text-muted-foreground hover:text-foreground transition-colors" onMouseDown={(e) => { e.preventDefault(); execCmd("formatBlock", "h3"); }}><Heading2 className="w-4 h-4" /></button>
                    </TooltipTrigger><TooltipContent side="top" className="text-xs">Small Heading</TooltipContent></Tooltip>
                    <div className="h-5 w-px bg-border mx-1" />
                    <Tooltip><TooltipTrigger asChild>
                      <button type="button" className="p-1.5 rounded-md hover:bg-accent/50 text-muted-foreground hover:text-foreground transition-colors" onMouseDown={(e) => { e.preventDefault(); execCmd("insertUnorderedList"); }}><List className="w-4 h-4" /></button>
                    </TooltipTrigger><TooltipContent side="top" className="text-xs">Bullet List</TooltipContent></Tooltip>
                    <Tooltip><TooltipTrigger asChild>
                      <button type="button" className="p-1.5 rounded-md hover:bg-accent/50 text-muted-foreground hover:text-foreground transition-colors" onMouseDown={(e) => { e.preventDefault(); execCmd("insertOrderedList"); }}><ListOrdered className="w-4 h-4" /></button>
                    </TooltipTrigger><TooltipContent side="top" className="text-xs">Numbered List</TooltipContent></Tooltip>
                    <div className="h-5 w-px bg-border mx-1" />
                    <Tooltip><TooltipTrigger asChild>
                      <button type="button" className="p-1.5 rounded-md hover:bg-accent/50 text-muted-foreground hover:text-foreground transition-colors" onMouseDown={(e) => { e.preventDefault(); execCmd("justifyCenter"); }}><AlignCenter className="w-4 h-4" /></button>
                    </TooltipTrigger><TooltipContent side="top" className="text-xs">Center</TooltipContent></Tooltip>
                    <Tooltip><TooltipTrigger asChild>
                      <button type="button" className="p-1.5 rounded-md hover:bg-accent/50 text-muted-foreground hover:text-foreground transition-colors" onMouseDown={(e) => { e.preventDefault(); execCmd("justifyLeft"); }}><AlignLeft className="w-4 h-4" /></button>
                    </TooltipTrigger><TooltipContent side="top" className="text-xs">Left</TooltipContent></Tooltip>
                    <div className="h-5 w-px bg-border mx-1" />
                    <Tooltip><TooltipTrigger asChild>
                      <button type="button" className="p-1.5 rounded-md hover:bg-accent/50 text-muted-foreground hover:text-foreground transition-colors" onMouseDown={(e) => { e.preventDefault(); const url = prompt("Enter URL:"); if (url) execCmd("createLink", url); }}><Link className="w-4 h-4" /></button>
                    </TooltipTrigger><TooltipContent side="top" className="text-xs">Link</TooltipContent></Tooltip>
                    <Tooltip><TooltipTrigger asChild>
                      <button type="button" className="p-1.5 rounded-md hover:bg-accent/50 text-muted-foreground hover:text-foreground transition-colors" onMouseDown={(e) => { e.preventDefault(); execCmd("insertHorizontalRule"); }}><Minus className="w-4 h-4" /></button>
                    </TooltipTrigger><TooltipContent side="top" className="text-xs">Divider</TooltipContent></Tooltip>
                    <Tooltip><TooltipTrigger asChild>
                      <button type="button" className="p-1.5 rounded-md hover:bg-accent/50 text-muted-foreground hover:text-foreground transition-colors" onMouseDown={(e) => { e.preventDefault(); execCmd("foreColor", "#6dbfa0"); }}><Palette className="w-4 h-4" /></button>
                    </TooltipTrigger><TooltipContent side="top" className="text-xs">Accent Color</TooltipContent></Tooltip>
                  </div>
                </TooltipProvider>
                <div
                  ref={editorRef}
                  contentEditable
                  className="min-h-[160px] max-h-[350px] overflow-y-auto p-4 text-sm text-foreground focus:outline-none bg-background [&_h2]:text-lg [&_h2]:font-bold [&_h2]:my-3 [&_h3]:text-base [&_h3]:font-semibold [&_h3]:my-2 [&_a]:text-accent [&_a]:underline [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_hr]:my-4 [&_hr]:border-border"
                  onInput={syncEditor}
                  suppressContentEditableWarning
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Highlight Text (large accent text)</Label>
              <Input value={form.highlight_text} onChange={(e) => setForm((f) => ({ ...f, highlight_text: e.target.value }))} placeholder="e.g. Value of up to $1,800!" maxLength={200} />
            </div>

            <div className="space-y-2">
              <Label>Disclaimer (fine print)</Label>
              <Input value={form.disclaimer} onChange={(e) => setForm((f) => ({ ...f, disclaimer: e.target.value }))} placeholder="e.g. *Cannot be combined with other offers. Expires 1/31/26." maxLength={500} />
            </div>

            <div className="space-y-2">
              <Label>Images</Label>
              <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} />
              <div className="flex flex-wrap gap-2">
                {form.image_urls.map((url, idx) => (
                  <div key={idx} className="relative w-20 h-20 rounded-md overflow-hidden border border-border group">
                    <img src={url} alt="" className="w-full h-full object-cover" />
                    <button onClick={() => removeImage(idx)} className="absolute top-0.5 right-0.5 bg-black/60 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                <Button variant="outline" size="sm" className="h-20 w-20" onClick={() => fileInputRef.current?.click()} disabled={imageUploading}>
                  <ImagePlus className="w-5 h-5" />
                </Button>
              </div>
              {imageUploading && <p className="text-xs text-muted-foreground">Uploading...</p>}
            </div>

            <div className="space-y-2">
              <Label>Image Position (relative to text)</Label>
              <div className="grid grid-cols-4 gap-2">
                {(["above", "left", "right", "below"] as ImagePosition[]).map((pos) => (
                  <button
                    key={pos}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, image_position: pos }))}
                    className={`px-3 py-2 rounded-md border text-xs font-medium capitalize transition-colors ${
                      form.image_position === pos
                        ? "bg-accent text-accent-foreground border-accent"
                        : "bg-background border-border text-foreground hover:bg-muted"
                    }`}
                  >
                    {pos}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3 pt-2 border-t border-border">
              <Label className="text-sm font-semibold">Buttons</Label>

              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Primary Button (accent color) *</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Input value={form.primary_cta_label} onChange={(e) => setForm((f) => ({ ...f, primary_cta_label: e.target.value }))} placeholder="Label e.g. Book Now" maxLength={50} />
                  <Input value={form.primary_cta_url} onChange={(e) => setForm((f) => ({ ...f, primary_cta_url: e.target.value }))} placeholder="Link e.g. /booking or https://..." />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Secondary Button (outline) - leave label blank to hide</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Input value={form.secondary_cta_label} onChange={(e) => setForm((f) => ({ ...f, secondary_cta_label: e.target.value }))} placeholder="Label e.g. Maybe Later" maxLength={50} />
                  <Input value={form.secondary_cta_url} onChange={(e) => setForm((f) => ({ ...f, secondary_cta_url: e.target.value }))} placeholder="Link (blank = closes popup)" />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 pt-2 border-t border-border">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.is_active} onChange={(e) => setForm((f) => ({ ...f, is_active: e.target.checked }))} className="rounded" />
                <span className="text-sm text-foreground">Active (visible on website)</span>
              </label>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSave} disabled={saving}>
                <Save className="w-4 h-4 mr-2" /> {saving ? "Saving..." : "Save Special"}
              </Button>
              <Button variant="outline" onClick={() => setEditingId(null)}>Cancel</Button>
            </div>
          </div>

          {/* Live preview */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-foreground">Live Preview</h3>
            <p className="text-xs text-muted-foreground">Button link targets are shown below each button for verification. They will not appear in the live popup.</p>
            <div className="bg-muted/30 border border-border rounded-lg p-4 overflow-y-auto max-h-[700px] sticky top-4" dangerouslySetInnerHTML={{ __html: previewHtml }} />
          </div>
        </div>
      </div>
    );
  }

  // List view
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Manage Specials</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={fetchSpecials}>Refresh</Button>
          <Button size="sm" onClick={startNew}><Plus className="w-4 h-4 mr-2" /> New Special</Button>
        </div>
      </div>

      {!specials.length ? (
        <div className="text-center py-12 space-y-3">
          <p className="text-muted-foreground">No specials yet. Create your first one!</p>
          <Button onClick={startNew}><Plus className="w-4 h-4 mr-2" /> Create Special</Button>
        </div>
      ) : (
        <div className="space-y-3">
          {specials.map((s) => (
            <div key={s.id} className="bg-card border border-border rounded-lg p-4 flex items-center gap-4">
              <GripVertical className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-foreground truncate">{s.title}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${s.is_active ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" : "bg-muted text-muted-foreground"}`}>
                    {s.is_active ? "Active" : "Draft"}
                  </span>
                </div>
                {s.highlight_text && <p className="text-sm text-accent truncate">{s.highlight_text}</p>}
                <p className="text-xs text-muted-foreground">Updated {new Date(s.updated_at).toLocaleDateString()}</p>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <Button variant="ghost" size="sm" onClick={() => toggleActive(s)} title={s.is_active ? "Deactivate" : "Activate"}>
                  {s.is_active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
                <Button variant="ghost" size="sm" onClick={() => startEdit(s)}>Edit</Button>
                <Button variant="ghost" size="sm" onClick={() => handleDelete(s.id)} className="text-destructive hover:text-destructive">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SpecialsManager;
