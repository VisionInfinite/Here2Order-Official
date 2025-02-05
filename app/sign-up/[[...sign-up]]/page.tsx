import { SignUp } from "@clerk/nextjs";
import Image from "next/image";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container flex flex-col items-center justify-center space-y-4 px-4 md:px-6">
        <div className="flex flex-col items-center space-y-2 text-center">
          <div className="mb-4 h-20 w-20 overflow-hidden rounded-xl">
            <Image 
              src="/logo.png" 
              alt="Here2Order Logo" 
              width={80} 
              height={80}
              className="object-cover"
            />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
            Create your account
          </h1>
          <p className="max-w-[600px] text-lg text-gray-400 md:text-xl">
            Join thousands of restaurants already using Here2Order.
          </p>
        </div>
        <div className="w-full max-w-sm">
          <div className="rounded-lg border bg-card p-8 shadow-lg">
            <SignUp 
              appearance={{
                elements: {
                  rootBox: "w-full",
                  card: "bg-transparent shadow-none p-0",
                  headerTitle: "hidden",
                  headerSubtitle: "hidden",
                  socialButtonsBlockButton: "bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700",
                  formButtonPrimary: "bg-primary hover:bg-primary/90",
                  footerAction: "text-sm text-gray-500 dark:text-gray-400",
                  formFieldInput: "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700",
                  dividerLine: "bg-gray-200 dark:bg-gray-700",
                  dividerText: "text-gray-500 dark:text-gray-400",
                }
              }}
            />
          </div>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          By signing up, you agree to our{" "}
          <a href="/terms" className="underline underline-offset-2 hover:text-primary">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="/privacy" className="underline underline-offset-2 hover:text-primary">
            Privacy Policy
          </a>
        </p>
      </div>
      <footer className="mt-8 w-full py-6 text-center text-sm text-gray-500 dark:text-gray-400">
        © {new Date().getFullYear()} Here2Order. All rights reserved.
      </footer>
    </div>
  );
} 