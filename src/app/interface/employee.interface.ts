export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: {
    id: string;
    name: string;
  };
  createdAt: string;
  desc: string | null;
  salary: number | null;
  parentId: string | null;
  children: Employee[];
}
