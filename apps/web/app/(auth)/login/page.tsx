"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { useApi } from "@/hooks/use-api";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const router = useRouter();
  const { setAuth } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState("");

  // Wrap the api.login call with our reactive useApi hook
  const { isLoading, execute: loginExecute } = useApi(api.login);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!email || !password) {
      setFormError("Please fill in all fields.");
      return;
    }

    try {
      const response = await loginExecute({ email, password });
      if (response && response.success && response.data) {
        const { accessToken, refreshToken, user } = response.data as any;
        setAuth({ accessToken, refreshToken, user });
        router.push("/dashboard");
      } else {
        setFormError(response.message || "Failed to log in.");
      }
    } catch (err: any) {
      setFormError(err.message || "Invalid credentials. Please try again.");
    }
  };

  return (
    <main className="min-h-screen bg-bg-dark flex items-center justify-center px-6 py-12 relative overflow-hidden">
      {/* Background Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[radial-gradient(circle_at_center,rgba(108,99,255,0.06)_0%,transparent_70%)] pointer-events-none" />

      <div className="w-full max-w-[440px] z-10">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <a
            href="/"
            className="text-3xl font-extrabold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent tracking-tight hover:opacity-90 transition-opacity"
          >
            SERVORA
          </a>
        </div>

        <Card className="border border-white/5 bg-gradient-to-br from-[#1a1a2e]/90 to-[#16213e]/40 backdrop-blur-xl">
          <CardHeader className="text-center">
            <CardTitle>Welcome back</CardTitle>
            <CardDescription>Sign in to your Servora account to continue</CardDescription>
          </CardHeader>
          <CardContent>
            {formError && (
              <div className="mb-4 p-3.5 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm font-medium">
                ⚠️ {formError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <Input
                label="Email Address"
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />

              <Input
                label="Password"
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />

              <Button type="submit" variant="primary" className="w-full mt-2" isLoading={isLoading}>
                Sign In
              </Button>
            </form>

            <div className="text-center mt-6 text-sm text-white/50">
              Don&apos;t have an account?{" "}
              <a href="/register" className="text-primary hover:text-primary-hover font-semibold transition-colors">
                Register
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
