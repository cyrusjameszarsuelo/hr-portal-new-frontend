import "./App.css";
import { RouterProvider } from "react-router/dom";
import { router } from "./routes/route";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { UserProvider } from "./contexts/UserContext";

const queryClient = new QueryClient();

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <UserProvider>
                <RouterProvider router={router} />
            </UserProvider>
        </QueryClientProvider>
    );
}

export default App;
