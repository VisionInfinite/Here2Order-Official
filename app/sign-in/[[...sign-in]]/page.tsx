"use client";

import { SignIn } from "@clerk/nextjs";
import { useRouter, useSearchParams } from "next/navigation";
import Loading from "@/components/loading";
import { useAuth } from "@clerk/nextjs";
import { useEffect } from "react";
import Image from "next/image";

export default function SignInPage() {
  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams?.get("redirect_url") || "/dashboard";

  useEffect(() => {
    if (isSignedIn) {
      router.push(redirectUrl);
    }
  }, [isSignedIn, redirectUrl, router]);

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0f1520]">
        <Loading />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0f1520] text-white">
      <div className="container flex flex-col items-center justify-center space-y-8 px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="mb-2 h-24 w-24">
            <Image 
              src="/logo.png" 
              alt="Here2Order Logo" 
              width={96} 
              height={96}
              className="object-contain"
            />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
            Welcome to Here2Order
          </h1>
          <p className="max-w-[600px] text-lg text-gray-400 md:text-xl">
            The complete restaurant management solution for modern businesses.
          </p>
        </div>
        <div className="w-full max-w-md">
          <div className="rounded-xl border border-gray-800 bg-[#1a1f2e] p-8 shadow-2xl">
            <SignIn 
              appearance={{
                elements: {
                  rootBox: "w-full",
                  card: "bg-transparent shadow-none p-0",
                  headerTitle: "hidden",
                  headerSubtitle: "hidden",
                  socialButtonsBlockButton: "bg-[#2a2f3e] hover:bg-[#2f344f] border-gray-700",
                  formButtonPrimary: "bg-blue-600 hover:bg-blue-700",
                  footerAction: "text-gray-400",
                  formFieldInput: "bg-[#2a2f3e] border-gray-700 text-white",
                  dividerLine: "bg-gray-800",
                  dividerText: "text-gray-500",
                  formFieldLabel: "text-gray-300",
                  identityPreviewText: "text-gray-300",
                  identityPreviewEditButton: "text-blue-500 hover:text-blue-400",
                  formResendCodeLink: "text-blue-500 hover:text-blue-400",
                  otpCodeFieldInput: "bg-[#2a2f3e] border-gray-700 text-white",
                }
              }}
              redirectUrl={redirectUrl}
              signUpUrl="/sign-up"
            />
          </div>
        </div>
        <p className="text-sm text-gray-400">
          By signing in, you agree to our{" "}
          <a href="/terms" className="text-blue-400 hover:text-blue-300 underline underline-offset-2">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="/privacy" className="text-blue-400 hover:text-blue-300 underline underline-offset-2">
            Privacy Policy
          </a>
        </p>
      </div>
      <footer className="mt-8 w-full py-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Here2Order. All rights reserved.
      </footer>
    </div>
  );
}
