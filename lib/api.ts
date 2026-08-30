const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

export async function fetchContent(sheetName: string = 'January26') {
  if (!API_URL) {
    console.warn('API URL is not defined in environment variables.');
    return [];
  }

  try {
    const response = await fetch(`${API_URL}?sheet=${sheetName}`);
    const result = await response.json();
    if (result.success) {
      return result.data;
    }
    throw new Error(result.message || 'Failed to fetch content');
  } catch (error) {
    console.error('Error fetching content:', error);
    return [];
  }
}

export async function createContent(payload: any, sheetName: string = 'January26') {
  if (!API_URL) return { success: false, message: 'API URL not configured' };

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sheet: sheetName,
        payload: payload,
      }),
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error creating content:', error);
    return { success: false, message: error instanceof Error ? error.message : 'Unknown error' };
  }
}
