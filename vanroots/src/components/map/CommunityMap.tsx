"use client";

import React, { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { 
  Search, 
  Map as MapIcon, 
  List, 
  ChevronDown, 
  Star,
  Info,
  ExternalLink,
  X
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { NERState } from "@prisma/client";
import "leaflet/dist/leaflet.css";

// Dynamic import for Leaflet to avoid SSR issues
const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then((mod) => mod.Marker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), { ssr: false });

interface Community {
  id: string;
  slug: string;
  name: string;
  latitude: number;
  longitude: number;
  state: string;
  experienceTypes: string[];
  ilpRequired: boolean;
  rating: number;
  coverImageUrl: string;
  shortDesc: string;
}

interface CommunityMapProps {
  communities: Community[];
  onCommunitySelect?: (slug: string) => void;
  selectedSlug?: string;
}

export default function CommunityMap({ communities, onCommunitySelect, selectedSlug }: CommunityMapProps) {
  const [search, setSearch] = useState("");
  const [selectedStates, setSelectedStates] = useState<string[]>([]);
  const [ilpOnly, setIlpOnly] = useState(false);
  const [viewMode, setViewMode] = useState<"split" | "map" | "list">("split");

  // Filtering logic
  const filteredCommunities = useMemo(() => {
    return communities.filter((c) => {
      const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) || 
                            c.state.toLowerCase().includes(search.toLowerCase());
      const matchesState = selectedStates.length === 0 || selectedStates.includes(c.state);
      const matchesIlp = !ilpOnly || c.ilpRequired;
      return matchesSearch && matchesState && matchesIlp;
    });
  }, [communities, search, selectedStates, ilpOnly]);

  return (
    <div className="flex flex-col h-screen bg-white overflow-hidden pt-16">
      {/* Header / Filter Bar */}
      <div className="h-16 border-b px-6 flex items-center justify-between gap-4 bg-white z-40">
        <div className="flex items-center gap-3 flex-1 max-w-xl">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input 
              type="text" 
              placeholder="Search states or villages..." 
              className="w-full h-10 pl-10 pr-4 rounded-full border border-neutral-200 text-sm focus:outline-none focus:ring-1 focus:ring-black"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <div className="hidden md:flex gap-2">
             <Button variant="outline" className="rounded-full h-10 border-neutral-200 text-xs font-bold flex gap-2">
               STATE <ChevronDown className="w-3 h-3" />
             </Button>
             <Button variant="outline" className="rounded-full h-10 border-neutral-200 text-xs font-bold flex gap-2">
               EXPERIENCE <ChevronDown className="w-3 h-3" />
             </Button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 mr-4">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">ILP Required</span>
            <Switch checked={ilpOnly} onCheckedChange={setIlpOnly} />
          </div>

          <div className="flex bg-neutral-100 p-1 rounded-full">
            <button 
              onClick={() => setViewMode("split")}
              className={`p-1.5 rounded-full transition-all ${viewMode === "split" ? "bg-white shadow-sm" : "text-neutral-400"}`}
            >
              <div className="flex gap-1">
                 <MapIcon className="w-4 h-4" />
                 <List className="w-4 h-4" />
              </div>
            </button>
            <button 
              onClick={() => setViewMode("map")}
              className={`p-1.5 rounded-full transition-all ${viewMode === "map" ? "bg-white shadow-sm" : "text-neutral-400"}`}
            >
              <MapIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Side: Map */}
        <div className={`transition-all duration-500 bg-neutral-100 relative ${
          viewMode === "map" ? "w-full" : viewMode === "list" ? "w-0" : "w-[60%]"
        }`}>
          {typeof window !== "undefined" && (
            <MapContainer
              center={[26.0, 92.5]}
              zoom={7}
              scrollWheelZoom={true}
              style={{ height: "100%", width: "100%" }}
              zoomControl={false}
            >
              <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
              
              {filteredCommunities.map((c) => (
                <Marker 
                  key={c.id} 
                  position={[c.latitude, c.longitude]}
                >
                  <Popup className="real-estate-popup">
                    <div className="w-64 overflow-hidden rounded-xl border-none">
                      <img src={c.coverImageUrl} className="w-full h-32 object-cover" alt={c.name} />
                      <div className="p-4 space-y-1">
                        <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-[1px]">{c.state} · {c.experienceTypes[0]}</p>
                        <h4 className="font-bold text-lg leading-none">{c.name}</h4>
                        <div className="flex items-center gap-1 text-xs font-bold pt-2">
                           <Star className="w-3 h-3 fill-black" />
                           <span>{c.rating}</span>
                        </div>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          )}
          
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-40 bg-white px-6 py-3 rounded-full shadow-2xl border flex items-center gap-2">
             <span className="text-xs font-bold tracking-tight">{filteredCommunities.length} COMMUNITIES FOUND</span>
          </div>
        </div>

        {/* Right Side: List/Grid */}
        <div className={`transition-all duration-500 overflow-y-auto px-6 py-8 ${
          viewMode === "list" ? "w-full" : viewMode === "map" ? "w-0" : "w-[40%]"
        }`}>
          <div className={`grid gap-12 ${viewMode === "list" ? "md:grid-cols-3 lg:grid-cols-4" : "grid-cols-1"}`}>
            {filteredCommunities.map((c) => (
              <div 
                key={c.id} 
                className="group cursor-pointer"
                onMouseEnter={() => onCommunitySelect?.(c.slug)}
              >
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-4 bg-neutral-100">
                  <img 
                    src={c.coverImageUrl} 
                    alt={c.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                  {c.ilpRequired && (
                    <Badge className="absolute top-4 left-4 bg-black text-white text-[9px] font-bold tracking-widest px-2 py-0.5 rounded-sm">
                      ILP REQ
                    </Badge>
                  )}
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-bold tracking-tight">{c.name}</h3>
                    <div className="flex items-center gap-1 text-xs font-bold">
                       <Star className="w-3 h-3 fill-black" />
                       <span>{c.rating}</span>
                    </div>
                  </div>
                  <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest leading-none">
                    {c.state} · {c.experienceTypes.join(" · ")}
                  </p>
                  <p className="text-sm text-neutral-500 pt-2 line-clamp-2 leading-relaxed">
                    {c.shortDesc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx global>{`
        .leaflet-popup-content-wrapper {
          padding: 0 !important;
          border-radius: 16px !important;
          overflow: hidden;
          box-shadow: 0 20px 40px -10px rgba(0,0,0,0.2) !important;
        }
        .leaflet-popup-content {
          margin: 0 !important;
          width: 256px !important;
        }
        .leaflet-popup-tip {
          display: none;
        }
      `}</style>
    </div>
  );
}
