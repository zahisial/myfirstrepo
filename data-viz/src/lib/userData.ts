export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    imageUrl: string;
  }
  
  export const getUser = async (): Promise<User> => {
    // Simulating an API call with a delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      imageUrl: '/placeholder.svg?height=32&width=32'
    };
  };