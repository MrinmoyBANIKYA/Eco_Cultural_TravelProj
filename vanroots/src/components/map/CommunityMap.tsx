"use client";

import React, { useState, useMemo, useEffect } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Star, MapPin, Info, ArrowRight } from "lucide-react";

// --- Leaflet Icon Fix ---
if (typeof window !== "undefined") {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  });
}

// --- Types ---
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
  coverImageUrl?: string;
  shortDesc?: string;
}

interface CommunityMapProps {
  communities: Community[];
  onCommunitySelect: (slug: string) => void;
  selectedSlug?: string;
}

// --- Helper: Custom Marker Icon ---
const getMarkerIcon = (type: string, isSelected: boolean) => {
  const colors: Record<string, string> = {
    ECO: "#2d6a49",
    CULTURAL: "#C4793A",
    CULINARY: "#E8B84B",
    ADVENTURE: "#4A90A4",
    DEFAULT: "#1A3D2B",
  };

  const color = colors[type] || colors.DEFAULT;
  const size = isSelected ? 40 : 30;
  const pulseClass = isSelected ? "animate-pulse" : "";

  return L.divIcon({
    className: "custom-div-icon",
    html: `
      <div class="relative ${pulseClass}" style="width: ${size}px; height: ${size}px;">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 21C16 17 20 13.4183 20 9C20 4.58172 16.4183 1 12 1C7.58172 1 4 4.58172 4 9C4 13.4183 8 17 12 21Z" fill="${color}" stroke="white" stroke-width="2"/>
          <circle cx="12" cy="9" r="3" fill="white"/>
        </svg>
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size],
  });
};

// --- Internal Map Component (to be dynamic) ---
const MapContent = ({ communities, onCommunitySelect, selectedSlug }: CommunityMapProps) => {
  const { MapContainer, TileLayer, Marker, Popup, useMap } = require("react-leaflet");

  const [stateFilter, setStateFilter] = useState<string>("ALL");
  const [typesFilter, setTypesFilter] = useState<string[]>([]);
  const [ilpFilter, setIlpFilter] = useState<boolean>(false);

  const filteredCommunities = useMemo(() => {
    return communities.filter((c) => {
      const matchState = stateFilter === "ALL" || c.state === stateFilter;
      const matchType = typesFilter.length === 0 || c.experienceTypes.some((t) => typesFilter.includes(t));
      const matchIlp = !ilpFilter || c.ilpRequired;
      return matchState && matchType && matchIlp;
    });
  }, [communities, stateFilter, typesFilter, ilpFilter]);

  const experienceTypes = ["ECO", "CULTURAL", "CULINARY", "ADVENTURE"];
  const states = ["ASSAM", "ARUNACHAL_PRADESH", "NAGALAND", "MANIPUR", "MEGHALAYA", "MIZORAM", "TRIPURA", "SIKKIM"];

  return (
    <div className="relative w-full h-[600px] rounded-2xl overflow-hidden border shadow-lg">
      {/* Sidebar Filters */}
      <div className="absolute top-4 left-4 z-[1000] w-64 bg-background/90 backdrop-blur-md p-4 rounded-xl shadow-xl border space-y-4 max-h-[calc(100%-2rem)] overflow-y-auto">
        <h3 className="font-semibold text-sm flex items-center gap-2">
          <Info className="h-4 w-4" /> Filter Explorer
        </h3>
        
        <div className="space-y-2">
          <Label className="text-xs uppercase text-muted-foreground font-bold">State</Label>
          <Select value={stateFilter} onValueChange={setStateFilter}>
            <SelectTrigger className="h-8 text-xs">
              <SelectValue placeholder="All States" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All States</SelectItem>
              {states.map(s => <SelectItem key={s} value={s}>{s.replace("_", " ")}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-xs uppercase text-muted-foreground font-bold">Experience Types</Label>
          <div className="grid grid-cols-1 gap-2">
            {experienceTypes.map((type) => (
              <div key={type} className="flex items-center space-x-2">
                <Checkbox 
                  id={`filter-${type}`} 
                  checked={typesFilter.includes(type)}
                  onCheckedChange={(checked) => {
                    setTypesFilter(prev => checked ? [...prev, type] : prev.filter(t => t !== type));
                  }}
                />
                <Label htmlFor={`filter-${type}`} className="text-xs">{type}</Label>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t">
          <Label htmlFor="ilp-filter" className="text-xs font-bold uppercase text-muted-foreground">ILP Required Only</Label>
          <Switch id="ilp-filter" checked={ilpFilter} onCheckedChange={setIlpFilter} />
        </div>

        <div className="pt-2 text-[10px] text-muted-foreground italic">
          Showing {filteredCommunities.length} communities
        </div>
      </div>

      {/* Map */}
      <MapContainer 
        center={[26.0, 92.5]} 
        zoom={7} 
        className="w-full h-full"
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />

        {filteredCommunities.map((community) => {
          const isSelected = community.slug === selectedSlug;
          const primaryType = community.experienceTypes[0] || "DEFAULT";

          return (
            <Marker
              key={community.id}
              position={[community.latitude, community.longitude]}
              icon={getMarkerIcon(primaryType, isSelected)}
              eventHandlers={{
                click: () => onCommunitySelect(community.slug),
              }}
            >
              <Popup className="custom-popup">
                <div className="w-64 p-0">
                  {community.coverImageUrl && (
                    <img 
                      src={community.coverImageUrl} 
                      alt={community.name} 
                      className="w-full h-32 object-cover rounded-t-lg"
                    />
                  )}
                  <div className="p-3 space-y-2">
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-sm m-0 leading-tight">{community.name}</h4>
                      <div className="flex items-center gap-1 text-amber-500 text-xs">
                        <Star className="h-3 w-3 fill-current" />
                        <span>{community.rating}</span>
                      </div>
                    </div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">{community.state.replace("_", " ")}</p>
                    <p className="text-xs text-muted-foreground line-clamp-2">{community.shortDesc}</p>
                    
                    <div className="flex flex-wrap gap-1">
                      {community.experienceTypes.slice(0, 2).map(t => (
                        <Badge key={t} variant="outline" className="text-[9px] px-1 py-0">{t}</Badge>
                      ))}
                      {community.ilpRequired && (
                        <Badge variant="destructive" className="text-[9px] px-1 py-0">ILP</Badge>
                      )}
                    </div>

                    <button 
                      onClick={() => onCommunitySelect(community.slug)}
                      className="w-full mt-2 bg-primary text-primary-foreground py-1.5 rounded-md text-xs font-medium flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors"
                    >
                      View Community <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

// --- Dynamic Export ---
const CommunityMap = dynamic(() => Promise.resolve(MapContent), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[600px] bg-muted animate-pulse rounded-2xl flex items-center justify-center text-muted-foreground border">
      <div className="flex flex-col items-center gap-4">
        <MapPin className="h-12 w-12 animate-bounce" />
        <p className="font-medium">Loading VanRoots Map...</p>
      </div>
    </div>
  )
});

export default CommunityMap;
