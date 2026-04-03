import { Skeleton } from "@/components/ui/skeleton";
import {
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { Suspense, lazy } from "react";
import { Layout } from "./components/Layout";

const LazyLibrary = lazy(() =>
  import("./pages/Library").then((m) => ({ default: m.LibraryPage })),
);
const LazyEditor = lazy(() =>
  import("./pages/Editor").then((m) => ({ default: m.EditorPage })),
);

function PageLoader() {
  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="space-y-3 w-full max-w-sm">
        <Skeleton className="h-8 w-3/4 rounded" />
        <Skeleton className="h-4 w-full rounded" />
        <Skeleton className="h-4 w-5/6 rounded" />
      </div>
    </div>
  );
}

function LibraryPageWrapper() {
  return (
    <Suspense fallback={<PageLoader />}>
      <LazyLibrary />
    </Suspense>
  );
}

function EditorPageWrapper() {
  return (
    <Suspense fallback={<PageLoader />}>
      <LazyEditor />
    </Suspense>
  );
}

const rootRoute = createRootRoute({ component: Layout });

const libraryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: LibraryPageWrapper,
});

const editorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/equations/$id",
  component: EditorPageWrapper,
});

const routeTree = rootRoute.addChildren([libraryRoute, editorRoute]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
