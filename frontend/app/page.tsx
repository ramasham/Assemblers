import { LoginForm } from "@/components/login-form"
import { Factory } from "lucide-react"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-secondary/10 p-4" suppressHydrationWarning>
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center ring-2 ring-primary/30" suppressHydrationWarning>
            <Factory className="h-8 w-8 text-primary" />
          </div>
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Welcome Back</h1>
            <p className="text-muted-foreground">Manufacturing Production Management System</p>
          </div>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
