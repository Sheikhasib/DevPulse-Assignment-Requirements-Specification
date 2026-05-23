export const USER_ROLES = {
  contributor: "contributor",
  maintainer: "maintainer",
} as const;

// export type ROLES = "contributor" | "maintainer";
export type ROLES = (typeof USER_ROLES)[keyof typeof USER_ROLES];
