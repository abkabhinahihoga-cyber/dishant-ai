"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  BookOpen,
  Calendar,
  CheckSquare,
  Plus,
  Trash2,
  Clock,
  ArrowRight,
  LayoutGrid,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";

// ─── Types ───────────────────────────────────────────────────────────────────

type Priority = "low" | "medium" | "high";
type Status = "todo" | "inprogress" | "done";

interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string; // YYYY-MM-DD
  priority: Priority;
  status: Status;
  createdAt: number;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const priorityConfig: Record<Priority, { label: string; color: string; bg: string }> = {
  low: { label: "Low", color: "text-emerald-400", bg: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
  medium: { label: "Medium", color: "text-amber-400", bg: "bg-amber-500/20 text-amber-400 border-amber-500/30" },
  high: { label: "High", color: "text-red-400", bg: "bg-red-500/20 text-red-400 border-red-500/30" },
};

const statusConfig: Record<Status, { label: string; borderColor: string; icon: React.ReactNode }> = {
  todo: { label: "To Do", borderColor: "border-t-blue-500", icon: <BookOpen className="h-4 w-4" /> },
  inprogress: { label: "In Progress", borderColor: "border-t-orange-500", icon: <Clock className="h-4 w-4" /> },
  done: { label: "Done", borderColor: "border-t-emerald-500", icon: <CheckSquare className="h-4 w-4" /> },
};

function getWeekDates(referenceDate: Date): Date[] {
  const day = referenceDate.getDay();
  const diff = day === 0 ? -6 : 1 - day; // Monday start
  const monday = new Date(referenceDate);
  monday.setDate(referenceDate.getDate() + diff);
  monday.setHours(0, 0, 0, 0);

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

function formatDateShort(date: Date): string {
  return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

function formatDateISO(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

const WEEKDAY_NAMES = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// ─── Sample Data ─────────────────────────────────────────────────────────────

const sampleTasks: Task[] = [
  {
    id: "1",
    title: "Revise Data Structures",
    description: "Focus on trees, graphs and heaps",
    dueDate: formatDateISO(new Date()),
    priority: "high",
    status: "todo",
    createdAt: Date.now() - 3000,
  },
  {
    id: "2",
    title: "Complete React Assignment",
    description: "Build a todo app with hooks",
    dueDate: formatDateISO(new Date(Date.now() + 86400000)),
    priority: "medium",
    status: "inprogress",
    createdAt: Date.now() - 2000,
  },
  {
    id: "3",
    title: "Read OS Chapter 5",
    description: "",
    dueDate: formatDateISO(new Date(Date.now() + 2 * 86400000)),
    priority: "low",
    status: "done",
    createdAt: Date.now() - 1000,
  },
];

// ─── Task Card Component ─────────────────────────────────────────────────────

function TaskCard({
  task,
  onMove,
  onDelete,
}: {
  task: Task;
  onMove: (id: string, newStatus: Status) => void;
  onDelete: (id: string) => void;
}) {
  const pri = priorityConfig[task.priority];
  const nextStatus: Status | null =
    task.status === "todo" ? "inprogress" : task.status === "inprogress" ? "done" : null;

  const isOverdue = task.status !== "done" && task.dueDate < formatDateISO(new Date());

  return (
    <div className="group relative rounded-xl border border-white/[0.06] bg-white/[0.03] p-4 transition-all duration-300 hover:bg-white/[0.06] hover:border-white/[0.12] hover:shadow-lg hover:shadow-black/20 animate-slide-up">
      {/* Priority & Date Row */}
      <div className="flex items-center justify-between mb-3">
        <Badge variant="outline" className={`text-[10px] px-2 py-0.5 border ${pri.bg}`}>
          {pri.label}
        </Badge>
        <span className={`text-[11px] flex items-center gap-1 ${isOverdue ? "text-red-400" : "text-muted-foreground"}`}>
          <Clock className="h-3 w-3" />
          {task.dueDate}
        </span>
      </div>

      {/* Title */}
      <h4 className={`text-sm font-semibold mb-1 ${task.status === "done" ? "line-through text-muted-foreground" : ""}`}>
        {task.title}
      </h4>

      {/* Description */}
      {task.description && (
        <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{task.description}</p>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/[0.06]">
        {nextStatus ? (
          <Button
            variant="ghost"
            size="xs"
            className="text-xs gap-1 text-primary hover:text-primary"
            onClick={() => onMove(task.id, nextStatus)}
          >
            Move to {statusConfig[nextStatus].label}
            <ArrowRight className="h-3 w-3" />
          </Button>
        ) : (
          <span className="text-xs text-emerald-400 flex items-center gap-1">
            <CheckSquare className="h-3 w-3" /> Completed
          </span>
        )}
        <Button
          variant="ghost"
          size="icon-xs"
          className="text-muted-foreground hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => onDelete(task.id)}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}

// ─── Kanban Column Component ─────────────────────────────────────────────────

function KanbanColumn({
  status,
  tasks,
  onMove,
  onDelete,
}: {
  status: Status;
  tasks: Task[];
  onMove: (id: string, newStatus: Status) => void;
  onDelete: (id: string) => void;
}) {
  const config = statusConfig[status];
  return (
    <div className={`flex flex-col rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden border-t-2 ${config.borderColor}`}>
      {/* Column Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-white/[0.02]">
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">{config.icon}</span>
          <h3 className="text-sm font-semibold">{config.label}</h3>
        </div>
        <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-5 min-w-[20px] flex items-center justify-center">
          {tasks.length}
        </Badge>
      </div>

      {/* Cards */}
      <div className="flex flex-col gap-3 p-3 min-h-[200px] overflow-y-auto max-h-[calc(100vh-380px)]">
        {tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
            <div className="h-10 w-10 rounded-full bg-white/[0.04] flex items-center justify-center mb-2">
              {config.icon}
            </div>
            <p className="text-xs">No tasks here</p>
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard key={task.id} task={task} onMove={onMove} onDelete={onDelete} />
          ))
        )}
      </div>
    </div>
  );
}

// ─── Add Task Form Component ─────────────────────────────────────────────────

function AddTaskForm({ onAdd }: { onAdd: (task: Omit<Task, "id" | "createdAt">) => void }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState(formatDateISO(new Date()));
  const [priority, setPriority] = useState<Priority>("medium");
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Please enter a task title");
      return;
    }
    onAdd({ title: title.trim(), description: description.trim(), dueDate, priority, status: "todo" });
    setTitle("");
    setDescription("");
    setDueDate(formatDateISO(new Date()));
    setPriority("medium");
    setIsExpanded(false);
    toast.success("Task added successfully!");
  };

  return (
    <Card className="glass-card overflow-hidden">
      <CardContent className="p-0">
        {!isExpanded ? (
          <button
            onClick={() => setIsExpanded(true)}
            className="w-full flex items-center gap-3 p-4 text-muted-foreground hover:text-foreground transition-colors group"
          >
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <Plus className="h-4 w-4 text-primary" />
            </div>
            <span className="text-sm font-medium">Add a new study task...</span>
          </button>
        ) : (
          <form onSubmit={handleSubmit} className="p-4 space-y-4 animate-fade-in">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Plus className="h-4 w-4 text-primary" />
              </div>
              <h3 className="text-sm font-semibold">New Task</h3>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Input
                  placeholder="Task title *"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="bg-white/[0.04] border-white/[0.08]"
                  autoFocus
                />
              </div>
              <div className="sm:col-span-2">
                <Input
                  placeholder="Description (optional)"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="bg-white/[0.04] border-white/[0.08]"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">Due Date</label>
                <Input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="bg-white/[0.04] border-white/[0.08]"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">Priority</label>
                <div className="flex gap-2">
                  {(["low", "medium", "high"] as Priority[]).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPriority(p)}
                      className={`flex-1 text-xs font-medium py-1.5 rounded-lg border transition-all ${
                        priority === p
                          ? priorityConfig[p].bg + " border-current"
                          : "border-white/[0.08] text-muted-foreground hover:border-white/[0.16]"
                      }`}
                    >
                      {priorityConfig[p].label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 justify-end pt-2">
              <Button type="button" variant="ghost" size="sm" onClick={() => setIsExpanded(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm" className="gap-1">
                <Plus className="h-3.5 w-3.5" />
                Add Task
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
}

// ─── Calendar View ───────────────────────────────────────────────────────────

function CalendarView({
  tasks,
  onMove,
  onDelete,
}: {
  tasks: Task[];
  onMove: (id: string, newStatus: Status) => void;
  onDelete: (id: string) => void;
}) {
  const [weekOffset, setWeekOffset] = useState(0);

  const referenceDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + weekOffset * 7);
    return d;
  }, [weekOffset]);

  const weekDates = useMemo(() => getWeekDates(referenceDate), [referenceDate]);
  const todayISO = formatDateISO(new Date());

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Week Navigation */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={() => setWeekOffset((o) => o - 1)} className="gap-1">
          <ChevronLeft className="h-4 w-4" /> Previous
        </Button>
        <div className="text-sm font-medium text-muted-foreground">
          {formatDateShort(weekDates[0])} — {formatDateShort(weekDates[6])}
        </div>
        <div className="flex items-center gap-2">
          {weekOffset !== 0 && (
            <Button variant="ghost" size="xs" onClick={() => setWeekOffset(0)}>
              Today
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={() => setWeekOffset((o) => o + 1)} className="gap-1">
            Next <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Weekly Grid */}
      <div className="grid grid-cols-7 gap-2">
        {/* Day Headers */}
        {weekDates.map((date, i) => {
          const dateISO = formatDateISO(date);
          const isToday = dateISO === todayISO;
          return (
            <div key={`header-${i}`} className="text-center pb-2">
              <div className={`text-xs font-medium ${isToday ? "text-primary" : "text-muted-foreground"}`}>
                {WEEKDAY_NAMES[i]}
              </div>
              <div
                className={`text-lg font-bold mt-0.5 ${
                  isToday
                    ? "text-primary bg-primary/10 rounded-full w-8 h-8 flex items-center justify-center mx-auto"
                    : "text-foreground"
                }`}
              >
                {date.getDate()}
              </div>
            </div>
          );
        })}

        {/* Day Cells */}
        {weekDates.map((date, i) => {
          const dateISO = formatDateISO(date);
          const isToday = dateISO === todayISO;
          const dayTasks = tasks.filter((t) => t.dueDate === dateISO);

          return (
            <div
              key={`cell-${i}`}
              className={`rounded-xl border min-h-[140px] p-2 transition-colors ${
                isToday
                  ? "border-primary/30 bg-primary/[0.04]"
                  : "border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04]"
              }`}
            >
              <div className="space-y-2">
                {dayTasks.map((task) => {
                  const pri = priorityConfig[task.priority];
                  return (
                    <div
                      key={task.id}
                      className={`p-2 rounded-lg border text-[11px] transition-all hover:scale-[1.02] ${
                        task.status === "done"
                          ? "border-emerald-500/20 bg-emerald-500/[0.06] opacity-60"
                          : `border-white/[0.08] bg-white/[0.04]`
                      }`}
                    >
                      <div className="flex items-start justify-between gap-1">
                        <span
                          className={`font-medium leading-tight ${
                            task.status === "done" ? "line-through text-muted-foreground" : ""
                          }`}
                        >
                          {task.title}
                        </span>
                        <button
                          onClick={() => onDelete(task.id)}
                          className="text-muted-foreground hover:text-red-400 shrink-0 mt-0.5 transition-colors"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                      <div className="flex items-center justify-between mt-1.5">
                        <span className={`${pri.color} text-[9px] font-semibold uppercase`}>
                          {pri.label}
                        </span>
                        {task.status !== "done" && (
                          <button
                            onClick={() =>
                              onMove(task.id, task.status === "todo" ? "inprogress" : "done")
                            }
                            className="text-primary hover:text-primary/80 transition-colors"
                          >
                            <ArrowRight className="h-3 w-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
                {dayTasks.length === 0 && (
                  <div className="flex items-center justify-center h-[100px] text-muted-foreground/40">
                    <span className="text-[10px]">—</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function StudyPlannerPage() {
  const [tasks, setTasks] = useState<Task[]>(sampleTasks);
  const [activeTab, setActiveTab] = useState("kanban");

  // ─── Task Actions ──────────────────────────────────────────────────────────

  const addTask = (taskData: Omit<Task, "id" | "createdAt">) => {
    const newTask: Task = {
      ...taskData,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
    };
    setTasks((prev) => [...prev, newTask]);
  };

  const moveTask = (id: string, newStatus: Status) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t))
    );
    const statusLabel = statusConfig[newStatus].label;
    toast.success(`Task moved to ${statusLabel}`);
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    toast("Task deleted", { description: "The task has been removed." });
  };

  // ─── Derived State ─────────────────────────────────────────────────────────

  const todoTasks = tasks.filter((t) => t.status === "todo");
  const inProgressTasks = tasks.filter((t) => t.status === "inprogress");
  const doneTasks = tasks.filter((t) => t.status === "done");
  const completionRate = tasks.length > 0 ? Math.round((doneTasks.length / tasks.length) * 100) : 0;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="relative overflow-hidden rounded-2xl glass p-6 shadow-md">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-primary/20 via-background to-background" />
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-heading font-bold flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-primary" />
              Study Planner
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Organize your study sessions, track progress, and stay on top of deadlines.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-xs text-muted-foreground">Completion</div>
              <div className="text-lg font-bold font-heading">{completionRate}%</div>
            </div>
            <div className="w-24">
              <Progress value={completionRate} />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl border border-blue-500/20 bg-blue-500/[0.06] p-3 text-center">
          <div className="text-lg font-bold text-blue-400">{todoTasks.length}</div>
          <div className="text-[11px] text-muted-foreground">To Do</div>
        </div>
        <div className="rounded-xl border border-orange-500/20 bg-orange-500/[0.06] p-3 text-center">
          <div className="text-lg font-bold text-orange-400">{inProgressTasks.length}</div>
          <div className="text-[11px] text-muted-foreground">In Progress</div>
        </div>
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/[0.06] p-3 text-center">
          <div className="text-lg font-bold text-emerald-400">{doneTasks.length}</div>
          <div className="text-[11px] text-muted-foreground">Completed</div>
        </div>
      </div>

      {/* Add Task Form */}
      <AddTaskForm onAdd={addTask} />

      {/* View Tabs */}
      <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as string)}>
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="kanban" className="gap-1.5">
            <LayoutGrid className="h-3.5 w-3.5" />
            Kanban Board
          </TabsTrigger>
          <TabsTrigger value="calendar" className="gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            Calendar View
          </TabsTrigger>
        </TabsList>

        {/* Kanban View */}
        <TabsContent value="kanban">
          <div className="grid gap-4 md:grid-cols-3 mt-4 animate-fade-in">
            <KanbanColumn status="todo" tasks={todoTasks} onMove={moveTask} onDelete={deleteTask} />
            <KanbanColumn status="inprogress" tasks={inProgressTasks} onMove={moveTask} onDelete={deleteTask} />
            <KanbanColumn status="done" tasks={doneTasks} onMove={moveTask} onDelete={deleteTask} />
          </div>
        </TabsContent>

        {/* Calendar View */}
        <TabsContent value="calendar">
          <div className="mt-4">
            <CalendarView tasks={tasks} onMove={moveTask} onDelete={deleteTask} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
