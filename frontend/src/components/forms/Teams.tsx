"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { teamSchema, teamsSchemaData } from "@/validation/schema/forms/teams";
import { useSelector, UseSelector } from "react-redux";
import { selectCurrentWorkspaceTeams } from "@/redux/features/workspace/workspaceSelectors";

const CreateTeamForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<teamsSchemaData>({
    resolver: zodResolver(teamSchema),
    defaultValues: {
      teamName: "",
      teamSlug: "",
    },
  });
  const teams = useSelector(selectCurrentWorkspaceTeams);
  console.log(teams);

  // Watch teamName to auto-generate slug
  const teamName = watch("teamName");

  React.useEffect(() => {
    if (teamName) {
      // Clean and shorten name
      let baseSlug = teamName
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, "") // only A-Z0-9
        .substring(0, 3); // take up to 4 chars

      if (!baseSlug) return;

      let slug = baseSlug;
      let counter = 1;

      const existingSlugs = teams.map((t) => t.slug.toUpperCase());

      // If slug already exists, append/increment number
      while (existingSlugs.includes(slug)) {
        slug = `${baseSlug}${counter}`;
        counter++;
      }

      setValue("teamSlug", slug);
    }
  }, [teamName, setValue, teams]);

  const onSubmit = async (data: teamsSchemaData) => {
    try {
      console.log("Form submitted:", data);
      // Handle form submission here
      // e.g., API call to create team
    } catch (error) {
      console.error("Error creating team:", error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto flex flex-col justify-center  h-screen">
      <div className="mb-6">
        <h1 className="text-[22px] font-semibold ">Create a new team</h1>
        <p className="text-gray-400 text-[13px]">
          Create a new team to manage separate cycles, workflows and
          notifications
        </p>
      </div>
      <div className="  p-4  bg-[#17181B] text-white rounded-lg">
        <form
          id="createTeamForm"
          onSubmit={handleSubmit(onSubmit)}
          className=" "
        >
          {/* Team Name Field */}
          <div className="flex justify-between items-center">
            <div>
              <label
                htmlFor="teamName"
                className="block text-[15px] font-medium "
              >
                Team name
              </label>
              {errors.teamName && (
                <p className=" text-sm text-[#FF8683]">
                  {errors.teamName.message}
                </p>
              )}
            </div>
            <div>
              <input
                {...register("teamName")}
                id="teamName"
                type="text"
                placeholder="e.g. Engineering"
                className="w-full px-3 py-1.5  border-[0.5px] border-gray-700 rounded-md 
                                   text-white placeholder-gray-500 focus:outline-none focus:ring-2 
                                   focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="border-t border-gray-700 my-4"></div>

          {/* Identifier/Slug Field */}
          <div className="flex justify-between items-center">
            <div>
              <label
                htmlFor="teamSlug"
                className="block text-[15px] font-medium "
              >
                Identifier
              </label>

              {errors.teamSlug ? (
                <p className=" text-sm text-[#FF8683]">
                  {errors.teamSlug.message}
                </p>
              ) : (
                <p className="text-xs text-gray-500">
                  Used to identify issues from this team (e.g. ENG-123)
                </p>
              )}
            </div>
            <div>
              <input
                {...register("teamSlug")}
                id="teamSlug"
                type="text"
                placeholder="e.g. ENG"
                className="w-full px-3 py-1.5 border-[0.5px] border-gray-700 rounded-md 
                                   text-white placeholder-gray-500 focus:outline-none focus:ring-2 
                                   focus:ring-blue-500 focus:border-transparent uppercase"
                maxLength={7}
              />
            </div>
          </div>

          {/* Submit Button */}
        </form>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="submit"
          form="createTeamForm"
          disabled={isSubmitting}
          className="px-2 py-2       text-[14px] bg-[#6D78E7] cursor-pointer text-white rounded-md hover:bg-[#5d67cf]
                                   focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 
                                   disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Creating..." : "Create team"}
        </button>
      </div>
    </div>
  );
};

export default CreateTeamForm;
