// store/thunks/issueThunks.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import { issueAPI } from "@/lib/axios";
import type {
  CreateIssueData,
  Issue,
  IssueFilters,
  IssuesResponse,
  APIResponse,
} from "./issueTypes";

export const createIssue = createAsyncThunk<
  APIResponse<Issue>,
  CreateIssueData,
  { rejectValue: string }
>("issues/createIssue", async (issueData, { rejectWithValue }) => {
  try {
    const response = await issueAPI.createIssue(issueData);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to create issue"
    );
  }
});

export const fetchIssues = createAsyncThunk<
  APIResponse<IssuesResponse>,
  Partial<IssueFilters>,
  { rejectValue: string }
>("issues/fetchIssues", async (filters = {}, { rejectWithValue }) => {
  try {
    const response = await issueAPI.getIssues(filters);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch issues"
    );
  }
});

export const fetchIssueById = createAsyncThunk<
  APIResponse<Issue>,
  string,
  { rejectValue: string }
>("issues/fetchIssueById", async (issueId, { rejectWithValue }) => {
  try {
    const response = await issueAPI.getIssueById(issueId);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch issue"
    );
  }
});

export const fetchIssueByIdentifier = createAsyncThunk<
  APIResponse<Issue>,
  string,
  { rejectValue: string }
>("issues/fetchIssueByIdentifier", async (identifier, { rejectWithValue }) => {
  try {
    const response = await issueAPI.getIssueByIdentifier(identifier);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch issue"
    );
  }
});
