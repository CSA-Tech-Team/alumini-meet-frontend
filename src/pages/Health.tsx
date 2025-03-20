import { ApiEndpoints, HttpMethod } from "@/apis/apis.enum";
import { useApi } from "@/apis/useApi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";


export interface Todo {
    id: number;
    title: string;
    body: string;
    userId: number;
    completed: boolean;
}


const Health = () => {
    const query = useApi<Todo[]>(HttpMethod.GET, false, "todos", {
        url: ApiEndpoints.TODOS,
    });

    const mutation = useApi<Todo>(HttpMethod.POST, false, "login", {
        url: ApiEndpoints.POSTS,
        body: { title: "foo", body: "bar", userId: 1 },
    });

    return (
        <div className="p-6 flex flex-col gap-6">
            <h1 className="text-2xl font-bold">Health Check</h1>

            {"isPending" in query && query.isPending && (
                <p className="text-blue-500">Loading todos...</p>
            )}

            {"error" in query && query.error && (
                <p className="text-red-500">Error fetching todos!</p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {"data" in query &&
                    query.data?.slice(0, 6).map((todo) => (
                        <Card key={todo.id} className="border border-gray-200 shadow-sm">
                            <CardHeader>
                                <CardTitle>{todo.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p
                                    className={`text-sm ${
                                        todo.completed ? "text-green-600" : "text-red-600"
                                    }`}
                                >
                                    {todo.completed ? "Completed ✅" : "Pending ❌"}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
            </div>

            <Button
                className="w-fit"
                onClick={() => "mutate" in mutation && mutation.mutate()}
                disabled={"isPending" in mutation && mutation.isPending}
            >
                {"isPending" in mutation && mutation.isPending
                    ? "Submitting..."
                    : "Submit Placeholder Data"}
            </Button>

            {"data" in mutation && mutation.data && (
                <div className="mt-4 p-4 border border-gray-200 rounded-md">
                    <h2 className="text-lg font-semibold">Submitted Data:</h2>
                    <pre className="text-sm text-gray-700">
                        {JSON.stringify(mutation.data, null, 2)}
                    </pre>
                </div>
            )}
        </div>
    );
};

export default Health;
