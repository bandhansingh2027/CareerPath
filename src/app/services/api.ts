export const API_BASE_URL = '/api';

async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers: Record<string, string> = { 'Content-Type': 'application/json', ...(options.headers as Record<string, string> || {}) };

  const response = await fetch(url, { ...options, headers });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || `API Error: ${response.status}`);
  }
  return response.json();
}

export const careerService = {
  getCareers: () => fetchApi('/careers'),
  getCareerById: (id: string) => fetchApi(`/careers/${id}`)
};

export const quizService = {
  getQuestions: () => fetchApi('/quiz/questions'),
  submitAnswers: (answers: Record<string, unknown>) => fetchApi('/analyze', {
    method: 'POST',
    body: JSON.stringify({ answers })
  })
};

export const resourceService = {
  getAll: () => fetchApi('/resources')
};

export const statsService = {
  getStats: () => fetchApi('/stats')
};

export const compareService = {
  compare: (ids: string[]) => fetchApi('/compare', {
    method: 'POST',
    body: JSON.stringify({ ids })
  })
};
