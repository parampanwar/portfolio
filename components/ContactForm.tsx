import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Send, Loader2 } from "lucide-react";

const contactSchema = z.object({
  name: z.string().trim().min(1, { message: "Name is required" }).max(100, { message: "Name must be less than 100 characters" }),
  email: z.string().trim().email({ message: "Invalid email address" }).max(255, { message: "Email must be less than 255 characters" }),
  subject: z.string().trim().min(1, { message: "Subject is required" }).max(200, { message: "Subject must be less than 200 characters" }),
  message: z.string().trim().min(10, { message: "Message must be at least 10 characters" }).max(1000, { message: "Message must be less than 1000 characters" }),
});

type ContactFormData = z.infer<typeof contactSchema>;

export const ContactForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
  setIsSubmitting(true);

  try {
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (!res.ok) {
      toast({
        title: "Error",
        description: result.message || "Something went wrong.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    toast({
      title: "Message sent!",
      description: "Thank you for reaching out. I will reply soon.",
    });

    reset();
  } catch (error) {
    console.error(error);
    toast({
      title: "Network Error",
      description: "Unable to send message. Try again later.",
      variant: "destructive",
    });
  }

  setIsSubmitting(false);
};


  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name" className="text-foreground/90">
          Name
        </Label>
        <Input
          id="name"
          placeholder="Your name"
          className="glass-input"
          {...register("name")}
          aria-invalid={errors.name ? "true" : "false"}
        />
        {errors.name && (
          <p className="text-sm text-destructive animate-fade-in">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="text-foreground/90">
          Email
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="mail@example.com"
          className="glass-input"
          {...register("email")}
          aria-invalid={errors.email ? "true" : "false"}
        />
        {errors.email && (
          <p className="text-sm text-destructive animate-fade-in">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="subject" className="text-foreground/90">
          Subject
        </Label>
        <Input
          id="subject"
          placeholder="What's this about?"
          className="glass-input"
          {...register("subject")}
          aria-invalid={errors.subject ? "true" : "false"}
        />
        {errors.subject && (
          <p className="text-sm text-destructive animate-fade-in">{errors.subject.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="message" className="text-foreground/90">
          Message
        </Label>
        <Textarea
          id="message"
          placeholder="Tell us what's on your mind..."
          className="glass-input min-h-[150px] resize-none"
          {...register("message")}
          aria-invalid={errors.message ? "true" : "false"}
        />
        {errors.message && (
          <p className="text-sm text-destructive animate-fade-in">{errors.message.message}</p>
        )}
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full glass-button group relative overflow-hidden"
      >
        <span className="relative z-10 flex items-center justify-center gap-2">
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              Send Message
              <Send className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </>
          )}
        </span>
        <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary opacity-0 transition-opacity group-hover:opacity-100" />
      </Button>
    </form>
  );
};
