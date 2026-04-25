import React from "react";
import { 
  ShieldCheck, 
  MapPin, 
  Clock, 
  CreditCard, 
  Info, 
  ExternalLink, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle,
  Map as MapIcon
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const ILP_STATES = {
  ARUNACHAL_PRADESH: {
    name: "Arunachal Pradesh",
    ilpRequired: true,
    applyOnline: true,
    onlineUrl: "https://arunachalilp.com",
    processingDays: "1-3 days (online), same day (on arrival for some checkpoints)",
    fee: "₹100 for Indians, foreigners need Protected Area Permit (PAP) additionally",
    validity: "15 days, extendable",
    availableAt: ["Online portal", "Deputy Commissioner offices", "State borders at Bhalukpong, Dirang, Itanagar"],
    restrictions: ["Cannot stay in restricted tribal zones without additional RAP"],
    tips: "Apply at least 3 days before travel for safety buffer."
  },
  NAGALAND: {
    name: "Nagaland",
    ilpRequired: true,
    applyOnline: true,
    onlineUrl: "https://www.ilp.nagaland.gov.in/",
    processingDays: "1-2 days (online)",
    fee: "₹50 - ₹100 depending on duration",
    validity: "15 days to 30 days",
    availableAt: ["Online portal", "Nagaland House in Delhi/Kolkata", "Dimapur Checkpoint"],
    restrictions: ["Foreigners need to register at nearest Police Station within 24h"],
    tips: "Keep multiple physical copies as checkpoints are frequent."
  },
  MIZORAM: {
    name: "Mizoram",
    ilpRequired: true,
    applyOnline: true,
    onlineUrl: "https://mizoram.gov.in/government/inner-line-permit-ilp",
    processingDays: "2-3 business days",
    fee: "₹20 (Temporary) to ₹200 (Regular)",
    validity: "15 days (Temporary)",
    availableAt: ["Lunglei/Aizawl DC offices", "Lengpui Airport", "Silchar/Guwahati Mizoram House"],
    restrictions: ["Photography restricted in certain border zones"],
    tips: "Getting it at Lengpui Airport on arrival is the fastest for air travelers."
  },
  MANIPUR: {
    name: "Manipur",
    ilpRequired: true,
    applyOnline: true,
    onlineUrl: "https://manipurilp.gov.in/",
    processingDays: "1-2 days",
    fee: "₹100 for temporary permit",
    validity: "15 days (extendable)",
    availableAt: ["Online portal", "Mao Gate", "Jiribam", "Imphal Airport"],
    restrictions: ["Valid for tourist purposes only; employment needs separate labor permit"],
    tips: "Ensure your ID matches the one used in the online application exactly."
  }
};

const NON_ILP_STATES = [
  { name: "Assam", note: "Gate to the Northeast. No permits required for Indian citizens." },
  { name: "Meghalaya", note: "The Abode of Clouds. Fully open to all travelers without ILP." },
  { name: "Tripura", note: "Historic palaces and temples. No entry permits needed." },
  { name: "Sikkim", note: "ILP not required for Indians (except for restricted border zones like Nathula/Tsomgo which need local permits)." }
];

const FAQS = [
  { q: "What exactly is an Inner Line Permit (ILP)?", a: "It's an official travel document issued by the Government of India to allow inward travel of an Indian citizen into a protected area for a limited period." },
  { q: "Do I need an ILP if I'm an Indian citizen?", a: "Yes, even if you are an Indian citizen, you need an ILP for the four states listed above if you are not a resident of that state." },
  { q: "Can foreigners travel on an ILP?", a: "No. Foreigners need a Protected Area Permit (PAP) or Restricted Area Permit (RAP) instead of an ILP. The process is handled by the Ministry of Home Affairs." },
  { q: "What documents are required for an ILP?", a: "Generally, a valid government ID (Aadhar, Voter ID, Passport, or DL) and a passport-sized photograph are all you need for an online application." },
  { q: "Can I get an ILP on arrival?", a: "In most states, yes, but only at major transit points like airports (Imphal, Lengpui) or major railheads. Online is always recommended to avoid long queues." },
  { q: "Is the ILP valid for all districts in a state?", a: "Usually yes, but some specific border villages or high-altitude military zones might require additional local permissions from the army or DC office." },
  { q: "Do children need a separate ILP?", a: "Children below 12-14 years can often be included in their parent's permit, but it's safer to check the specific state portal as rules vary slightly." },
  { q: "What happens if I stay beyond the validity?", a: "Overstaying is a legal offense. You should visit the nearest Deputy Commissioner (DC) office to apply for an extension before your current permit expires." }
];

export default function ILPGuidePage() {
  return (
    <main className="min-h-screen bg-[#FDFCFB]">
      {/* Hero Section */}
      <section className="bg-[#1A3D2B] text-white py-20 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <Badge className="bg-[#2d6a49] hover:bg-[#2d6a49] border-none px-4 py-1 text-sm">Official Travel Guide</Badge>
          <h1 className="text-4xl md:text-6xl font-serif font-bold tracking-tight">
            Inner Line Permit Guide
          </h1>
          <p className="text-xl text-emerald-100/80 max-w-2xl mx-auto">
            Everything you need to cross into India&apos;s most protected territories and experience their pristine culture.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-5xl mx-auto py-16 px-6 -mt-12">
        <div className="grid gap-8">
          {/* ILP States */}
          <div className="space-y-8">
            <div className="flex items-center gap-3 border-b pb-4">
              <ShieldCheck className="h-6 w-6 text-[#2d6a49]" />
              <h2 className="text-2xl font-bold text-[#1A3D2B]">States Requiring Permit</h2>
            </div>

            <div className="grid gap-6">
              {Object.entries(ILP_STATES).map(([key, state]) => (
                <details key={key} className="group bg-white rounded-2xl border shadow-sm hover:shadow-md transition-all overflow-hidden">
                  <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-emerald-50 flex items-center justify-center text-[#2d6a49]">
                        <MapPin className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-[#1A3D2B]">{state.name}</h3>
                        <div className="flex gap-2 mt-1">
                          {state.applyOnline && <Badge variant="outline" className="text-[10px] bg-blue-50 text-blue-700 border-blue-200 uppercase">Online Available</Badge>}
                          <Badge variant="outline" className="text-[10px] bg-emerald-50 text-emerald-700 border-emerald-200 uppercase">ILP Required</Badge>
                        </div>
                      </div>
                    </div>
                    <div className="text-muted-foreground group-open:rotate-180 transition-transform">
                      <ArrowRight className="h-5 w-5 rotate-90" />
                    </div>
                  </summary>
                  
                  <div className="p-6 pt-0 border-t bg-emerald-50/30">
                    <div className="grid md:grid-cols-2 gap-8 py-4">
                      <div className="space-y-4">
                        <div className="flex gap-3">
                          <Clock className="h-5 w-5 text-[#2d6a49] shrink-0" />
                          <div>
                            <p className="text-sm font-bold uppercase text-muted-foreground tracking-wider">Processing Time</p>
                            <p className="text-[#1A3D2B]">{state.processingDays}</p>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <CreditCard className="h-5 w-5 text-[#2d6a49] shrink-0" />
                          <div>
                            <p className="text-sm font-bold uppercase text-muted-foreground tracking-wider">Application Fee</p>
                            <p className="text-[#1A3D2B]">{state.fee}</p>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <Info className="h-5 w-5 text-[#2d6a49] shrink-0" />
                          <div>
                            <p className="text-sm font-bold uppercase text-muted-foreground tracking-wider">Where to Apply</p>
                            <ul className="list-disc list-inside text-sm text-[#1A3D2B]/80 mt-1">
                              {state.availableAt.map(item => <li key={item}>{item}</li>)}
                            </ul>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl">
                          <div className="flex gap-2 items-center text-amber-800 mb-1">
                            <AlertTriangle className="h-4 w-4" />
                            <p className="text-xs font-bold uppercase">Restrictions</p>
                          </div>
                          <p className="text-sm text-amber-900/80">{state.restrictions[0]}</p>
                        </div>
                        
                        <div className="bg-[#2d6a49] text-white p-4 rounded-xl">
                          <p className="text-xs font-bold uppercase opacity-80 mb-1">Pro Tip</p>
                          <p className="text-sm">{state.tips}</p>
                        </div>

                        {state.applyOnline && (
                          <a 
                            href={state.onlineUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex w-full items-center justify-center gap-2 bg-[#1A3D2B] text-white py-3 rounded-xl font-bold hover:bg-[#1A3D2B]/90 transition-colors"
                          >
                            Apply for {state.name} ILP <ExternalLink className="h-4 w-4" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </details>
              ))}
            </div>
          </div>

          {/* Open States */}
          <div className="space-y-6 pt-8">
            <div className="flex items-center gap-3 border-b pb-4">
              <CheckCircle2 className="h-6 w-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-[#1A3D2B]">Open Access States</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {NON_ILP_STATES.map(state => (
                <div key={state.name} className="p-4 bg-white rounded-xl border border-blue-100 shadow-sm flex gap-4 items-start">
                  <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                    <MapIcon className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#1A3D2B]">{state.name}</h4>
                    <p className="text-xs text-muted-foreground mt-1">{state.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ Section */}
          <div className="space-y-8 pt-16">
            <h2 className="text-3xl font-serif font-bold text-center text-[#1A3D2B]">Frequently Asked Questions</h2>
            <div className="grid md:grid-cols-2 gap-x-12 gap-y-8">
              {FAQS.map((faq, i) => (
                <div key={i} className="space-y-2">
                  <h4 className="font-bold text-[#1A3D2B] flex gap-2">
                    <span className="text-[#2d6a49]">Q.</span> {faq.q}
                  </h4>
                  <p className="text-sm text-muted-foreground pl-6 border-l-2 border-emerald-100 italic">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="mt-20 p-12 bg-emerald-50 rounded-3xl text-center space-y-6 border border-emerald-100">
            <h2 className="text-3xl font-serif font-bold text-[#1A3D2B]">Ready for an off-grid adventure?</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Now that you have the permit information, discover hidden tribal communities and sustainable homestays in these protected states.
            </p>
            <div className="flex justify-center">
              <Link href="/explore?ilpRequired=true">
                <Button size="lg" className="bg-[#1A3D2B] hover:bg-[#1A3D2B]/90 h-14 px-8 text-lg rounded-full">
                  Find Communities in ILP States <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Disclaimer */}
      <footer className="bg-white border-t py-12 px-6 text-center">
        <p className="text-xs text-muted-foreground max-w-2xl mx-auto uppercase tracking-widest leading-relaxed">
          Disclaimer: Information provided is for guidance only. Permit rules, fees, and processing times are subject to government changes. Always check the official state portal before your journey.
        </p>
      </footer>
    </main>
  );
}
