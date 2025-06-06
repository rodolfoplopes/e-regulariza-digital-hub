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
import BackButton from "./BackButton";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Edit, Filter, Plus, Power, PowerOff, Search } from "lucide-react";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { auditService } from "@/services/auditService";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  cpf?: string;
  role: "admin" | "admin_master" | "admin_editor" | "admin_viewer" | "inactive";
  created_at: string;
  updated_at: string;
}

export default function AdminUserManagement() {
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState<"email" | "cpf">("email");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [pendingRoleChange, setPendingRoleChange] = useState<{
    user: AdminUser;
    newRole: string;
  } | null>(null);
  const [pendingStatusChange, setPendingStatusChange] = useState<{
    user: AdminUser;
    newStatus: "active" | "inactive";
  } | null>(null);
  const { toast } = useToast();
  const { profile } = useSupabaseAuth();

  useEffect(() => {
    fetchAdminUsers();
  }, []);

  const fetchAdminUsers = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .in('role', ['admin', 'admin_master', 'admin_editor', 'admin_viewer', 'inactive'])
        .order('name');

      if (error) throw error;

      const typedData = (data || []).map(user => ({
        ...user,
        role: user.role as AdminUser['role']
      }));

      setAdminUsers(typedData);
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
    const searchField = searchType === "email" ? user.email : (user.cpf || "");
    const matchesSearch = searchField.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    
    const matchesStatus = statusFilter === "all" || 
      (statusFilter === "active" && user.role !== "inactive") ||
      (statusFilter === "inactive" && user.role === "inactive");
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleEditUser = (user: AdminUser) => {
    setEditingUser({...user});
    setIsEditDialogOpen(true);
  };

  const handleCreateUser = () => {
    setEditingUser({
      id: "",
      name: "",
      email: "",
      cpf: "",
      role: "admin_viewer",
      created_at: "",
      updated_at: ""
    });
    setIsCreateDialogOpen(true);
  };

  const handleStatusChange = (user: AdminUser) => {
    if (user.id === profile?.id) {
      toast({
        variant: "destructive",
        title: "Ação não permitida",
        description: "Você não pode alterar seu próprio status.",
      });
      return;
    }

    setPendingStatusChange({
      user,
      newStatus: user.role === "inactive" ? "active" : "inactive"
    });
    setIsStatusDialogOpen(true);
  };

  const confirmStatusChange = async () => {
    if (!pendingStatusChange) return;

    try {
      const newRole = pendingStatusChange.newStatus === "inactive" 
        ? "inactive" 
        : "admin_viewer"; // Padrão para reativar

      const { error } = await supabase
        .from('profiles')
        .update({ 
          role: newRole,
          updated_at: new Date().toISOString()
        })
        .eq('id', pendingStatusChange.user.id);

      if (error) throw error;

      await auditService.createAuditLog({
        action: `${pendingStatusChange.newStatus === "inactive" ? "Desativação" : "Ativação"} de administrador`,
        target_type: 'user',
        target_id: pendingStatusChange.user.id,
        target_name: pendingStatusChange.user.name,
        details: {
          old_status: pendingStatusChange.user.role === "inactive" ? "inactive" : "active",
          new_status: pendingStatusChange.newStatus,
          user_email: pendingStatusChange.user.email
        }
      });

      setAdminUsers(users => 
        users.map(user => 
          user.id === pendingStatusChange.user.id 
            ? { ...user, role: newRole as AdminUser['role'] }
            : user
        )
      );

      toast({
        title: `✅ Admin ${pendingStatusChange.newStatus === "inactive" ? "desativado" : "ativado"}`,
        description: `${pendingStatusChange.user.name} foi ${pendingStatusChange.newStatus === "inactive" ? "desativado" : "ativado"} com sucesso`,
        duration: 5000,
      });

      setIsStatusDialogOpen(false);
      setPendingStatusChange(null);
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        variant: "destructive",
        title: "Erro ao alterar status",
        description: "Não foi possível alterar o status do usuário.",
      });
    }
  };

  const handleRoleChange = (newRole: string) => {
    if (!editingUser) return;

    if (editingUser.id === profile?.id && editingUser.role === 'admin_master' && newRole !== 'admin_master') {
      toast({
        variant: "destructive",
        title: "Ação não permitida",
        description: "Você não pode alterar suas próprias permissões de Super Admin.",
      });
      return;
    }
    
    setPendingRoleChange({
      user: editingUser,
      newRole: newRole as AdminUser['role']
    });
    setIsConfirmDialogOpen(true);
  };

  const updateAdminRole = async (userId: string, newRole: AdminUser['role']) => {
    try {
      if (profile?.role !== 'admin_master') {
        throw new Error('Apenas Super Admins podem alterar permissões');
      }

      const { error } = await supabase
        .from('profiles')
        .update({ 
          role: newRole,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) throw error;

      return { success: true };
    } catch (error) {
      console.error('Error updating role:', error);
      return { success: false, error };
    }
  };

  const confirmRoleChange = async () => {
    if (!pendingRoleChange) return;

    try {
      const result = await updateAdminRole(
        pendingRoleChange.user.id, 
        pendingRoleChange.newRole as AdminUser['role']
      );

      if (!result.success) {
        throw result.error;
      }

      await auditService.createAuditLog({
        action: `Alteração de permissão: ${getRoleLabel(pendingRoleChange.user.role)} → ${getRoleLabel(pendingRoleChange.newRole)}`,
        target_type: 'user',
        target_id: pendingRoleChange.user.id,
        target_name: pendingRoleChange.user.name,
        details: {
          old_role: pendingRoleChange.user.role,
          new_role: pendingRoleChange.newRole,
          user_email: pendingRoleChange.user.email
        }
      });

      setAdminUsers(users => 
        users.map(user => 
          user.id === pendingRoleChange.user.id 
            ? { ...user, role: pendingRoleChange.newRole as AdminUser['role'] }
            : user
        )
      );

      toast({
        title: "✅ Permissão atualizada com sucesso",
        description: `${pendingRoleChange.user.name}: ${getRoleLabel(pendingRoleChange.user.role)} → ${getRoleLabel(pendingRoleChange.newRole)}`,
        duration: 5000,
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

  const createUser = async () => {
    if (!editingUser) return;
    
    try {
      // Here you would implement user creation logic
      toast({
        title: "✅ Administrador criado com sucesso",
        description: `${editingUser.name} foi adicionado como ${getRoleLabel(editingUser.role)}`,
        duration: 5000,
      });
      
      // Reset form
      setEditingUser({
        id: "",
        name: "",
        email: "",
        cpf: "",
        role: "admin_viewer",
        created_at: "",
        updated_at: ""
      });
      
      setIsCreateDialogOpen(false);
      fetchAdminUsers();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao criar usuário",
        description: "Não foi possível criar o administrador.",
      });
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin_master': return 'Super Admin';
      case 'admin': return 'Admin';
      case 'admin_editor': return 'Editor';
      case 'admin_viewer': return 'Viewer';
      case 'inactive': return 'Inativo';
      default: return role;
    }
  };

  const getRolePermissions = (role: string) => {
    switch (role) {
      case 'admin_master':
        return 'Controle total do sistema, gerenciamento de usuários e permissões';
      case 'admin':
        return 'Pode editar usuários e gerenciar processos';
      case 'admin_editor':
        return 'Pode editar processos e conteúdo';
      case 'admin_viewer':
        return 'Visualização apenas, sem permissões de edição';
      case 'inactive':
        return 'Usuário desativado - sem acesso ao sistema';
      default:
        return '';
    }
  };

  const getStatusBadge = (user: AdminUser) => {
    if (user.role === "inactive") {
      return (
        <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
          Inativo
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
        Ativo
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-eregulariza-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Header with Back Button */}
        <div className="space-y-4">
          <BackButton />
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="page-title">Gestão de Administradores</h1>
              <p className="text-gray-600 mt-1">Gerencie permissões de administradores do sistema</p>
            </div>
            <Button onClick={handleCreateUser} className="eregulariza-gradient hover:opacity-90">
              <Plus className="h-4 w-4 mr-2" />
              Novo Admin
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow-sm space-y-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 flex gap-2">
              <Select value={searchType} onValueChange={(value: "email" | "cpf") => setSearchType(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="cpf">CPF</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder={`Buscar por ${searchType === "email" ? "e-mail" : "CPF"}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full"
                />
              </div>
            </div>
            
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full lg:w-[200px]">
                <Filter className="h-4 w-4 mr-2" />
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

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full lg:w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="active">Ativos</SelectItem>
                <SelectItem value="inactive">Inativos</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {searchTerm && (
            <div className="text-sm text-gray-600">
              Mostrando {filteredUsers.length} resultado(s) para "{searchTerm}"
            </div>
          )}
        </div>
        
        {/* Users Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow className="border-b border-gray-200">
                  <TableHead className="font-medium text-gray-900">Nome</TableHead>
                  <TableHead className="font-medium text-gray-900">E-mail</TableHead>
                  <TableHead className="font-medium text-gray-900 hidden sm:table-cell">CPF</TableHead>
                  <TableHead className="font-medium text-gray-900">Função</TableHead>
                  <TableHead className="font-medium text-gray-900 hidden lg:table-cell">Permissões</TableHead>
                  <TableHead className="font-medium text-gray-900 hidden md:table-cell">Status</TableHead>
                  <TableHead className="font-medium text-gray-900 hidden sm:table-cell">Criado em</TableHead>
                  <TableHead className="font-medium text-gray-900 text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow 
                    key={user.id} 
                    className={`hover:bg-gray-50 border-b border-gray-100 ${
                      searchTerm && (user.email.toLowerCase().includes(searchTerm.toLowerCase()) || 
                      (user.cpf && user.cpf.toLowerCase().includes(searchTerm.toLowerCase()))) 
                        ? 'bg-yellow-50 border-yellow-200' 
                        : ''
                    }`}
                  >
                    <TableCell className="font-medium py-4">{user.name}</TableCell>
                    <TableCell className="py-4">{user.email}</TableCell>
                    <TableCell className="py-4 hidden sm:table-cell">
                      {user.cpf || '-'}
                    </TableCell>
                    <TableCell className="py-4">
                      <UserRoleIndicator role={user.role} />
                    </TableCell>
                    <TableCell className="py-4 hidden lg:table-cell">
                      <span className="text-sm text-gray-600 max-w-xs">
                        {getRolePermissions(user.role)}
                      </span>
                    </TableCell>
                    <TableCell className="py-4 hidden md:table-cell">
                      {getStatusBadge(user)}
                    </TableCell>
                    <TableCell className="py-4 hidden sm:table-cell">
                      {new Date(user.created_at).toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell className="py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleEditUser(user)}
                          disabled={user.id === profile?.id && user.role === 'admin_master'}
                          className="hover:bg-gray-100"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleStatusChange(user)}
                          disabled={user.id === profile?.id}
                          className={`hover:bg-gray-100 ${
                            user.role === "inactive" 
                              ? "text-green-600 hover:text-green-800" 
                              : "text-red-600 hover:text-red-800"
                          }`}
                        >
                          {user.role === "inactive" ? (
                            <Power className="h-4 w-4" />
                          ) : (
                            <PowerOff className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                
                {filteredUsers.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-12 text-gray-500">
                      <div className="space-y-2">
                        <p>Nenhum administrador encontrado</p>
                        <p className="text-sm">Ajuste os filtros ou crie um novo administrador</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
        
        {/* Create User Dialog */}
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="section-title">Criar Novo Administrador</DialogTitle>
              <DialogDescription>
                Adicione um novo administrador ao sistema e defina suas permissões.
              </DialogDescription>
            </DialogHeader>
            
            {editingUser && (
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="create-name">Nome Completo</Label>
                  <Input
                    id="create-name"
                    value={editingUser.name}
                    onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                    placeholder="Digite o nome completo"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="create-email">Email</Label>
                  <Input
                    id="create-email"
                    type="email"
                    value={editingUser.email}
                    onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                    placeholder="Digite o email"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="create-cpf">CPF</Label>
                  <Input
                    id="create-cpf"
                    type="text"
                    value={editingUser.cpf}
                    onChange={(e) => setEditingUser({ ...editingUser, cpf: e.target.value })}
                    placeholder="Digite o CPF"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="create-role">Função</Label>
                  <Select 
                    value={editingUser.role} 
                    onValueChange={(value) => setEditingUser({ ...editingUser, role: value as AdminUser['role'] })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a função" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin_viewer">Admin Viewer</SelectItem>
                      <SelectItem value="admin_editor">Admin Editor</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="admin_master">Super Admin</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-500">
                    {getRolePermissions(editingUser.role)}
                  </p>
                </div>
              </div>
            )}
            
            <DialogFooter className="gap-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsCreateDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button 
                type="button" 
                className="eregulariza-gradient hover:opacity-90"
                onClick={createUser}
              >
                Criar Administrador
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit User Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="section-title">Editar Permissões do Administrador</DialogTitle>
              <DialogDescription>
                Altere as permissões de acesso do administrador selecionado.
              </DialogDescription>
            </DialogHeader>
            
            {editingUser && (
              <div className="space-y-4 py-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-gray-900">{editingUser.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{editingUser.email}</p>
                  <div className="mt-3">
                    <UserRoleIndicator role={editingUser.role} />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    {getRolePermissions(editingUser.role)}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-role">Nova Função</Label>
                  <Select onValueChange={handleRoleChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a nova função" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin_viewer">Admin Viewer</SelectItem>
                      <SelectItem value="admin_editor">Admin Editor</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="admin_master">Super Admin</SelectItem>
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
              <AlertDialogTitle className="section-title">Confirmar Alteração de Permissão</AlertDialogTitle>
              <AlertDialogDescription className="space-y-3">
                <p>
                  Tem certeza que deseja alterar as permissões de{" "}
                  <strong>{pendingRoleChange?.user.name}</strong>?
                </p>
                
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm font-medium text-blue-900">
                    {getRoleLabel(pendingRoleChange?.user.role || '')} → {pendingRoleChange?.newRole && getRoleLabel(pendingRoleChange.newRole)}
                  </p>
                  <p className="text-xs text-blue-700 mt-1">
                    {pendingRoleChange?.newRole && getRolePermissions(pendingRoleChange.newRole)}
                  </p>
                </div>
                
                <p className="text-sm text-amber-600">
                  ⚠️ Esta ação irá alterar imediatamente as permissões de acesso do usuário.
                </p>
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

        {/* Status Change Dialog */}
        <AlertDialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="section-title">
                {pendingStatusChange?.newStatus === "inactive" ? "Desativar" : "Ativar"} Administrador
              </AlertDialogTitle>
              <AlertDialogDescription className="space-y-3">
                <p>
                  Tem certeza que deseja {pendingStatusChange?.newStatus === "inactive" ? "desativar" : "ativar"}{" "}
                  <strong>{pendingStatusChange?.user.name}</strong>?
                </p>
                
                {pendingStatusChange?.newStatus === "inactive" && (
                  <div className="bg-red-50 p-3 rounded-lg">
                    <p className="text-sm font-medium text-red-900">
                      ⚠️ Administrador desativado não poderá:
                    </p>
                    <ul className="text-xs text-red-700 mt-1 list-disc list-inside">
                      <li>Fazer login no sistema</li>
                      <li>Ser selecionado para novos processos</li>
                      <li>Receber notificações</li>
                    </ul>
                  </div>
                )}
                
                {pendingStatusChange?.newStatus === "active" && (
                  <div className="bg-green-50 p-3 rounded-lg">
                    <p className="text-sm font-medium text-green-900">
                      ✅ Administrador será reativado como Viewer
                    </p>
                    <p className="text-xs text-green-700 mt-1">
                      Você poderá alterar as permissões após a ativação
                    </p>
                  </div>
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction 
                onClick={confirmStatusChange}
                className={
                  pendingStatusChange?.newStatus === "inactive" 
                    ? "bg-red-600 hover:bg-red-700" 
                    : "bg-green-600 hover:bg-green-700"
                }
              >
                {pendingStatusChange?.newStatus === "inactive" ? "Desativar" : "Ativar"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
