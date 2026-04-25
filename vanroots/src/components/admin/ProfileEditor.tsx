"use client";

import React, { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import dynamic from "next/dynamic";
import { CldUploadWidget } from "next-cloudinary";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, MapPin, Save, Image as ImageIcon, Loader2 } from "lucide-react";

// Types from Prisma (simplified for frontend)
enum NERState {
  ASSAM = "ASSAM",
  ARUNACHAL_PRADESH = "ARUNACHAL_PRADESH",
  NAGALAND = "NAGALAND",
  MANIPUR = "MANIPUR",
  MEGHALAYA = "MEGHALAYA",
  MIZORAM = "MIZORAM",
  TRIPURA = "TRIPURA",
  SIKKIM = "SIKKIM",
}

enum ExperienceType {
  ECO = "ECO",
  CULTURAL = "CULTURAL",
  CULINARY = "CULINARY",
  ADVENTURE = "ADVENTURE",
  SPIRITUAL = "SPIRITUAL",
}

// Dynamic Map Import
const MapPicker = dynamic(() => import("./MapPicker"), { 
  ssr: false,
  loading: () => <div className="h-[400px] w-full bg-muted animate-pulse flex items-center justify-center text-muted-foreground">Loading Map...</div>
});

// Zod Schema
const communitySchema = z.object({
  name: z.string().min(2, "Name is required"),
  shortDesc: z.string().max(500, "Too long"),
  longDesc: z.string().optional(),
  primaryLanguage: z.string().optional(),
  population: z.number().optional(),
  ilpRequired: z.boolean().default(false),
  experienceTypes: z.array(z.string()).default([]),
  coverImageUrl: z.string().optional(),
  latitude: z.number(),
  longitude: z.number(),
  content: z.array(z.object({
    id: z.string().optional(),
    contentType: z.string(),
    title: z.string(),
    body: z.any(), // Json
    featured: z.boolean().default(false),
  })).default([]),
  people: z.array(z.object({
    id: z.string().optional(),
    name: z.string(),
    role: z.string(),
    photoUrl: z.string().optional(),
    quote: z.string().optional(),
    featured: z.boolean().default(false),
  })).default([]),
  accommodations: z.array(z.object({
    id: z.string().optional(),
    name: z.string(),
    type: z.string(),
    contact: z.string().optional(),
    externalUrl: z.string().optional(),
  })).default([]),
});

type CommunityFormValues = z.infer<typeof communitySchema>;

interface ProfileEditorProps {
  communityId: string;
  initialData: any; // Using any for initial data flexibility
}

