import { useMutation } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { type InsertWaitlist } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export function useJoinWaitlist() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: InsertWaitlist) => {
      // Client-side validation is good, but we also rely on schema validation
      const res = await fetch(api.waitlist.create.path, {
        method: api.waitlist.create.method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        if (res.status === 409) {
          throw new Error("You are already on the waitlist!");
        }
        const error = await res.json();
        throw new Error(error.message || "Failed to join waitlist");
      }

      return api.waitlist.create.responses[201].parse(await res.json());
    },
    onSuccess: (_, variables) => {
      // Local storage backup as requested
      localStorage.setItem('pragenx_waitlist_email', variables.email);
      
      toast({
        title: "Welcome to the future",
        description: "You've been added to the priority access list.",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Something went wrong",
        description: error.message,
      });
    },
  });
}
