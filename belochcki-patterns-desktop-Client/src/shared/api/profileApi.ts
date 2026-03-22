import type {EmployeeProfile,UpdateEmployeeProfileDto,ApiResponse} from './types/UserProfile';

const API_BASE_URL = 'http://localhost:8085/api';

const getAccessToken = () => localStorage.getItem('accessToken');
const getUserId = () => localStorage.getItem('userId');

const createHeaders = (withJson = false): Record<string, string> => {
  const token = getAccessToken();

  const headers: Record<string, string> = {
    accept: '*/*',
  };

  if (withJson) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};

async function fetchWithLog<T>(
  url: string,
  options: RequestInit
): Promise<ApiResponse<T>> {
  const fullUrl = `${API_BASE_URL}${url}`;

  console.log('🚀 API Request:', {
    method: options.method,
    url: fullUrl,
    headers: options.headers,
    body: options.body ? JSON.parse(options.body as string) : undefined,
    tokenFromStorage: getAccessToken(),
    userIdFromStorage: getUserId(),
    timestamp: new Date().toISOString(),
  });

  const response = await fetch(fullUrl, options);

  const rawText = await response.text();
  let data: any = null;

  try {
    data = rawText ? JSON.parse(rawText) : null;
  } catch {
    data = rawText;
  }

  if (!response.ok) {
    console.error('❌ API Error Response:', {
      status: response.status,
      statusText: response.statusText,
      body: data,
    });

    throw new Error(
      `Ошибка ${response.status}: ${
        data?.message || data || response.statusText || 'Request failed'
      }`
    );
  }

  console.log('✅ API Response:', {
    method: options.method,
    url: fullUrl,
    status: response.status,
    statusText: response.statusText,
    data,
    timestamp: new Date().toISOString(),
  });

  return {
    data,
    status: response.status,
    message: response.statusText,
  };
}

export const profileApi = {
  getProfile: async (): Promise<ApiResponse<EmployeeProfile>> => {
    const userId = getUserId();

    if (!userId) {
      throw new Error('userId не найден в localStorage');
    }

    return fetchWithLog<EmployeeProfile>(`/clients/${userId}`, {
      method: 'GET',
      headers: createHeaders(),
    });
  },

  updateProfile: async (
    updatedFields: UpdateEmployeeProfileDto
  ): Promise<ApiResponse<EmployeeProfile>> => {
    const userId = getUserId();

    if (!userId) {
      throw new Error('userId не найден в localStorage');
    }

    const currentProfileResponse = await profileApi.getProfile();
    const currentProfile = currentProfileResponse.data;

    const requestBody: EmployeeProfile = {
      id: currentProfile.id,
      status: currentProfile.status,
      token: currentProfile.token,
      name: updatedFields.name,
      login: updatedFields.login,
      password: updatedFields.password,
      creditRating: currentProfile.creditRating,
    };


    return fetchWithLog<EmployeeProfile>(`/clients/${userId}`, {
      method: 'PUT',
      headers: createHeaders(true),
      body: JSON.stringify(requestBody),
    });
  },
};