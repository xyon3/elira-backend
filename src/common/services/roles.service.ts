import { Injectable } from '@nestjs/common';
import { Permission } from '../enums/permission.enums';
import { Request } from 'express';

@Injectable()
export class RolesService {
  private readonly permissionMapping = {
    custodian: [Permission.ADMIN],
    uploader: [
      Permission.VIEW_USERS,
      Permission.VIEW_BOOKS,
      Permission.VIEW_RESEARCH,
      Permission.EDIT_BOOKS,
      Permission.EDIT_RESEARCH,
    ],
    department: [
      Permission.VIEW_BOOKS,
      Permission.VIEW_RESEARCH,
      Permission.EDIT_BOOKS,
      Permission.EDIT_RESEARCH,
    ],
    guest: [Permission.VIEW_BOOKS, Permission.VIEW_RESEARCH],
  };

  public checkPermission(request: Request, permission: Permission) {}

  public getALlPermission() {
    return this.permissionMapping;
  }

  public getPermission(role: string) {
    return this.permissionMapping[role as keyof typeof this.permissionMapping];
  }
}
