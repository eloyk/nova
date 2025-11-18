import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { useAuth } from "@/hooks/useAuth";
import Landing from "@/pages/landing";
import StudentDashboard from "@/pages/student-dashboard";
import InstructorDashboard from "@/pages/instructor-dashboard";
import Courses from "@/pages/courses";
import CourseView from "@/pages/course-view";
import CreateCourse from "@/pages/create-course";
import InstructorCourseEdit from "@/pages/instructor-course-edit";
import AssignmentSubmissions from "@/pages/assignment-submissions";
import Profile from "@/pages/profile";
import Settings from "@/pages/settings";
import NotFound from "@/pages/not-found";

function Router() {
  const { isAuthenticated, isLoading, isInstructor } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="space-y-4 text-center">
          <div className="h-12 w-12 mx-auto rounded-full border-4 border-primary border-t-transparent animate-spin" />
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <Switch>
      {!isAuthenticated ? (
        <Route path="/" component={Landing} />
      ) : (
        <>
          {isInstructor ? (
            <Route path="/" component={InstructorDashboard} />
          ) : (
            <Route path="/" component={StudentDashboard} />
          )}
          <Route path="/instructor" component={InstructorDashboard} />
          <Route path="/instructor/courses" component={InstructorDashboard} />
          <Route path="/instructor/create-course" component={CreateCourse} />
          <Route path="/instructor/course/:id" component={InstructorCourseEdit} />
          <Route path="/instructor/courses/:id/edit" component={InstructorCourseEdit} />
          <Route path="/instructor/assignment/:id/submissions" component={AssignmentSubmissions} />
          <Route path="/courses" component={Courses} />
          <Route path="/course/:id" component={CourseView} />
          <Route path="/my-courses" component={StudentDashboard} />
          <Route path="/profile" component={Profile} />
          <Route path="/settings" component={Settings} />
        </>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function AppContent() {
  const { isAuthenticated } = useAuth();

  const sidebarStyle = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  return (
    <TooltipProvider>
      {isAuthenticated ? (
        <SidebarProvider style={sidebarStyle as React.CSSProperties}>
          <div className="flex h-screen w-full">
            <AppSidebar />
            <div className="flex flex-col flex-1 overflow-hidden">
              <header className="flex items-center gap-4 border-b px-6 py-3">
                <SidebarTrigger data-testid="button-sidebar-toggle" />
              </header>
              <main className="flex-1 overflow-auto">
                <div className="max-w-7xl mx-auto p-6 sm:p-8">
                  <Router />
                </div>
              </main>
            </div>
          </div>
        </SidebarProvider>
      ) : (
        <Router />
      )}
      <Toaster />
    </TooltipProvider>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}

export default App;
