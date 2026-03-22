import axios from "axios";
import { profileApi } from "../profileApi";

export type Theme = "LIGHT" | "DARK";

export interface UserSettingsResponse {
  userId: string;
  theme: Theme;
  hiddenAccountIds: string[];
}

export interface UserHiddenAccountsResponse {
  hiddenAccountIds: string[];
}

const USER_SETTINGS_API = "http://localhost:8089/api/userSettings";

const createAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
});

const resolveCurrentUserId = async (): Promise<string> => {
  const cachedUserId =
    localStorage.getItem("clientID") || localStorage.getItem("userId");

  if (cachedUserId) {
    return cachedUserId;
  }

  const profileResponse = await profileApi.getProfile();
  const userId = profileResponse.data.userId;

  localStorage.setItem("clientID", userId);
  localStorage.setItem("userId", userId);

  return userId;
};

export const getOrCreateUserSettings = async (): Promise<UserSettingsResponse> => {
  const userId = await resolveCurrentUserId();

  try {
    const [themeResponse, hiddenAccountsResponse] = await Promise.all([
      axios.get<{ theme: Theme }>(`${USER_SETTINGS_API}/${userId}/theme`, {
        headers: createAuthHeaders(),
      }),
      axios.get<UserHiddenAccountsResponse>(
        `${USER_SETTINGS_API}/${userId}/hiddenAccounts`,
        {
          headers: createAuthHeaders(),
        }
      ),
    ]);

    return {
      userId,
      theme: themeResponse.data.theme,
      hiddenAccountIds: hiddenAccountsResponse.data.hiddenAccountIds ?? [],
    };
  } catch {
    const createResponse = await axios.post<UserSettingsResponse>(
      USER_SETTINGS_API,
      {
        userId,
        theme: "LIGHT",
        hiddenAccountIds: [],
      },
      {
        headers: createAuthHeaders(),
      }
    );

    return createResponse.data;
  }
};

export const updateHiddenAccounts = async (
  hiddenAccountIds: string[]
): Promise<UserHiddenAccountsResponse> => {
  const userId = await resolveCurrentUserId();

  const response = await axios.put<UserHiddenAccountsResponse>(
    `${USER_SETTINGS_API}/${userId}/hiddenAccounts`,
    { hiddenAccountIds },
    {
      headers: createAuthHeaders(),
    }
  );

  return response.data;
};