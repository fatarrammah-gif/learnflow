import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { StepIndicator } from "@/components/onboarding/StepIndicator";
import { CriteriaList } from "@/components/onboarding/CriteriaList";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useGoalStore } from "@/store/goalStore";
import { goalsApi } from "@/api/goals";
import { criteriaApi } from "@/api/criteria";
import { LEVELS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { X, Loader2, Sprout, Zap, Flame } from "lucide-react";
import type { Level } from "@/types/goal";

const LEVEL_ICONS = { beginner: Sprout, intermediate: Zap, expert: Flame } as const;

const STEP_LABELS = ["Goal", "Time", "Criteria", "Save"];

export function OnboardingPage() {
  const navigate = useNavigate();
  // useGoalStore() gives us access to the global form state
  const store = useGoalStore();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Local state for step 1 — pre-filled from the store so going Back doesn't lose data
  const [title, setTitle] = useState(store.goalData.title ?? "");
  const [topic, setTopic] = useState(store.goalData.topic_focus ?? "");
  const [level, setLevel] = useState<Level>(store.goalData.level ?? "beginner");
  const [skills, setSkills] = useState<string[]>(store.goalData.skills_tools ?? []);
  const [skillInput, setSkillInput] = useState("");

  // Local state for step 2
  const [weeks, setWeeks] = useState(store.goalData.time_weeks ?? 8);
  const [hpw, setHpw] = useState(store.goalData.hours_per_week ?? 10);

  // Add the skill chip when the user presses Enter or clicks a button
  const addSkill = () => {
    const s = skillInput.trim();
    if (s && !skills.includes(s)) setSkills([...skills, s]);
    setSkillInput("");
  };

  // Move to the next step and save current step's data to the store
  const goNext = () => {
    if (store.currentStep === 1) {
      store.updateGoal({ title, topic_focus: topic, level, skills_tools: skills });
    } else if (store.currentStep === 2) {
      store.updateGoal({ time_weeks: weeks, hours_per_week: hpw });
    }
    store.setStep(store.currentStep + 1);
  };

  // Final step: POST the goal to the backend, then POST each criterion
  const saveGoal = async () => {
    setSaving(true);
    setError("");
    try {
      const goal = await goalsApi.create({
        title: store.goalData.title!,
        level: store.goalData.level!,
        topic_focus: store.goalData.topic_focus ?? "",
        skills_tools: store.goalData.skills_tools ?? [],
        time_weeks: store.goalData.time_weeks!,
        hours_per_week: store.goalData.hours_per_week!,
      });
      store.setSavedGoalId(goal.id);

      // Save each criterion one by one (we use a for loop, not Promise.all, to preserve order)
      for (let i = 0; i < store.localCriteria.length; i++) {
        const c = store.localCriteria[i];
        await criteriaApi.create(goal.id, {
          label: c.label,
          description: c.description,
          sort_order: i,
          is_custom: c.id.startsWith("custom"),  // IDs starting with "custom-" are user-added
        });
      }

      // Navigate to the upload page with the new goal ID in the URL
      navigate(`/upload/${goal.id}`);
    } catch (e: any) {
      setError(e?.response?.data?.detail ?? "Failed to save. Is the backend running?");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-full p-8 max-w-xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-display">
          Set up your goal
        </h1>
        <p className="text-muted-foreground text-sm mt-2">
          Tell us what you want to learn — we'll build a roadmap and find the best YouTube resources.
        </p>
      </div>

      {/* Step progress bar */}
      <StepIndicator total={4} current={store.currentStep} labels={STEP_LABELS} />

      {/* ── Step 1: Goal + Level ── */}
      {store.currentStep === 1 && (
        <div className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium">What do you want to learn?</label>
            <Textarea
              placeholder="e.g. Learn machine learning from scratch using Python and PyTorch"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Topic focus <span className="text-muted-foreground">(optional)</span>
            </label>
            <Input
              placeholder="e.g. Computer Vision, NLP, Deep Learning"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Your current level</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {LEVELS.map((l) => {
                const Icon = LEVEL_ICONS[l.value];
                const isSelected = level === l.value;
                return (
                  <motion.button
                    key={l.value}
                    onClick={() => setLevel(l.value)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={cn(
                      "relative flex flex-col items-center gap-2 px-3 py-4 rounded-lg border transition-all text-center",
                      isSelected
                        ? "border-primary bg-primary/10 shadow-[0_0_16px_0px_hsl(340_82%_52%/0.15)]"
                        : "border-border bg-card hover:border-primary/40 hover:bg-muted"
                    )}
                  >
                    <Icon
                      size={20}
                      className={isSelected ? "text-primary" : "text-muted-foreground"}
                    />
                    <div>
                      <div className={cn(
                        "font-semibold text-sm",
                        isSelected ? "text-primary" : "text-foreground"
                      )}>
                        {l.label}
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">{l.description}</div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Tools & skills to cover <span className="text-muted-foreground">(press Enter)</span>
            </label>
            <Input
              placeholder="e.g. PyTorch, scikit-learn, pandas..."
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();  // Prevent form submission
                  addSkill();
                }
              }}
            />
            {/* Skill chip badges */}
            {skills.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {skills.map((s) => (
                  <Badge key={s} variant="secondary" className="gap-1">
                    {s}
                    <button
                      onClick={() => setSkills(skills.filter((x) => x !== s))}
                      className="hover:text-destructive"
                    >
                      <X size={11} />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <Button onClick={goNext} disabled={title.length < 3} className="w-full">
            Continue →
          </Button>
        </div>
      )}

      {/* ── Step 2: Time ── */}
      {store.currentStep === 2 && (
        <div className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium">How many weeks do you have?</label>
            <Input
              type="number"
              min={1}
              max={52}
              value={weeks}
              onChange={(e) => setWeeks(Number(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Hours per week you can dedicate</label>
            <Input
              type="number"
              min={1}
              max={40}
              value={hpw}
              onChange={(e) => setHpw(Number(e.target.value))}
            />
          </div>
          {/* Total hours display — uses JetBrains Mono for the number */}
          <div className="rounded-lg border border-border bg-card p-5 text-center">
            <div
              className="text-5xl font-bold text-primary leading-none font-mono"
            >
              {weeks * hpw}
              <span className="text-2xl ml-1 text-primary/70">h</span>
            </div>
            <div className="text-xs text-muted-foreground mt-2 tracking-wide uppercase">
              {weeks} weeks · {hpw}h / week
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => store.setStep(1)} className="flex-1">← Back</Button>
            <Button onClick={goNext} className="flex-1">Continue →</Button>
          </div>
        </div>
      )}

      {/* ── Step 3: Criteria ── */}
      {store.currentStep === 3 && (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            These are used to score YouTube videos. Drag to reorder by importance (top = most important).
            Delete ones you don't need, or add your own.
          </p>
          {/* CriteriaList reads/writes localCriteria from the store */}
          <CriteriaList criteria={store.localCriteria} onChange={store.setLocalCriteria} />
          <div className="flex gap-3 pt-2">
            <Button variant="outline" onClick={() => store.setStep(2)} className="flex-1">← Back</Button>
            <Button onClick={goNext} disabled={store.localCriteria.length === 0} className="flex-1">
              Continue →
            </Button>
          </div>
        </div>
      )}

      {/* ── Step 4: Summary + Save ── */}
      {store.currentStep === 4 && (
        <div className="space-y-4">
          {/* Summary card — two columns of key facts */}
          <div className="rounded-lg border border-border bg-card p-5 space-y-4">
            <p className="text-xs text-muted-foreground uppercase tracking-widest font-display">
              Ready to generate
            </p>
            <p className="text-foreground font-medium leading-snug">{store.goalData.title}</p>
            <div className="grid grid-cols-3 gap-3 pt-1">
              <div className="text-center">
                <div
                  className="text-2xl font-bold text-primary font-mono"
                >
                  {store.goalData.time_weeks}
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">weeks</div>
              </div>
              <div className="text-center">
                <div
                  className="text-2xl font-bold text-primary font-mono"
                >
                  {store.goalData.hours_per_week}
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">hrs / week</div>
              </div>
              <div className="text-center">
                <div
                  className="text-2xl font-bold text-primary font-mono"
                >
                  {store.localCriteria.length}
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">criteria</div>
              </div>
            </div>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <div className="flex gap-3">
            <Button variant="outline" onClick={() => store.setStep(3)} className="flex-1">← Back</Button>
            <Button onClick={saveGoal} disabled={saving} className="flex-1">
              {saving
                ? <><Loader2 size={14} className="animate-spin mr-2" />Saving...</>
                : "Save & continue →"
              }
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
