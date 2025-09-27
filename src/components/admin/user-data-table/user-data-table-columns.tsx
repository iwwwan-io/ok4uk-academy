import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MoreHorizontal } from "lucide-react";
import { Tables } from "@/types/database";

export const generateColumns = ({
  onEdit,
  onDelete,
  onUpdateRole,
}: {
  onEdit: (profile: Tables<"profiles">) => void;
  onDelete: (id: string) => void;
  onUpdateRole: (id: string, role: Tables<"profiles">["role"]) => void;
}): ColumnDef<Tables<"profiles">>[] => [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("name")}</div>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const profile = row.original;
      return (
        <Select
          value={profile.role}
          onValueChange={(value) =>
            onUpdateRole(profile.id, value as Tables<"profiles">["role"])
          }
        >
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="student">Student</SelectItem>
            <SelectItem value="assessor">Assessor</SelectItem>
          </SelectContent>
        </Select>
      );
    },
  },
  {
    accessorKey: "email_verified",
    header: "Verified",
    cell: ({ row }) => {
      const verified = row.getValue("email_verified") as boolean;
      return (
        <Badge
          className={
            verified
              ? "bg-green-500 hover:bg-green-500/80 text-white"
              : "bg-red-500 hover:bg-red-500/80 text-white"
          }
        >
          {verified ? "Verified" : "Unverified"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: "Created",
    cell: ({ row }) => {
      const date = new Date(row.getValue("created_at") as string);
      return <div>{format(date, "MMM dd, yyyy")}</div>;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const profile = row.original;
      const handleCopy = async () => {
        try {
          await navigator.clipboard.writeText(profile.id);
          toast.success("User ID copied to clipboard!");
        } catch (err) {
          console.log(err);
          toast.error("Failed to copy ID");
        }
      };
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={handleCopy}>
              Copy user ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onEdit(profile)}>
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-red-600 focus:bg-red-50 focus:text-red-600"
              onClick={() => onDelete(profile.id)}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