export default function ProfileEditor({ communityId, initialData }: ProfileEditorProps) {
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<CommunityFormValues>({
    resolver: zodResolver(communitySchema),
    defaultValues: {
      ...initialData,
      latitude: initialData.latitude || 26.14,
      longitude: initialData.longitude || 91.73,
    },
  });

  // Field Arrays for Dynamic Lists
  const { fields: contentFields, append: appendContent, remove: removeContent } = useFieldArray({
    control: form.control,
    name: "content",
  });

  const { fields: peopleFields, append: appendPerson, remove: removePerson } = useFieldArray({
    control: form.control,
    name: "people",
  });

  const { fields: accommodationFields, append: appendAccommodation, remove: removeAccommodation } = useFieldArray({
    control: form.control,
    name: "accommodations",
  });

  // TipTap Setup
  const editor = useEditor({
    extensions: [StarterKit, Image],
    content: initialData.longDesc || "",
    onUpdate: ({ editor }) => {
      form.setValue("longDesc", editor.getHTML());
    },
  });

  async function onSave(data: Partial<CommunityFormValues>) {
    setIsSaving(true);
    try {
      const response = await fetch(`/api/communities/${communityId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to save");
      
      // Assuming a global toast or similar is available
      console.log("Success: Profile updated");
      alert("Success: Profile updated"); 
    } catch (error) {
      console.error(error);
      alert("Error: Failed to save changes");
    } finally {
      setIsSaving(false);
    }
  }

  const experienceOptions = Object.values(ExperienceType);

  return (
    <Card className="w-full max-w-6xl mx-auto overflow-hidden">
      <form onSubmit={(e) => e.preventDefault()}>
        <Tabs defaultValue="basic" className="w-full">
          <div className="bg-muted/50 p-4 border-b">
            <TabsList className="grid grid-cols-3 md:grid-cols-6 w-full">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="location">Location</TabsTrigger>
              <TabsTrigger value="culture">Culture</TabsTrigger>
              <TabsTrigger value="food">Food & Folklore</TabsTrigger>
              <TabsTrigger value="people">People</TabsTrigger>
              <TabsTrigger value="accommodation">Stays</TabsTrigger>
            </TabsList>
          </div>

          <div className="p-6">
            {/* Tab 1: Basic Info */}
            <TabsContent value="basic" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Community Name</Label>
                    <Input id="name" {...form.register("name")} />
                  </div>
                  <div>
                    <Label htmlFor="shortDesc">Short Description</Label>
                    <Textarea id="shortDesc" {...form.register("shortDesc")} rows={3} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="primaryLanguage">Primary Language</Label>
                      <Input id="primaryLanguage" {...form.register("primaryLanguage")} />
                    </div>
                    <div>
                      <Label htmlFor="population">Population</Label>
                      <Input 
                        id="population" 
                        type="number" 
                        {...form.register("population", { valueAsNumber: true })} 
                      />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="ilp" 
                      checked={form.watch("ilpRequired")} 
                      onCheckedChange={(val) => form.setValue("ilpRequired", val)} 
                    />
                    <Label htmlFor="ilp">Inner Line Permit (ILP) Required</Label>
                  </div>
                </div>

                <div className="space-y-4">
                  <Label>Cover Image</Label>
                  <div className="border-2 border-dashed rounded-lg p-4 text-center">
                    {form.watch("coverImageUrl") ? (
                      <div className="relative aspect-video rounded overflow-hidden mb-2">
                        <img 
                          src={form.watch("coverImageUrl")} 
                          alt="Cover" 
                          className="object-cover w-full h-full"
                        />
                        <Button 
                          variant="destructive" 
                          size="icon" 
                          className="absolute top-2 right-2"
                          onClick={() => form.setValue("coverImageUrl", "")}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="py-8">
                        <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground" />
                        <CldUploadWidget 
                          uploadPreset="vanroots_default"
                          onSuccess={(result: any) => {
                            form.setValue("coverImageUrl", result.info.secure_url);
                          }}
                        >
                          {({ open }) => (
                            <Button variant="outline" onClick={() => open()} className="mt-4">
                              Upload Image
                            </Button>
                          )}
                        </CldUploadWidget>
                      </div>
                    )}
                  </div>

                  <Label>Experience Types</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {experienceOptions.map((type) => (
                      <div key={type} className="flex items-center space-x-2">
                        <Checkbox 
                          id={type} 
                          checked={form.watch("experienceTypes")?.includes(type)}
                          onCheckedChange={(checked) => {
                            const current = form.getValues("experienceTypes") || [];
                            if (checked) {
                              form.setValue("experienceTypes", [...current, type]);
                            } else {
                              form.setValue("experienceTypes", current.filter((t) => t !== type));
                            }
                          }}
                        />
                        <Label htmlFor={type} className="text-sm">{type}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Detailed Story (Long Description)</Label>
                <div className="border rounded-md min-h-[300px] p-2 prose max-w-none">
                  <EditorContent editor={editor} />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button onClick={() => onSave(form.getValues())} disabled={isSaving}>
                  {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  <Save className="mr-2 h-4 w-4" /> Save Basic Info
                </Button>
              </div>
            </TabsContent>

            {/* Tab 2: Location */}
            <TabsContent value="location" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div className="md:col-span-2">
                  <Label>Latitude</Label>
                  <Input 
                    type="number" 
                    step="0.0001" 
                    {...form.register("latitude", { valueAsNumber: true })} 
                  />
                </div>
                <div className="md:col-span-2">
                  <Label>Longitude</Label>
                  <Input 
                    type="number" 
                    step="0.0001" 
                    {...form.register("longitude", { valueAsNumber: true })} 
                  />
                </div>
              </div>
              
              <div className="rounded-lg border overflow-hidden">
                <MapPicker 
                  lat={form.watch("latitude")} 
                  lng={form.watch("longitude")} 
                  onChange={(lat, lng) => {
                    form.setValue("latitude", lat);
                    form.setValue("longitude", lng);
                  }}
                />
              </div>

              <div className="flex justify-end">
                <Button onClick={() => onSave({ latitude: form.getValues("latitude"), longitude: form.getValues("longitude") })} disabled={isSaving}>
                  <Save className="mr-2 h-4 w-4" /> Save Location
                </Button>
              </div>
            </TabsContent>

            {/* Tab 3: Culture (BELIEF & FESTIVAL) */}
            <TabsContent value="culture" className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Cultural Content (Beliefs & Festivals)</h3>
                <Button variant="outline" size="sm" onClick={() => appendContent({ contentType: "BELIEF", title: "", body: "" })}>
                  <Plus className="mr-2 h-4 w-4" /> Add Item
                </Button>
              </div>

              <div className="space-y-4">
                {contentFields.map((field, index) => {
                  const type = form.watch(`content.${index}.contentType`);
                  if (type !== "BELIEF" && type !== "FESTIVAL") return null;

                  return (
                    <Card key={field.id} className="p-4 border">
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                        <div className="md:col-span-3">
                          <Label>Type</Label>
                          <Select 
                            value={type} 
                            onValueChange={(val) => form.setValue(`content.${index}.contentType`, val)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="BELIEF">Belief</SelectItem>
                              <SelectItem value="FESTIVAL">Festival</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="md:col-span-8">
                          <Label>Title</Label>
                          <Input {...form.register(`content.${index}.title`)} />
                        </div>
                        <div className="md:col-span-1 flex items-end">
                          <Button variant="ghost" size="icon" onClick={() => removeContent(index)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>

              <div className="flex justify-end">
                <Button onClick={() => onSave({ content: form.getValues("content") })} disabled={isSaving}>
                  <Save className="mr-2 h-4 w-4" /> Save Culture
                </Button>
              </div>
            </TabsContent>

            {/* Tab 4: Food & Folklore (FOOD & FOLKLORE) */}
            <TabsContent value="food" className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Food & Folklore</h3>
                <Button variant="outline" size="sm" onClick={() => appendContent({ contentType: "FOOD", title: "", body: "" })}>
                  <Plus className="mr-2 h-4 w-4" /> Add Item
                </Button>
              </div>

              <div className="space-y-4">
                {contentFields.map((field, index) => {
                  const type = form.watch(`content.${index}.contentType`);
                  if (type !== "FOOD" && type !== "FOLKLORE") return null;

                  return (
                    <Card key={field.id} className="p-4 border">
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                        <div className="md:col-span-3">
                          <Label>Type</Label>
                          <Select 
                            value={type} 
                            onValueChange={(val) => form.setValue(`content.${index}.contentType`, val)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="FOOD">Food</SelectItem>
                              <SelectItem value="FOLKLORE">Folklore</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="md:col-span-8">
                          <Label>Title</Label>
                          <Input {...form.register(`content.${index}.title`)} />
                        </div>
                        <div className="md:col-span-1 flex items-end">
                          <Button variant="ghost" size="icon" onClick={() => removeContent(index)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>

              <div className="flex justify-end">
                <Button onClick={() => onSave({ content: form.getValues("content") })} disabled={isSaving}>
                  <Save className="mr-2 h-4 w-4" /> Save Food & Folklore
                </Button>
              </div>
            </TabsContent>

            {/* Tab 5: People */}
            <TabsContent value="people" className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Community Members</h3>
                <Button variant="outline" size="sm" onClick={() => appendPerson({ name: "", role: "" })}>
                  <Plus className="mr-2 h-4 w-4" /> Add Person
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {peopleFields.map((field, index) => (
                  <Card key={field.id} className="p-4 relative">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="absolute top-2 right-2"
                      onClick={() => removePerson(index)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                    <div className="space-y-3">
                      <div className="flex items-center gap-4">
                        <div className="h-16 w-16 bg-muted rounded-full overflow-hidden flex-shrink-0">
                          {form.watch(`people.${index}.photoUrl`) ? (
                            <img src={form.watch(`people.${index}.photoUrl`)} className="object-cover h-full w-full" />
                          ) : (
                            <CldUploadWidget 
                              uploadPreset="vanroots_default"
                              onSuccess={(result: any) => form.setValue(`people.${index}.photoUrl`, result.info.secure_url)}
                            >
                              {({ open }) => (
                                <button onClick={() => open()} className="h-full w-full flex items-center justify-center">
                                  <Plus className="h-4 w-4" />
                                </button>
                              )}
                            </CldUploadWidget>
                          )}
                        </div>
                        <div className="flex-grow">
                          <Label>Name</Label>
                          <Input {...form.register(`people.${index}.name`)} />
                        </div>
                      </div>
                      <div>
                        <Label>Role</Label>
                        <Input {...form.register(`people.${index}.role`)} />
                      </div>
                      <div>
                        <Label>Quote</Label>
                        <Textarea {...form.register(`people.${index}.quote`)} rows={2} />
                      </div>
                      <div className="flex items-center space-x-2 pt-2">
                        <Switch 
                          id={`featured-p-${index}`} 
                          checked={form.watch(`people.${index}.featured`)}
                          onCheckedChange={(val) => form.setValue(`people.${index}.featured`, val)}
                        />
                        <Label htmlFor={`featured-p-${index}`}>Featured</Label>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              <div className="flex justify-end">
                <Button onClick={() => onSave({ people: form.getValues("people") })} disabled={isSaving}>
                  <Save className="mr-2 h-4 w-4" /> Save People
                </Button>
              </div>
            </TabsContent>

            {/* Tab 6: Accommodation */}
            <TabsContent value="accommodation" className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Stay & Accommodations</h3>
                <Button variant="outline" size="sm" onClick={() => appendAccommodation({ name: "", type: "HOMESTAY" })}>
                  <Plus className="mr-2 h-4 w-4" /> Add Stay
                </Button>
              </div>

              <div className="space-y-4">
                {accommodationFields.map((field, index) => (
                  <Card key={field.id} className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <Label>Name</Label>
                        <Input {...form.register(`accommodations.${index}.name`)} />
                      </div>
                      <div>
                        <Label>Type</Label>
                        <Select 
                          value={form.watch(`accommodations.${index}.type`)} 
                          onValueChange={(val) => form.setValue(`accommodations.${index}.type`, val)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="HOMESTAY">Homestay</SelectItem>
                            <SelectItem value="GUESTHOUSE">Guesthouse</SelectItem>
                            <SelectItem value="RESORT">Resort</SelectItem>
                            <SelectItem value="CAMP">Camp</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Contact Info</Label>
                        <Input {...form.register(`accommodations.${index}.contact`)} />
                      </div>
                      <div className="flex items-end gap-2">
                        <div className="flex-grow">
                          <Label>External Link</Label>
                          <Input {...form.register(`accommodations.${index}.externalUrl`)} />
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => removeAccommodation(index)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              <div className="flex justify-end">
                <Button onClick={() => onSave({ accommodations: form.getValues("accommodations") })} disabled={isSaving}>
                  <Save className="mr-2 h-4 w-4" /> Save Stays
                </Button>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </form>
    </Card>
  );
}
