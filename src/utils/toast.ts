import { toast } from "@/hooks/use-toast";

export const toastError = (error: any) => {
  const message = error?.response?.data?.message || error?.message || 'An error occurred';
  toast({
    variant: "destructive",
    title: "Error",
    description: message,
  });
};

export const toastSuccess = (message: string) => {
  toast({
    title: "Success",
    description: message,
  });
};