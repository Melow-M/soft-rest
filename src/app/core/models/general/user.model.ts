export interface User {
  uid: string;
  displayName: string;
  dni: string;
  roleId: string;
  roleName: string;
  createdAt: Date;
  createdBy: User;
  editedAt: Date;
  editedBy: User;
}