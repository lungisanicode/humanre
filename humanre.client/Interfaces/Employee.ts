import { Team } from "./Team";

export interface Employee {
  id: number;
  fullName: string;
  emailAddress: string;
  cellphoneNumber?: string;
  teamId?: number;
  isManager: boolean;
  isTeamLead: boolean;
  managerId?: number;
  managerEmail?: string;
  createdDate: string;
  modifiedDate: string;
  team?: Team;
}
