const apiRequest = async (
  url: string = '',
  optionObj: RequestInit = {}
): Promise<any> => {
  try {
    const response = await fetch(url, {
      ...optionObj,
      headers: {
        'Content-Type': 'application/json',
        ...(optionObj.headers || {}),
      },
    });

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    return await response.json();
  } catch (err: any) {
    console.error("Fetch error:", err.message);
    throw err;
  }
};

export default apiRequest;
