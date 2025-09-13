"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import { ChevronLeft, HelpCircle } from "lucide-react";
import debounce from "lodash.debounce";
import instance from "@/lib/axios";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { unwrapResult } from "@reduxjs/toolkit";
import { createWorkspace } from "@/redux/features/workspace/workspaceThunks";
import { AppDispatch } from "@/redux/store";
import { RootState } from "@/redux/store";
import { logout } from "@/redux/features/auth/authThunks";
interface IFormInputs {
  workspaceName: string;
  workspaceUrl: string;
}

const CreateWorkspace: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<IFormInputs>({
    mode: "onChange",
  });

  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const workspaceName = watch("workspaceName");
  const workspaceUrl = watch("workspaceUrl");

  const { user } = useSelector((state: RootState) => state.auth);

  const checkAvailability = useCallback(
    debounce(async (name: string, slug: string) => {
      if (
        !name ||
        !slug ||
        name.trim() === "" ||
        slug.trim() === "" ||
        /\s/.test(slug)
      ) {
        setIsAvailable(null);
        setIsChecking(false);
        return;
      }
      setIsChecking(true);
      try {
        const response = await instance.post("/workspace/workspaceValid", {
          name,
          slug,
        });
        setIsAvailable(response.data.success);
      } catch (error: any) {
        console.error(
          "Validation API Error:",
          error.response?.data || error.message
        );
        setIsAvailable(false);
      } finally {
        setIsChecking(false);
      }
    }, 500),
    []
  );

  useEffect(() => {
    checkAvailability(workspaceName, workspaceUrl);
  }, [workspaceName, workspaceUrl, checkAvailability]);

  const onSubmit: SubmitHandler<IFormInputs> = async (data) => {
    try {
      const resultAction = await dispatch(
        createWorkspace({ name: data.workspaceName, slug: data.workspaceUrl })
      );
      const result = unwrapResult(resultAction);

      alert("Workspace created successfully!");
      router.push(`/${result.workspace.slug}`);
    } catch (err: any) {
      console.error("Failed to create workspace:", err);
      alert(`Error: ${err.message || "Could not create workspace."}`);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const getUrlInputBorder = () => {
    if (isChecking) return "border-gray-500";
    if (errors.workspaceUrl) return "border-red-500";
    if (isAvailable === true) return "border-green-500";
    if (isAvailable === false) return "border-red-500";
    return "border-gray-600";
  };

  return (
    <div className="bg-[#0C0C0C] min-h-screen text-gray-300 flex flex-col items-center p-4 sm:p-8 font-sans">
      <header className="w-full flex justify-between items-center mb-12">
        <button
          onClick={handleBack}
          className="flex items-center text-sm text-gray-400 hover:bg-[#1B1D21] cursor-pointer p-1 rounded-[5px] hover:text-white transition-colors"
        >
          <ChevronLeft size={18} className="mr-1" />
          Back to Linear
        </button>
      </header>

      <main className="w-full max-w-md flex flex-col gap-5">
        <div className="text-center mb-4">
          <h1 className="text-3xl font-bold text-white mb-2">
            Create a new workspace
          </h1>
          <p className="text-gray-400">
            Workspaces are shared environments where teams can work on projects,
            cycles and issues.
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-8 bg-[#17181B] p-7 rounded-[10px]"
        >
          <div>
            <label
              htmlFor="workspaceName"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Workspace Name
            </label>
            <input
              id="workspaceName"
              type="text"
              {...register("workspaceName", {
                required: "Workspace name is required.",
              })}
              className="w-full bg-[#1e1e1e] border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            {errors.workspaceName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.workspaceName.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="workspaceUrl"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Workspace URL
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-300 font-semibold">
                bento.app/
              </span>
              <input
                id="workspaceUrl"
                type="text"
                {...register("workspaceUrl", {
                  required: "Workspace URL is required.",
                  validate: (value) =>
                    !/\s/.test(value) || "No spaces allowed in URL.",
                })}
                className={`w-full bg-[#1e1e1e] rounded-md pl-[93px] pr-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 border ${getUrlInputBorder()}`}
              />
            </div>
            {errors.workspaceUrl && (
              <p className="text-red-500 text-sm mt-1">
                {errors.workspaceUrl.message}
              </p>
            )}
            {isAvailable === false && !errors.workspaceUrl && (
              <p className="text-red-500 text-sm mt-1">
                This URL is already taken.
              </p>
            )}
            {isAvailable === true && !errors.workspaceUrl && (
              <p className="text-green-500 text-sm mt-1">
                This URL is available.
              </p>
            )}
          </div>
          <div className="">
            <button
              type="submit"
              disabled={isAvailable !== true || isChecking || isSubmitting}
              className="w-full px-[90px]  cursor-pointer bg-[#5E6AD2] hover:bg-[#757fd7] text-white font-semibold py-3.5 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-purple-500  disabled:cursor-not-allowed"
            >
              {isSubmitting
                ? "Creating..."
                : isChecking
                ? "Checking..."
                : "Create workspace"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default CreateWorkspace;
