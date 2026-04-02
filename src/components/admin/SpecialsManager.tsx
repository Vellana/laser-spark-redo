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

interface Special {
  id: string;
  title: string;
  body: string;
  highlight_text: string;
  disclaimer: string;
  image_urls: string[];
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

const SpecialsManager = () => {
  const [specials, setSpecials] = useState<Special[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", body: "", highlight_text: "", disclaimer: "", image_urls: [] as string[], is_active: true });
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
    setForm({ title: "", body: "", highlight_text: "", disclaimer: "", image_urls: [], is_active: true });
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
    setSaving(true);
    try {
      const payload = {
        title: form.title.trim(),
        body: form.body,
        highlight_text: form.highlight_text.trim(),
        disclaimer: form.disclaimer.trim(),
        image_urls: form.image_urls,
        is_active: form.is_active,
        updated_at: new Date().toISOString(),
      };

      // If saving as active, deactivate all others first
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
    // If activating, deactivate all others first (only one active at a time)
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

  // Live preview HTML
  const previewHtml = useMemo(() => {
    const title = (form.title || "Special Title").replace(/</g, "&lt;");
    const body = form.body || '<p style="color:#a0aec0;">Your content will appear here...</p>';
    const highlight = form.highlight_text ? `<p style="font-size:20px;font-weight:700;color:#6dbfa0;margin:16px 0;">${form.highlight_text.replace(/</g, "&lt;")}</p>` : "";
    const disclaimer = form.disclaimer ? `<p style="font-size:12px;color:#a0aec0;font-style:italic;margin:12px 0 0;">${form.disclaimer.replace(/</g, "&lt;")}</p>` : "";
    const imgs = form.image_urls.map((u) => `<div style="text-align:center;margin:12px 0;"><img src="${u}" style="max-width:100%;max-height:192px;object-fit:cover;border-radius:8px;box-shadow:0 4px 6px rgba(0,0,0,0.1);" /></div>`).join("");
    return `<div style="max-width:448px;margin:0 auto;background:var(--card, #1a2332);border:1px solid var(--border, #2d3748);border-radius:16px;overflow:hidden;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;padding:32px;">
      <div style="text-align:center;">
        <h3 style="color:var(--foreground, #fff);font-size:24px;margin:0 0 16px;font-weight:700;">${title}</h3>
        <div style="color:var(--foreground, #e2e8f0);font-size:14px;line-height:1.7;">${body}</div>
        ${highlight}
        ${imgs}
        ${disclaimer}
        <div style="border-top:1px solid var(--border, #2d3748);padding-top:16px;margin-top:16px;">
          <p style="font-size:14px;font-weight:500;color:var(--foreground, #e2e8f0);margin:0 0 8px;">Get <span style="color:#6dbfa0;font-weight:700;">10% off</span> your next service when you join our email list!</p>
          <p style="font-size:12px;color:#a0aec0;margin:4px 0 12px;">*Cannot be combined with other offers.</p>
          <div style="display:flex;gap:8px;justify-content:center;">
            <div style="flex:1;background:#6dbfa0;color:#fff;text-align:center;padding:8px 16px;border-radius:6px;font-size:14px;font-weight:500;">View Specials</div>
            <div style="flex:1;border:1px solid var(--border, #4a5568);color:var(--foreground, #e2e8f0);text-align:center;padding:8px 16px;border-radius:6px;font-size:14px;">Maybe Later</div>
          </div>
        </div>
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

            <div className="flex items-center gap-4">
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
            <div className="bg-muted/30 border border-border rounded-lg p-4 overflow-y-auto max-h-[600px]" dangerouslySetInnerHTML={{ __html: previewHtml }} />
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
