/* this component will display user info but it will become server or client depending on the parent component */
/* this is the card component that will hold the information of the logged in user data */

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ExtendedUser } from "@/next-auth";

interface UserInfoProps {
  user?: ExtendedUser;
  label: string;
}

export const UserInfo = ({ user, label }: UserInfoProps) => {
  return (
    <Card className="w-[80%] md:w-[600px] shadow-md">
      <CardHeader>
        <p className="text-2xl font-semibold text-center">{label}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center rounded-lg border p-3 shadow-sm">
          <p className="text-sm font-medium">ID:</p>
          <p className="truncate max-w-[180px] text-xs font-mono p-1 bg-slate-100 rounded-md">
            {user?.id}
          </p>
        </div>
        <div className="flex justify-between items-center rounded-lg border p-3 shadow-sm">
          <p className="text-sm font-medium">Name:</p>
          <p className="truncate max-w-[180px] text-xs font-mono p-1 bg-slate-100 rounded-md">
            {user?.name}
          </p>
        </div>
        <div className="flex justify-between items-center rounded-lg border p-3 shadow-sm">
          <p className="text-sm font-medium">Email:</p>
          <p className="truncate max-w-[180px] text-xs font-mono p-1 bg-slate-100 rounded-md">
            {user?.email}
          </p>
        </div>
        <div className="flex justify-between items-center rounded-lg border p-3 shadow-sm">
          <p className="text-sm font-medium">Role:</p>
          <p className="truncate max-w-[180px] text-xs font-mono p-1 bg-slate-100 rounded-md">
            {user?.role}
          </p>
        </div>
        <div className="flex justify-between items-center rounded-lg border p-3 shadow-sm">
          <p className="text-sm font-medium">Two Factor Authentication:</p>
          <Badge variant={user?.isTwoFactorEnabled ? "success" : "destructive"}>
            {user?.isTwoFactorEnabled ? "ON" : "OFF"}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};
