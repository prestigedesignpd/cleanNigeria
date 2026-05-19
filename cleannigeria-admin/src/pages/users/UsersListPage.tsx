import { useState } from 'react';
import { Plus, Search, Filter, MoreHorizontal, Download, User as UserIcon, ExternalLink, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useAdminUsers } from '@/hooks/useAdminUsers';
import { Loader2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { Link } from 'react-router-dom';
import { UserFormModal } from '@/components/users/UserFormModal';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function UsersListPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' }>({ 
    key: 'name', 
    direction: 'asc' 
  });
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: usersResponse, isLoading } = useAdminUsers();
  const users = usersResponse?.data || [];

  const filteredUsers = users
    .filter((user: any) => {
      const matchesSearch = 
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'All' || user.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    })
    .sort((a: any, b: any) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

  const handleSort = (key: string) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'desc' ? 'asc' : 'desc'
    }));
  };

  const handleEdit = (user: any) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setSelectedUser(null);
    setIsModalOpen(true);
  };

  return (
    <div className="p-6 md:p-8 max-w-[1400px] mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white tracking-tight">Users</h1>
          <p className="text-neutral-500 dark:text-neutral-400 mt-1">Manage all registered residents and business owners.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => toast.success("User list exported")}><Download className="h-4 w-4 mr-2" /> Export</Button>
          <Button onClick={handleAdd} className="bg-green-600 hover:bg-green-700 text-white font-semibold">
            <Plus className="h-4 w-4 mr-2" /> Add User
          </Button>
        </div>
      </div>

      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row gap-4 justify-between items-center bg-neutral-50/50 dark:bg-neutral-900/50">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <Input 
              placeholder="Search by name or email..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 h-10 bg-white dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800 shadow-none" 
            />
          </div>
          <div className="flex bg-neutral-100 dark:bg-neutral-800 p-1 rounded-lg">
             {['All', 'Active', 'Suspended'].map((status) => (
               <Button 
                 key={status}
                 variant="ghost" 
                 size="sm" 
                 onClick={() => setStatusFilter(status)}
                 className={cn(
                   "h-8 px-3 text-xs font-bold transition-all",
                   statusFilter === status 
                     ? "bg-white dark:bg-neutral-900 shadow-sm text-neutral-900 dark:text-white" 
                     : "text-neutral-500 hover:text-neutral-700"
                 )}
               >
                 {status}
               </Button>
             ))}
          </div>
          <Button variant="outline" className="w-full sm:w-auto h-10 border-neutral-200 dark:border-neutral-800">
            <Filter className="h-4 w-4 mr-2" /> More Filters
          </Button>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-neutral-50 dark:bg-neutral-900/50 hover:bg-neutral-50 dark:hover:bg-neutral-900/50">
                <TableHead className="font-semibold cursor-pointer group" onClick={() => handleSort('name')}>
                  <div className="flex items-center gap-1">
                    User Profile
                    <TrendingUp className={cn("h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity", sortConfig.key === 'name' && "opacity-100")} />
                  </div>
                </TableHead>
                <TableHead className="font-semibold">Contact Info</TableHead>
                <TableHead className="font-semibold">Account Type</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="text-right font-semibold pr-8">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-48 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <Loader2 className="h-10 w-10 text-green-500 animate-spin" />
                      <p className="text-sm text-neutral-500 font-medium">Fetching users...</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <TableRow key={user.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30 group transition-colors">
                    <TableCell className="py-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border border-neutral-200 shadow-sm">
                          <AvatarImage src={user.avatar} alt={user.name} />
                          <AvatarFallback className="bg-green-50 text-green-700 font-bold">{user.name?.[0] || 'U'}</AvatarFallback>
                        </Avatar>
                        <div>
                          <Link to={`/users/${user.id}`} className="font-bold text-neutral-900 dark:text-white hover:text-green-600 flex items-center gap-1.5 transition-colors">
                            {user.name}
                            <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </Link>
                          <div className="text-xs text-neutral-500 font-medium">ID: {user.id}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{user.email}</span>
                        <span className="text-xs text-neutral-500">{user.phone}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-medium">
                        {user.accountType}
                      </Badge>
                      <div className="text-xs text-neutral-500 mt-1 font-medium italic">{user.subscription?.plan || 'Standard'} Plan</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={
                        user.status === 'Active' 
                          ? 'bg-green-50 text-green-700 dark:bg-green-900/20 border-green-200 font-semibold' 
                          : 'bg-red-50 text-red-700 dark:bg-red-900/20 border-red-200 font-semibold'
                      }>
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right pr-8">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-9 w-9 p-0 hover:bg-neutral-100 dark:hover:bg-neutral-800">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 bg-white dark:bg-neutral-950">
                          <DropdownMenuLabel>Manage User</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem asChild className="cursor-pointer">
                            <Link to={`/users/${user.id}`}>View profile</Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer" onClick={() => handleEdit(user)}>
                            Edit details
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-700 focus:bg-red-50" onClick={() => toast.warning(`Suspension flow initiated for ${user.name}`)}>
                            Suspend account
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-48 text-center text-neutral-500">
                    <div className="flex flex-col items-center gap-2">
                      <UserIcon className="h-8 w-8 text-neutral-300 mb-2" />
                      <p>No users found matching "{searchTerm}"</p>
                      <Button variant="link" onClick={() => setSearchTerm('')} className="text-green-600">Clear filters</Button>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        
        <div className="p-4 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between text-sm text-neutral-500 bg-neutral-50/30">
          <div>Showing <b>{filteredUsers.length}</b> users</div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="h-8" disabled>Previous</Button>
            <Button variant="outline" size="sm" className="h-8" disabled>Next</Button>
          </div>
        </div>
      </div>

      <UserFormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        user={selectedUser} 
      />
    </div>
  );
}
