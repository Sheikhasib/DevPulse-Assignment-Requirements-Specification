export const USER_ROLES = {
  contributor: "contributor",
  maintainer: "maintainer",
} as const;

// export type ROLES = "contributor" | "maintainer";
export type ROLES = (typeof USER_ROLES)[keyof typeof USER_ROLES];

// export type User = {
//   id: number;
//   name: string;
//   email: string;
//   password: string;
//   role?: ROLES;
//   created_at: Date;
//   updated_at: Date;
// };

// export type RUser = Omit<User, "password">;

// export type Issue = {
//   id: number;
//   title: string;
//   description: string;
//   type: string;
//   status: string;
//   reporter_id: number;
//   created_at: Date;
//   updated_at: Date;
// };

// export type RIssue = Omit<Issue, "reporter_id">;
