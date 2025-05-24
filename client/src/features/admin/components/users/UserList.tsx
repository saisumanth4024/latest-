import React, { useState } from 'react';
import { useGetUsersQuery } from '../../adminApi';
import { AdminUser } from '../../types';
import { Resource, Action } from '../../rbac/rbacConfig';
import { PermissionGuard, PermissionButton } from '../../rbac/PermissionGuard';
import { usePermissions } from '../../rbac/usePermissions';

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MoreHorizontal, Plus, Search, Trash, Edit, UserX, UserCheck, Eye } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { format } from 'date-fns';

// Status badge component with appropriate colors
const UserStatusBadge = ({ status }: { status: string }) => {
  switch (status) {
    case 'active':
      return <Badge className="bg-green-500">{status}</Badge>;
    case 'inactive':
      return <Badge className="bg-yellow-500">{status}</Badge>;
    case 'banned':
      return <Badge className="bg-red-500">{status}</Badge>;
    case 'pending':
      return <Badge className="bg-blue-500">{status}</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
};

// Get user initials for avatar fallback
const getUserInitials = (user: AdminUser): string => {
  const firstInitial = user.firstName?.[0] || user.username[0];
  const lastInitial = user.lastName?.[0] || '';
  return (firstInitial + lastInitial).toUpperCase();
};

export const UserList: React.FC = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  
  const { can } = usePermissions();
  const { toast } = useToast();
  
  // Query to get users with pagination and filters
  const { data, isLoading, error } = useGetUsersQuery({
    page,
    limit,
    search: search || undefined,
    status: statusFilter as any || undefined,
  });
  
  // Handle search input
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1); // Reset to first page on new search
  };
  
  // Clear all filters
  const clearFilters = () => {
    setSearch('');
    setStatusFilter(null);
    setPage(1);
  };
  
  // Set status filter
  const handleStatusFilter = (status: string | null) => {
    setStatusFilter(status);
    setPage(1); // Reset to first page on new filter
  };
  
  // Handle pagination
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };
  
  // Show toast for unimplemented actions
  const showActionToast = (action: string, userId: string) => {
    toast({
      title: `${action} User`,
      description: `${action} operation for user ID: ${userId} would be implemented here.`,
    });
  };
  
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Users</CardTitle>
        
        <div className="flex space-x-2">
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search users..."
              className="pl-8"
              value={search}
              onChange={handleSearchChange}
            />
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Filter Status</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>User Status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleStatusFilter('active')}>
                Active
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStatusFilter('inactive')}>
                Inactive
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStatusFilter('banned')}>
                Banned
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStatusFilter('pending')}>
                Pending
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStatusFilter(null)}>
                All
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button variant="ghost" onClick={clearFilters}>
            Clear
          </Button>
          
          <PermissionGuard
            resource={Resource.USERS}
            action={Action.CREATE}
          >
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </PermissionGuard>
        </div>
      </CardHeader>
      
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-500">
            Error loading users. Please try again.
          </div>
        ) : !data || data.data.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            No users found. {search && 'Try a different search term.'}
          </div>
        ) : (
          <Table>
            <TableCaption>
              {statusFilter ? `Showing ${statusFilter} users` : 'All users'} 
              {search && ` matching "${search}"`}
              {` (${data.pagination.total} total)`}
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.data.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage src={user.profileImageUrl} />
                      <AvatarFallback>{getUserInitials(user)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{user.username}</div>
                      <div className="text-sm text-muted-foreground">{user.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{user.role.name}</Badge>
                  </TableCell>
                  <TableCell>
                    <UserStatusBadge status={user.status} />
                  </TableCell>
                  <TableCell>
                    {format(new Date(user.createdAt), 'MMM d, yyyy')}
                  </TableCell>
                  <TableCell>
                    {user.lastLogin 
                      ? format(new Date(user.lastLogin), 'MMM d, yyyy')
                      : 'Never'
                    }
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        
                        <PermissionGuard
                          resource={Resource.USERS}
                          action={Action.READ}
                        >
                          <DropdownMenuItem onClick={() => showActionToast('View', user.id)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Profile
                          </DropdownMenuItem>
                        </PermissionGuard>
                        
                        <PermissionGuard
                          resource={Resource.USERS}
                          action={Action.UPDATE}
                        >
                          <DropdownMenuItem onClick={() => showActionToast('Edit', user.id)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit User
                          </DropdownMenuItem>
                        </PermissionGuard>
                        
                        <PermissionGuard
                          resource={Resource.USERS}
                          action={Action.DELETE}
                        >
                          <DropdownMenuItem 
                            className="text-red-600"
                            onClick={() => showActionToast('Delete', user.id)}
                          >
                            <Trash className="mr-2 h-4 w-4" />
                            Delete User
                          </DropdownMenuItem>
                        </PermissionGuard>
                        
                        {user.status === 'banned' ? (
                          <PermissionGuard
                            resource={Resource.USERS}
                            action={Action.UPDATE}
                          >
                            <DropdownMenuItem onClick={() => showActionToast('Unban', user.id)}>
                              <UserCheck className="mr-2 h-4 w-4" />
                              Unban User
                            </DropdownMenuItem>
                          </PermissionGuard>
                        ) : (
                          <PermissionGuard
                            resource={Resource.USERS}
                            action={Action.UPDATE}
                          >
                            <DropdownMenuItem onClick={() => showActionToast('Ban', user.id)}>
                              <UserX className="mr-2 h-4 w-4" />
                              Ban User
                            </DropdownMenuItem>
                          </PermissionGuard>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        
        {data && data.pagination.totalPages > 1 && (
          <div className="mt-4 flex justify-center">
            <Pagination>
              <PaginationContent>
                {page > 1 && (
                  <PaginationItem>
                    <PaginationPrevious onClick={() => handlePageChange(page - 1)} />
                  </PaginationItem>
                )}
                
                {Array.from({ length: Math.min(5, data.pagination.totalPages) }, (_, i) => {
                  // Show first page, last page, current page, and neighbors
                  const totalPages = data.pagination.totalPages;
                  let pageNumber;
                  
                  if (totalPages <= 5) {
                    // If 5 or fewer pages, show all
                    pageNumber = i + 1;
                  } else if (page <= 3) {
                    // Near start
                    if (i < 4) pageNumber = i + 1;
                    else pageNumber = totalPages;
                  } else if (page >= totalPages - 2) {
                    // Near end
                    if (i === 0) pageNumber = 1;
                    else pageNumber = totalPages - (4 - i);
                  } else {
                    // Middle
                    if (i === 0) pageNumber = 1;
                    else if (i === 4) pageNumber = totalPages;
                    else pageNumber = page + (i - 2);
                  }
                  
                  // Add ellipsis logic
                  if (
                    (totalPages > 5 && i === 1 && pageNumber !== 2) ||
                    (totalPages > 5 && i === 3 && pageNumber !== totalPages - 1)
                  ) {
                    return (
                      <PaginationItem key={`ellipsis-${i}`}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    );
                  }
                  
                  return (
                    <PaginationItem key={pageNumber}>
                      <PaginationLink
                        isActive={page === pageNumber}
                        onClick={() => handlePageChange(pageNumber)}
                      >
                        {pageNumber}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}
                
                {page < data.pagination.totalPages && (
                  <PaginationItem>
                    <PaginationNext onClick={() => handlePageChange(page + 1)} />
                  </PaginationItem>
                )}
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </CardContent>
    </Card>
  );
};