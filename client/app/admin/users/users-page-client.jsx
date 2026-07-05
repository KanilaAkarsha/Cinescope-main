"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { updateUserRole } from "@/services/user.service";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export default function UsersPageClient({ initialUsers }) {
  const formatDate = (iso) => {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleDateString("en-GB");
  };
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");
  const [roleFilter, setRoleFilter] = useState("all");
  const [users, setUsers] = useState(initialUsers);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showEditRole, setShowEditRole] = useState(false);
  const [selectedRole, setSelectedRole] = useState("user");
  const [isSavingRole, setIsSavingRole] = useState(false);

  const getRoleBadgeClass = (role) => {
    if (role === "admin") {
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
    }

    if (role === "moderator") {
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    }

    return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
  };

  const filteredUsers = users
    .filter(
      (user) =>
        (roleFilter === "all" || user.role === roleFilter) &&
        ((user.name ?? "").toLowerCase().includes(searchQuery.toLowerCase()) ||
          (user.email ?? "").toLowerCase().includes(searchQuery.toLowerCase())),
    )
    .sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortDirection === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return 0;
    });

  const handleSort = (field) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getSortIcon = (field) => {
    if (field !== sortField) return null;
    return sortDirection === "asc" ? (
      <ChevronUp className="ml-1 h-4 w-4" />
    ) : (
      <ChevronDown className="ml-1 h-4 w-4" />
    );
  };

  const handleEditRole = (user) => {
    setSelectedUser(user);
    setSelectedRole(user?.role ?? "user");
    setShowEditRole(true);
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Users</h2>
        <p className="text-muted-foreground">
          Manage user accounts and permissions
        </p>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex w-full items-center space-x-2 md:w-1/2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9"
          />
        </div>
        <div className="flex items-center gap-2">
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="h-9 w-45">
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="moderator">Moderator</SelectItem>
              <SelectItem value="user">User</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" className="h-9">
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            Filters
          </Button>
        </div>
      </div>

      {filteredUsers.length === 0 ? (
        <div className="rounded-md border py-12 text-center text-muted-foreground">
          No users found.
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-20">ID</TableHead>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort("name")}>
                  <div className="flex items-center">
                    Name
                    {getSortIcon("name")}
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort("email")}>
                  <div className="flex items-center">
                    Email
                    {getSortIcon("email")}
                  </div>
                </TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort("createdAt")}>
                  <div className="flex items-center">
                    Created At
                    {getSortIcon("createdAt")}
                  </div>
                </TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user, index) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.image || user.profilePicture || user.avatar} alt={user.name} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span>{user.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge className={getRoleBadgeClass(user.role)}>
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        user.status === "active" ? "default" : "destructive"
                      }>
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(user.createdAt)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleEditRole(user)}>
                          Edit Role
                        </DropdownMenuItem>
                        <DropdownMenuItem>View Profile</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className={
                            user.status === "active" ? "text-destructive" : ""
                          }>
                          {user.status === "active"
                            ? "Suspend User"
                            : "Activate User"}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={showEditRole} onOpenChange={setShowEditRole}>
        <DialogContent className="sm:max-w-106.25">
          <DialogHeader>
            <DialogTitle>Edit User Role</DialogTitle>
            <DialogDescription>
              Change the role for {selectedUser?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger id="role">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="moderator">Moderator</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowEditRole(false)}>
              Cancel
            </Button>
            <Button
              type="button"
              onClick={async () => {
                if (!selectedUser) return;
                setIsSavingRole(true);
                try {
                  const data = await updateUserRole(
                    selectedUser.id,
                    selectedRole,
                  );
                  if (data?.success) {
                    setUsers((prev) =>
                      prev.map((u) =>
                        u.id === selectedUser.id
                          ? { ...u, role: selectedRole }
                          : u,
                      ),
                    );
                    setShowEditRole(false);
                    setSelectedUser(null);
                  } else {
                    console.error("Failed to update role", data);
                  }
                } catch (err) {
                  console.error(err);
                } finally {
                  setIsSavingRole(false);
                }
              }}>
              {isSavingRole ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
