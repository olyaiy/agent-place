import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { SignInForm } from "./_components/signin-form"
import { SignUpForm } from "./_components/signup-form"

export default function AuthPage() {
  return (
    <div className="container max-w-md py-12">
      <Tabs defaultValue="signin" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="signin">Sign In</TabsTrigger>
          <TabsTrigger value="signup">Sign Up</TabsTrigger>
        </TabsList>
        
        <TabsContent value="signin">
          <Card className="p-6">
            <SignInForm />
          </Card>
        </TabsContent>
        
        <TabsContent value="signup">
          <Card className="p-6">
            <SignUpForm />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
