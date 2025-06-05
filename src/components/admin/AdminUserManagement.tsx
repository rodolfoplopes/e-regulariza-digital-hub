
import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import UserRoleIndicator from "./UserRoleIndicator";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { edit, filter } from "lucide-react";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "admin" | "admin_master" | "admin_editor" | "admin_viewer";
  created_at: string;
  updated_at: string;
}

export default function AdminUserManagement() {
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [pendingRoleChange, setPendingRoleChange] = useState<{
    user: AdminUser;
    newRole: string;
  } | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchAdminUsers();
  }, []);

  const fetchAdminUsers = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .in('role', ['admin', 'admin_master', 'admin_editor', 'admin_viewer'])
        .order('name');

      if (error) throw error;

      setAdminUsers(data || []);
    } catch (error) {
      console.error('Error fetching admin users:', error);
      toast({
        variant: "destructive",
        title: "Erro ao carregar usuários",
        description: "Não foi possível carregar a lista de administradores.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredUsers = adminUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    
    return matchesSearch && matchesRole;
  });

  const handleEditUser = (user: AdminUser) => {
    setEditingUser({...user});
    setIsEditDialogOpen(true);
  };

  const handleRoleChange = (newRole: string) => {
    if (!editingUser) return;
    
    setPendingRoleChange({
      user: editingUser,
      newRole: newRole as AdminUser['role']
    });
    setIsConfirmDialogOpen(true);
  };

  const confirmRoleChange = async () => {
    if (!pendingRoleChange) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          role: pendingRoleChange.newRole,
          updated_at: new Date().toISOString()
        })
        .eq('id', pendingRoleChange.user.id);

      if (error) throw error;

      // Update local state
      setAdminUsers(users => 
        users.map(user => 
          user.id === pendingRoleChange.user.id 
            ? { ...user, role: pendingRoleChange.newRole as AdminUser['role'] }
            : user
        )
      );

      toast({
        title: "Permissão atualizada",
        description: `As permissões de ${pendingRoleChange.user.name} foram atualizadas para ${pendingRoleChange.newRole}.`,
      });

      setIsEditDialogOpen(false);
      setIsConfirmDialogOpen(false);
      setPendingRoleChange(null);
      setEditingUser(null);
    } catch (error) {
      console.error('Error updating role:', error);
      toast({
        variant: "destructive",
        title: "Erro ao atualizar permissão",
        description: "Não foi possível atualizar as permissões do usuário.",
      });
    }
  };

  const getStatusBadge = (user: AdminUser) => {
    return (
      <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
        Ativo
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-eregulariza-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestão de Administradores</h1>
          <p className="text-gray-600">Gerencie permissões de administradores do sistema</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Input
            placeholder="Buscar por nome ou e-mail..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filtrar por função" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as funções</SelectItem>
            <SelectItem value="admin_master">Super Admin</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="admin_editor">Admin Editor</SelectItem>
            <SelectItem value="admin_viewer">Admin Viewer</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>E-mail</TableHead>
              <TableHead>Função</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Criado em</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <UserRoleIndicator role={user.role} />
                </TableCell>
                <TableCell>
                  {getStatusBadge(user)}
                </TableCell>
                <TableCell>
                  {new Date(user.created_at).toLocaleDateString('pt-BR')}
                </TableCell>
                <TableCell className="text-right">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleEditUser(user)}
                  >
                    <edit className="h-4 w-4 mr-1" />
                    Editar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            
            {filteredUsers.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                  Nenhum administrador encontrado com os filtros selecionados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Editar Permissões do Administrador</DialogTitle>
            <DialogDescription>
              Altere as permissões de acesso do administrador.
            </DialogDescription>
          </DialogHeader>
          
          {editingUser && (
            <div className="space-y-4 py-4">
              <div className="p-4 bg-gray-50 rounded-md">
                <h3 className="font-medium text-gray-900">{editingUser.name}</h3>
                <p className="text-sm text-gray-600">{editingUser.email}</p>
                <div className="mt-2">
                  <UserRoleIndicator role={editingUser.role} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-role">Nova Função</Label>
                <Select onValueChange={handleRoleChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a nova função" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin_master">Super Admin</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="admin_editor">Admin Editor</SelectItem>
                    <SelectItem value="admin_viewer">Admin Viewer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancelar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <AlertDialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Alteração de Permissão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja alterar as permissões de{" "}
              <strong>{pendingRoleChange?.user.name}</strong> para{" "}
              <strong>{pendingRoleChange?.newRole}</strong>?
              <br /><br />
              Esta ação irá alterar imediatamente as permissões de acesso do usuário.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmRoleChange}
              className="bg-eregulariza-primary hover:bg-eregulariza-primary/90"
            >
              Confirmar Alteração
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
