"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  BookOpen, Calendar, CheckSquare, Plus, Trash2, Clock, ArrowRight,
  LayoutGrid, Loader2, BookMarked, Target, LineChart, CheckCircle2
} from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";

// --- Types ---
type Priority = "low" | "medium" | "high";
type Status = "todo" | "inprogress" | "done";

interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: Priority;
  status: Status;
  createdAt: number;
}

// --- Helpers ---
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

function formatDateISO(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}


const sampleTasks: Task[] = [
  { id: "1", title: "Revise Data Structures", description: "Focus on trees, graphs and heaps", dueDate: formatDateISO(new Date()), priority: "high", status: "todo", createdAt: Date.now() - 3000 },
  { id: "2", title: "Complete Assignment", description: "Build a todo app", dueDate: formatDateISO(new Date(Date.now() + 86400000)), priority: "medium", status: "inprogress", createdAt: Date.now() - 2000 },
];

// --- Sub-components ---
function TaskCard({ task, onMove, onDelete }: { task: Task; onMove: (id: string, newStatus: Status) => void; onDelete: (id: string) => void; }) {
  const pri = priorityConfig[task.priority];
  const nextStatus: Status | null = task.status === "todo" ? "inprogress" : task.status === "inprogress" ? "done" : null;
  const isOverdue = task.status !== "done" && task.dueDate < formatDateISO(new Date());

  return (
    <div className="group relative rounded-xl border border-border bg-card p-4 transition-all duration-300 hover:shadow-lg">
      <div className="flex items-center justify-between mb-3">
        <Badge variant="outline" className={`text-[10px] px-2 py-0.5 border ${pri.bg}`}>{pri.label}</Badge>
        <span className={`text-[11px] flex items-center gap-1 ${isOverdue ? "text-red-500 font-bold" : "text-muted-foreground"}`}>
          <Clock className="h-3 w-3" /> {task.dueDate}
        </span>
      </div>
      <h4 className={`text-sm font-semibold mb-1 ${task.status === "done" ? "line-through text-muted-foreground" : "text-foreground"}`}>{task.title}</h4>
      {task.description && <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{task.description}</p>}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
        {nextStatus ? (
          <Button variant="ghost" size="xs" className="text-[10px] h-6 px-2 gap-1 text-primary hover:text-primary" onClick={() => onMove(task.id, nextStatus)}>
            Move to {statusConfig[nextStatus].label} <ArrowRight className="h-3 w-3" />
          </Button>
        ) : (
          <span className="text-[10px] text-emerald-500 flex items-center gap-1"><CheckSquare className="h-3 w-3" /> Completed</span>
        )}
        <Button variant="ghost" size="icon-xs" className="h-6 w-6 text-muted-foreground hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => onDelete(task.id)}>
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}

// --- Main Page ---
export default function StudyPlannerPage() {
  const [tasks, setTasks] = useState<Task[]>(sampleTasks);
  const [activeTab, setActiveTab] = useState("kanban");
  const [category, setCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Mock Test State
  const [mockTests] = useState([
    { id: 1, name: "JEE Full Syllabus 1", score: 180, total: 300, date: "2026-06-15" },
    { id: 2, name: "JEE Full Syllabus 2", score: 210, total: 300, date: "2026-06-22" },
    { id: 3, name: "Math Sectional Test", score: 85, total: 100, date: "2026-07-01" },
  ]);

  // Syllabus State
  const [syllabus, setSyllabus] = useState([
    { id: 1, subject: "Mathematics", chapter: "Real Numbers", completed: true },
    { id: 2, subject: "Mathematics", chapter: "Polynomials", completed: false },
    { id: 3, subject: "Science", chapter: "Chemical Reactions", completed: true },
    { id: 4, subject: "Science", chapter: "Acids, Bases and Salts", completed: false },
    { id: 5, subject: "Science", chapter: "Metals and Non-metals", completed: false },
  ]);

  useEffect(() => {
    const fetchProfile = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase.from("profiles").select("education_category").eq("auth_user_id", user.id).single();
        if (data) {
          setCategory(data.education_category);
          // Set default tab based on category
          if (data.education_category === "school") setActiveTab("syllabus");
          if (data.education_category === "entrance_exams") setActiveTab("mock-tests");
        }
      }
      setLoading(false);
    };
    fetchProfile();
  }, []);

  const addTask = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const title = fd.get("title") as string;
    if (!title.trim()) return toast.error("Please enter a title");
    
    setTasks([...tasks, {
      id: crypto.randomUUID(),
      title: title.trim(),
      description: fd.get("description") as string,
      dueDate: fd.get("dueDate") as string || formatDateISO(new Date()),
      priority: (fd.get("priority") as Priority) || "medium",
      status: "todo",
      createdAt: Date.now()
    }]);
    toast.success("Task added!");
    e.currentTarget.reset();
  };

  const toggleSyllabus = (id: number) => {
    setSyllabus(s => s.map(item => item.id === id ? { ...item, completed: !item.completed } : item));
    toast.success("Progress updated!");
  };

  if (loading) return <div className="flex justify-center p-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  const showSyllabus = category === "school" || category === null;
  const showMockTests = category === "entrance_exams" || category === null;

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto pb-12">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 to-background border border-primary/20 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-heading font-bold flex items-center gap-2 text-foreground">
              <BookOpen className="h-6 w-6 text-primary" />
              Super Study Planner
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Organize your study sessions, track progress, and conquer your goals!
            </p>
          </div>
          <div className="text-right bg-background/50 p-3 rounded-xl border border-border/50">
            <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">To-Do Progress</div>
            <div className="flex items-center gap-3">
              <div className="w-32"><Progress value={tasks.length ? (tasks.filter(t => t.status === "done").length / tasks.length) * 100 : 0} className="h-2" /></div>
              <span className="font-bold text-sm">{tasks.length ? Math.round((tasks.filter(t => t.status === "done").length / tasks.length) * 100) : 0}%</span>
            </div>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full sm:w-auto overflow-x-auto justify-start flex-nowrap bg-muted/50 border border-border rounded-xl p-1 h-12">
          {showSyllabus && (
            <TabsTrigger value="syllabus" className="gap-2 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
              <BookMarked className="h-4 w-4" /> Syllabus Tracker
            </TabsTrigger>
          )}
          {showMockTests && (
            <TabsTrigger value="mock-tests" className="gap-2 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
              <Target className="h-4 w-4" /> Mock Tests
            </TabsTrigger>
          )}
          <TabsTrigger value="kanban" className="gap-2 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <LayoutGrid className="h-4 w-4" /> Kanban Board
          </TabsTrigger>
        </TabsList>

        {/* --- SYLLABUS TRACKER --- */}
        {showSyllabus && (
          <TabsContent value="syllabus" className="mt-6 animate-fade-in">
            <div className="grid md:grid-cols-2 gap-6">
              {['Mathematics', 'Science'].map(subject => {
                const subjectSyllabus = syllabus.filter(s => s.subject === subject);
                const completed = subjectSyllabus.filter(s => s.completed).length;
                const total = subjectSyllabus.length;
                const percent = Math.round((completed / total) * 100) || 0;
                
                return (
                  <Card key={subject} className="overflow-hidden border-border/50 shadow-sm">
                    <CardHeader className="bg-muted/30 border-b border-border/50 pb-4">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-lg font-bold text-primary">{subject}</CardTitle>
                        <Badge variant={percent === 100 ? "default" : "secondary"}>{percent}% Done</Badge>
                      </div>
                      <Progress value={percent} className="h-1.5 mt-2" />
                    </CardHeader>
                    <CardContent className="p-0">
                      <ul className="divide-y divide-border/50">
                        {subjectSyllabus.map(item => (
                          <li key={item.id} className="p-4 flex items-center justify-between hover:bg-muted/20 transition-colors">
                            <span className={`text-sm font-medium ${item.completed ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
                              {item.chapter}
                            </span>
                            <Button 
                              variant={item.completed ? "default" : "outline"} 
                              size="sm"
                              className={`h-7 px-3 text-xs rounded-full ${item.completed ? 'bg-emerald-500 hover:bg-emerald-600 text-white border-transparent' : ''}`}
                              onClick={() => toggleSyllabus(item.id)}
                            >
                              {item.completed ? <><CheckCircle2 className="h-3 w-3 mr-1" /> Done</> : "Mark Done"}
                            </Button>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>
        )}

        {/* --- MOCK TESTS TRACKER --- */}
        {showMockTests && (
          <TabsContent value="mock-tests" className="mt-6 animate-fade-in">
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold flex items-center gap-2"><Target className="h-5 w-5 text-primary" /> Test History</h3>
                  <Button size="sm"><Plus className="h-4 w-4 mr-1" /> Add Test</Button>
                </div>
                
                <div className="grid gap-4">
                  {mockTests.map(test => (
                    <Card key={test.id} className="bg-card hover:border-primary/30 transition-colors">
                      <CardContent className="p-4 flex items-center justify-between">
                        <div>
                          <h4 className="font-bold">{test.name}</h4>
                          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1"><Calendar className="h-3 w-3" /> {test.date}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-black font-heading tracking-tight text-primary">
                            {test.score} <span className="text-sm font-medium text-muted-foreground">/ {test.total}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-bold flex items-center gap-2"><LineChart className="h-5 w-5 text-primary" /> Performance</h3>
                <Card className="bg-gradient-to-b from-primary/5 to-background">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="text-center pb-4 border-b border-border">
                        <div className="text-sm text-muted-foreground uppercase tracking-wider font-semibold">Average Score</div>
                        <div className="text-4xl font-black text-primary mt-1">158</div>
                      </div>
                      
                      {/* Simple Bar Chart Visualization */}
                      <div className="pt-2">
                        <div className="flex items-end justify-between h-32 gap-2">
                          {mockTests.map((t, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center justify-end group">
                              <div className="w-full bg-primary/20 rounded-t-md hover:bg-primary/40 transition-colors relative" style={{ height: `${(t.score / t.total) * 100}%` }}>
                                <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground text-[10px] px-1.5 py-0.5 rounded shadow-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                  {t.score}/{t.total}
                                </div>
                              </div>
                              <span className="text-[9px] text-muted-foreground mt-2 truncate max-w-full">T{i+1}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        )}

        {/* --- KANBAN BOARD --- */}
        <TabsContent value="kanban" className="mt-6 animate-fade-in">
          <Card className="mb-6 bg-card border-border/50 shadow-sm">
            <CardContent className="p-4">
              <form onSubmit={addTask} className="flex flex-col md:flex-row gap-3">
                <Input name="title" placeholder="What needs to be done?" className="flex-1" />
                <div className="flex gap-3">
                  <Input type="date" name="dueDate" defaultValue={formatDateISO(new Date())} className="w-[140px]" />
                  <select name="priority" className="flex h-10 w-[110px] items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background">
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                  <Button type="submit"><Plus className="h-4 w-4 mr-2" /> Add Task</Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-3 gap-6">
            {(["todo", "inprogress", "done"] as Status[]).map(status => (
              <div key={status} className={`flex flex-col rounded-xl border bg-card/50 shadow-sm border-t-2 ${statusConfig[status].borderColor}`}>
                <div className="p-3 border-b border-border/50 flex justify-between items-center bg-muted/20">
                  <h3 className="font-semibold text-sm flex items-center gap-2">
                    {statusConfig[status].icon} {statusConfig[status].label}
                  </h3>
                  <Badge variant="secondary" className="rounded-full h-5 w-5 p-0 flex items-center justify-center text-xs">
                    {tasks.filter(t => t.status === status).length}
                  </Badge>
                </div>
                <div className="p-3 space-y-3 min-h-[200px]">
                  {tasks.filter(t => t.status === status).map(task => (
                    <TaskCard key={task.id} task={task} onMove={(id, s) => setTasks(ts => ts.map(t => t.id === id ? {...t, status: s} : t))} onDelete={id => setTasks(ts => ts.filter(t => t.id !== id))} />
                  ))}
                  {tasks.filter(t => t.status === status).length === 0 && (
                    <div className="h-24 flex items-center justify-center text-muted-foreground/50 text-xs italic">No tasks here</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
