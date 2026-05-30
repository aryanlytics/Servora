"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { useApi } from "@/hooks/use-api";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function RegisterPage() {
  const router = useRouter();
  const { setAuth } = useAuth();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"customer" | "worker">("customer");
  const [formError, setFormError] = useState("");

  // Wrap api.register call with reactive useApi hook
  const { isLoading, execute: registerExecute } = useApi(api.register);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!firstName || !lastName || !email || !password) {
      setFormError("All fields are required.");
      return;
    }

    try {
      const response = await registerExecute({
        firstName,
        lastName,
        email,
        password,
        role,
      });

      if (response && response.success && response.data) {
        const { accessToken, refreshToken, user } = response.data as any;
        setAuth({ accessToken, refreshToken, user });
        router.push("/dashboard");
      } else {
        setFormError(response.message || "Registration failed.");
      }
    } catch (err: any) {
      setFormError(err.message || "Email already exists or registration failed. Please try again.");
    }
  };

  return (
    <main className="min-h-screen bg-bg-dark flex items-center justify-center px-6 py-12 relative overflow-hidden">
      {/* Background Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-[radial-gradient(circle_at_center,rgba(108,99,255,0.06)_0%,transparent_70%)] pointer-events-none" />

      <div className="w-full max-w-[460px] z-10">
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
            <CardTitle>Create an account</CardTitle>
            <CardDescription>Join Servora as a customer or service provider</CardDescription>
          </CardHeader>
          <CardContent>
            {formError && (
              <div className="mb-4 p-3.5 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm font-medium">
                ⚠️ {formError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="First Name"
                  id="firstName"
                  type="text"
                  placeholder="John"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  disabled={isLoading}
                />
                <Input
                  label="Last Name"
                  id="lastName"
                  type="text"
                  placeholder="Doe"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  disabled={isLoading}
                />
              </div>

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

              <div className="flex flex-col gap-2">
                <span className="text-sm font-medium text-white/60">I want to join as a</span>
                <div className="grid grid-cols-2 gap-4">
                  {/* Customer Card Selector */}
                  <div
                    onClick={() => !isLoading && setRole("customer")}
                    className={`flex flex-col items-center justify-center p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                      role === "customer"
                        ? "bg-primary/10 border-primary shadow-[0_0_15px_rgba(108,99,255,0.15)] text-white"
                        : "bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10 text-white/75"
                    }`}
                  >
                    <span className="text-2xl mb-1.5">🏠</span>
                    <span className="text-sm font-bold">Customer</span>
                  </div>

                  {/* Worker Card Selector */}
                  <div
                    onClick={() => !isLoading && setRole("worker")}
                    className={`flex flex-col items-center justify-center p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                      role === "worker"
                        ? "bg-secondary/10 border-secondary shadow-[0_0_15px_rgba(0,212,170,0.15)] text-white"
                        : "bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10 text-white/75"
                    }`}
                  >
                    <span className="text-2xl mb-1.5">🔧</span>
                    <span className="text-sm font-bold">Worker</span>
                  </div>
                </div>
              </div>

              <Button type="submit" variant="primary" className="w-full mt-2" isLoading={isLoading}>
                Create Account
              </Button>
            </form>

            <div className="text-center mt-6 text-sm text-white/50">
              Already have an account?{" "}
              <a href="/login" className="text-primary hover:text-primary-hover font-semibold transition-colors">
                Sign In
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
