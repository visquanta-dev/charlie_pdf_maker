"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { LeadEntry, LeadStatus } from "@/lib/types/audit";

const statusConfig: Record<LeadStatus, { label: string; className: string }> = {
  "missed-opportunity": { label: "Missed Opportunity", className: "bg-red-600" },
  "at-risk": { label: "At-Risk", className: "bg-amber-600" },
  "best-practice": { label: "Best Practice", className: "bg-emerald-600" },
};

interface LeadCardProps {
  lead: LeadEntry;
  index: number;
  onUpdate: (lead: LeadEntry) => void;
  onRemove: () => void;
}

export function LeadCard({ lead, index, onUpdate, onRemove }: LeadCardProps) {
  const [expanded, setExpanded] = useState(true);

  function updateField<K extends keyof LeadEntry>(field: K, value: LeadEntry[K]) {
    onUpdate({ ...lead, [field]: value });
  }

  function updateListItem(field: "whatWorkedWell" | "missedOpportunities", i: number, value: string) {
    const list = [...lead[field]];
    list[i] = value;
    onUpdate({ ...lead, [field]: list });
  }

  function addListItem(field: "whatWorkedWell" | "missedOpportunities") {
    onUpdate({ ...lead, [field]: [...lead[field], ""] });
  }

  function removeListItem(field: "whatWorkedWell" | "missedOpportunities", i: number) {
    onUpdate({ ...lead, [field]: lead[field].filter((_, idx) => idx !== i) });
  }

  return (
    <Card className="border-border/50">
      <CardHeader className="flex flex-row items-center justify-between py-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-muted-foreground hover:text-foreground"
          >
            {expanded ? "▼" : "▶"}
          </button>
          <span className="font-medium">
            Lead {index + 1}: {lead.name || "Unnamed"}
          </span>
          <Badge className={statusConfig[lead.status].className}>
            {statusConfig[lead.status].label}
          </Badge>
        </div>
        <Button variant="ghost" size="sm" className="text-destructive" onClick={onRemove}>
          Remove
        </Button>
      </CardHeader>
      {expanded && (
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                value={lead.name}
                onChange={(e) => updateField("name", e.target.value)}
                placeholder="Lead name"
              />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input
                value={lead.phone}
                onChange={(e) => updateField("phone", e.target.value)}
                placeholder="5551234567"
              />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={lead.status}
                onValueChange={(v) => updateField("status", v as LeadStatus)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="missed-opportunity">Missed Opportunity</SelectItem>
                  <SelectItem value="at-risk">At-Risk</SelectItem>
                  <SelectItem value="best-practice">Best Practice</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Status Detail</Label>
              <Input
                value={lead.statusDetail}
                onChange={(e) => updateField("statusDetail", e.target.value)}
                placeholder="High Intent / Price Driven"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Opportunity Summary</Label>
            <Textarea
              value={lead.executiveSummary}
              onChange={(e) => updateField("executiveSummary", e.target.value)}
              rows={3}
              placeholder="Summary of this lead's journey..."
            />
          </div>

          {/* Timeline */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Timeline of Contact</Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  updateField("timeline", [...lead.timeline, { date: "", event: "" }])
                }
              >
                + Entry
              </Button>
            </div>
            {lead.timeline.map((entry, i) => (
              <div key={i} className="flex gap-2">
                <Input
                  className="w-40"
                  value={entry.date}
                  onChange={(e) => {
                    const tl = [...lead.timeline];
                    tl[i] = { ...tl[i], date: e.target.value };
                    updateField("timeline", tl);
                  }}
                  placeholder="MM/DD/YYYY"
                />
                <Input
                  className="flex-1"
                  value={entry.event}
                  onChange={(e) => {
                    const tl = [...lead.timeline];
                    tl[i] = { ...tl[i], event: e.target.value };
                    updateField("timeline", tl);
                  }}
                  placeholder="Event description"
                />
                {lead.timeline.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive"
                    onClick={() =>
                      updateField(
                        "timeline",
                        lead.timeline.filter((_, idx) => idx !== i)
                      )
                    }
                  >
                    ×
                  </Button>
                )}
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <Label>Inflection Point</Label>
            <Textarea
              value={lead.inflectionPoint}
              onChange={(e) => updateField("inflectionPoint", e.target.value)}
              rows={2}
              placeholder="The critical moment where the outcome was determined..."
            />
          </div>

          {/* What Worked Well */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>What Worked Well</Label>
              <Button variant="ghost" size="sm" onClick={() => addListItem("whatWorkedWell")}>
                + Item
              </Button>
            </div>
            {lead.whatWorkedWell.map((item, i) => (
              <div key={i} className="flex gap-2">
                <Input
                  className="flex-1"
                  value={item}
                  onChange={(e) => updateListItem("whatWorkedWell", i, e.target.value)}
                  placeholder="Positive action..."
                />
                {lead.whatWorkedWell.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive"
                    onClick={() => removeListItem("whatWorkedWell", i)}
                  >
                    ×
                  </Button>
                )}
              </div>
            ))}
          </div>

          {/* Missed Opportunities */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Missed Opportunities</Label>
              <Button variant="ghost" size="sm" onClick={() => addListItem("missedOpportunities")}>
                + Item
              </Button>
            </div>
            {lead.missedOpportunities.map((item, i) => (
              <div key={i} className="flex gap-2">
                <Input
                  className="flex-1"
                  value={item}
                  onChange={(e) => updateListItem("missedOpportunities", i, e.target.value)}
                  placeholder="Missed opportunity..."
                />
                {lead.missedOpportunities.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive"
                    onClick={() => removeListItem("missedOpportunities", i)}
                  >
                    ×
                  </Button>
                )}
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <Label>What Should Have Happened</Label>
            <Textarea
              value={lead.whatToDoNext}
              onChange={(e) => updateField("whatToDoNext", e.target.value)}
              rows={2}
              placeholder="What the dealership should have done at the inflection point..."
            />
          </div>

          <div className="space-y-2">
            <Label>Best Practice Quote</Label>
            <Textarea
              value={lead.bestPracticeQuote}
              onChange={(e) => updateField("bestPracticeQuote", e.target.value)}
              rows={2}
              placeholder="Key takeaway quote..."
            />
          </div>
        </CardContent>
      )}
    </Card>
  );
}
