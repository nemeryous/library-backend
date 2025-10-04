import { RoleType } from "src/guards/role-type";

export class KeycloakUser {
  keycloakId: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: RoleType;

  static toUserRequest(user: KeycloakUser) {
    return {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    };
  }
}
