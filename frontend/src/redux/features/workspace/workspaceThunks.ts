import { createAsyncThunk } from "@reduxjs/toolkit";
import instance from "@/lib/axios";
import { Workspace, Membership } from "../auth/authTypes";

// Define the shape of the data you expect from the API
interface CreateWorkspaceResponse {
  workspace: Workspace;
  team: {
    // Assuming the API also returns a default team
    _id: string;
    name: string;
    slug: string;
  };
}

// Define the arguments the thunk will receive
interface CreateWorkspaceArgs {
  name: string;
  slug: string;
}

export const createWorkspace = createAsyncThunk<
  CreateWorkspaceResponse, // Type of the successful return value
  CreateWorkspaceArgs, // Type of the arguments passed to the thunk
  { rejectValue: string } // Type for handled errors
>(
  "workspace/create", // Action type prefix
  async ({ name, slug }, thunkAPI) => {
    try {
      // The API endpoint for creating a workspace is likely different from the validation one
      const response = await instance.post<CreateWorkspaceResponse>(
        "/workspace/createworkspace",
        {
          name,
          slug,
        }
      );
      return response.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.msg || "Failed to create workspace";
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);
