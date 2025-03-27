// GitHub Marketplace API service
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8080';

export async function searchApps(query) {
  try {
    // Connect to the Go backend
    const response = await fetch(`${BACKEND_URL}/api/search?q=${encodeURIComponent(query)}`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error searching GitHub Marketplace apps:', error);
    
    // Fallback to mock data if API call fails
    return mockSearchResults(query);
  }
}

// Fallback mock data in case the backend is unavailable
function mockSearchResults(query) {
  const mockApps = [
    {
      id: '1',
      name: 'CodeQL',
      description: 'Semantic code analysis engine that helps you identify vulnerabilities',
      url: 'https://github.com/marketplace/codeql',
      category: 'Security',
      icon: 'https://github.githubassets.com/images/modules/marketplace/codeql.png'
    },
    {
      id: '2',
      name: 'CircleCI',
      description: 'Continuous integration and delivery platform',
      url: 'https://github.com/marketplace/circleci',
      category: 'CI/CD',
      icon: 'https://github.githubassets.com/images/modules/marketplace/circleci.png'
    },
    {
      id: '3',
      name: 'Sentry',
      description: 'Application monitoring and error tracking software',
      url: 'https://github.com/marketplace/sentry',
      category: 'Monitoring',
      icon: 'https://github.githubassets.com/images/modules/marketplace/sentry.png'
    },
    {
      id: '4',
      name: 'Dependabot',
      description: 'Automated dependency updates',
      url: 'https://github.com/marketplace/dependabot',
      category: 'Dependencies',
      icon: 'https://github.githubassets.com/images/modules/marketplace/dependabot.png'
    },
    {
      id: '5',
      name: 'GitHub Actions',
      description: 'Automate your workflow from idea to production',
      url: 'https://github.com/features/actions',
      category: 'Automation',
      icon: 'https://github.githubassets.com/images/modules/marketplace/actions.png'
    }
  ];
  
  if (!query) return mockApps;
  
  const lowerQuery = query.toLowerCase();
  return mockApps.filter(
    app => 
      app.name.toLowerCase().includes(lowerQuery) || 
      app.description.toLowerCase().includes(lowerQuery) ||
      app.category.toLowerCase().includes(lowerQuery)
  );
} 