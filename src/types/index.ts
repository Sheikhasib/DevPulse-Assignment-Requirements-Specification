export const roles = ["admin", "contributor"] as const;

export type Role = (typeof roles)[number];

export type User = {
  id: number;
  name: string;
  email: string;
  password: string;
  role: Role;
  created_at: Date;
  updated_at: Date;
};

export type RUser = Omit<User, "password">;

export type Issue = {
  id: number;
  title: string;
  description: string;
  type: string;
  status: string;
  reporter_id: number;
  created_at: Date;
  updated_at: Date;
};

// export type RIssue = Omit<Issue, "reporter_id">;
