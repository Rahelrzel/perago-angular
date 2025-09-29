export interface User {
  id: string;
  firstName: string;
  lastName: string;
  desc: string | null;
  salary: number;
  email: string;
  parentId: string | null;
  createdAt: string;
  updatedAt: string;
  role: {
    id: string;
    name: string;
  };
  parent: User | null;
  token: string;
}
