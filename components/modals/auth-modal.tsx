"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "../ui/button";
import { signIn } from "next-auth/react";
import { useToast } from "../ui/use-toast";
import { Icons } from "../icons";

const AuthModal = () => {
  const [isLoading, setIsLoading] = useState(false);

  const { toast } = useToast();
  const router = useRouter();
  const r = usePathname();

  const searchParams = useSearchParams();
  const callback = searchParams.get("callbackUrl");

  const handleOnOpenChange = (open: boolean) => {
    router.push("/");
  };

  async function onLogin() {
    try {
      setIsLoading(true);
      const res = await signIn("github", {
        redirect: false,
      });
      if (res?.error) throw new Error(res.error);
      if (res?.ok) {
        toast({
          title: `Success: Authenticated`,
          description: "Continue to home",
        });
        if (callback) {
          router.push(callback);
        } else {
          router.push("/");
        }
      }
    } catch (error: any) {
      console.log(error);
      toast({
        title: `Error: Authentication Failed`,
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={r === "/auth"} onOpenChange={handleOnOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center">Authenticate Now</DialogTitle>
          <DialogDescription>
            <div className="flex justify-center items-center p-4 flex-col">
              <div className="flex">
                <p>
                  By authenticating with Github, you agree to our{" "}
                  <a
                    href="/terms"
                    className="text-blue-500 hover:underline"
                    target="_blank"
                  >
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a
                    href="/privacy"
                    className="text-blue-500 hover:underline"
                    target="_blank"
                  >
                    Privacy Policy
                  </a>
                  .
                </p>
              </div>

              <Button
                type="button"
                onClick={onLogin}
                disabled={isLoading}
                className="mt-4 w-full sm:w-auto"
              >
                {isLoading ? (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Icons.gitHub className="mr-2 h-4 w-4" />
                )}
                Authenticate with Github
              </Button>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
