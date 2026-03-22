export type ThemeMode = 'LIGHT' | 'DARK';

interface ThemeResponse {
  theme: ThemeMode;
}

const API_BASE_URL = 'http://localhost:8089/api';

const getUserId = () => localStorage.getItem('userId');

async function parseResponse<T>(response: Response): Promise<T> {
  const text = await response.text();

  try {
    return text ? JSON.parse(text) : ({} as T);
  } catch {
    return text as T;
  }
}

export const themeApi = {
  async getTheme(): Promise<ThemeMode> {
    const userId = getUserId();

    if (!userId) {
      throw new Error('userId не найден в localStorage');
    }

    const response = await fetch(
      `${API_BASE_URL}/userSettings/${userId}/theme`,
      {
        method: 'GET',
        headers: {
          accept: '*/*',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Ошибка ${response.status}: не удалось получить тему`);
    }

    const data = await parseResponse<ThemeResponse>(response);
    return data.theme;
  },

  async updateTheme(theme: ThemeMode): Promise<void> {
    const userId = getUserId();

    if (!userId) {
      throw new Error('userId не найден в localStorage');
    }

    const response = await fetch(
      `${API_BASE_URL}/userSettings/${userId}/theme`,
      {
        method: 'PUT',
        headers: {
          accept: '*/*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ theme }),
      }
    );

    if (!response.ok) {
      throw new Error(`Ошибка ${response.status}: не удалось сохранить тему`);
    }
  },
};