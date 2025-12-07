
import { useState } from "react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { usePermissions } from "@/hooks/usePermissions";
import UserRoleIndicator from "./UserRoleIndicator";
import UserPermissionsGuard from "./UserPermissionsGuard";
import { User, Key, Mail, Plus, Filter } from "lucide-react";

type UserData = {
  id: string;
  name: string;
  email: string;
  phone: string;
  cpf: string;
  createdAt: string;
  role: "cliente" | "admin" | "admin_master" | "admin_editor" | "admin_viewer";
};

export default function UserManagement() {
  const permissions = usePermissions();
  
  const [users, setUsers] = useState<UserData[]>([
    {
      id: "user-001",
      name: "João Silva",
      email: "joao@example.com",
      phone: "(11) 98765-4321",
      cpf: "123.456.789-00",
      createdAt: "15/04/2023",
      role: "cliente"
    },
    {
      id: "user-002",
      name: "Maria Souza",
      email: "maria@example.com",
      phone: "(21) 98765-4321",
      cpf: "987.654.321-00",
      createdAt: "05/05/2023",
      role: "cliente"
    },
    {
      id: "user-003",
      name: "Pedro Editor",
      email: "pedro@eregulariza.com",
      phone: "(31) 98765-4321",
      cpf: "456.789.123-00",
      createdAt: "20/02/2023",
      role: "admin_editor"
    },
    {
      id: "user-004",
      name: "Ana Viewer",
      email: "ana@eregulariza.com",
      phone: "(41) 98765-4321",
      cpf: "789.123.456-00",
      createdAt: "12/03/2023",
      role: "admin_viewer"
    },
    {
      id: "admin-001",
      name: "Super Admin",
      email: "lopes.rod@gmail.com",
      phone: "(11) 99999-9999",
      cpf: "111.111.111-11",
      createdAt: "01/01/2023",
      role: "admin_master"
    }
  ]);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [editingUser, setEditingUser] = useState<UserData | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isResetPasswordDialogOpen, setIsResetPasswordDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.cpf.includes(searchTerm);
    
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    
    // Super admins can see all users, others see based on their permissions
    if (permissions.isSuperAdmin) {
      return matchesSearch && matchesRole;
    } else if (permissions.isAdmin) {
      // Admins can see clients and lower-level admins, but not super admins
      const canSeeUser = user.role === "cliente" || 
                        user.role === "admin_editor" || 
                        user.role === "admin_viewer";
      return matchesSearch && matchesRole && canSeeUser;
    } else {
      // Non-admins can only see clients
      return matchesSearch && matchesRole && user.role === "cliente";
    }
  });
  
  const handleEditUser = (user: UserData) => {
    // Check if user can edit this specific user
    if (!permissions.canEditAllUsers) {
      toast({
        variant: "destructive",
        title: "Acesso negado",
        description: "Você não tem permissão para editar usuários."
      });
      return;
    }

    // Super admins cannot be edited by non-super admins
    if (user.role === "admin_master" && !permissions.isSuperAdmin) {
      toast({
        variant: "destructive",
        title: "Acesso negado",
        description: "Apenas Super Admins podem editar outros Super Admins."
      });
      return;
    }
    
    setEditingUser({...user});
    setIsEditDialogOpen(true);
  };
  
  const handleCreateUser = () => {
    setEditingUser({
      id: "",
      name: "",
      email: "",
      phone: "",
      cpf: "",
      createdAt: "",
      role: "cliente"
    });
    setIsCreateDialogOpen(true);
  };
  
  const handleResetPassword = (user: UserData) => {
    setEditingUser(user);
    setIsResetPasswordDialogOpen(true);
  };
  
  const saveUserChanges = async () => {
    if (!editingUser) return;
    
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setUsers(users.map(user => 
        user.id === editingUser.id ? editingUser : user
      ));
      
      toast({
        title: "Usuário atualizado",
        description: `As informações de ${editingUser.name} foram atualizadas com sucesso.`,
      });
      
      setIsEditDialogOpen(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao atualizar usuário",
        description: "Ocorreu um erro ao tentar salvar as alterações.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createUser = async () => {
    if (!editingUser) return;
    
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newUser = {
        ...editingUser,
        id: `user-${Date.now()}`,
        createdAt: new Date().toLocaleDateString('pt-BR')
      };
      
      setUsers([...users, newUser]);
      
      toast({
        title: "Usuário criado",
        description: `O usuário ${editingUser.name} foi criado com sucesso.`,
      });
      
      setIsCreateDialogOpen(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao criar usuário",
        description: "Ocorreu um erro ao tentar criar o usuário.",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const resetUserPassword = async () => {
    if (!editingUser) return;
    
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Senha redefinida",
        description: `Uma nova senha foi enviada para o e-mail ${editingUser.email}.`,
      });
      
      setIsResetPasswordDialogOpen(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao redefinir senha",
        description: "Ocorreu um erro ao tentar redefinir a senha.",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editingUser) return;
    
    const { name, value } = e.target;
    setEditingUser({ ...editingUser, [name]: value });
  };

  const handleRoleChange = (value: string) => {
    if (!editingUser) return;
    
    setEditingUser({ 
      ...editingUser, 
      role: value as UserData['role']
    });
  };

  const getAvailableRoles = () => {
    if (permissions.isSuperAdmin) {
      return [
        { value: "cliente", label: "Cliente" },
        { value: "admin_viewer", label: "Admin Viewer" },
        { value: "admin_editor", label: "Admin Editor" },
        { value: "admin", label: "Admin" },
        { value: "admin_master", label: "Super Admin" }
      ];
    } else if (permissions.isAdmin) {
      return [
        { value: "cliente", label: "Cliente" },
        { value: "admin_viewer", label: "Admin Viewer" },
        { value: "admin_editor", label: "Admin Editor" }
      ];
    } else {
      return [
        { value: "cliente", label: "Cliente" }
      ];
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold">Gerenciar Usuários</h2>
          <UserRoleIndicator role={permissions.role || 'cliente'} />
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <UserPermissionsGuard requiredPermission="canCreateUsers">
            <Button onClick={handleCreateUser} className="eregulariza-gradient hover:opacity-90">
              <Plus className="h-4 w-4 mr-2" />
              Novo Usuário
            </Button>
          </UserPermissionsGuard>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Input
            placeholder="Buscar por nome, e-mail ou CPF..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filtrar por perfil" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os perfis</SelectItem>
            <SelectItem value="cliente">Clientes</SelectItem>
            <SelectItem value="admin_viewer">Admin Viewer</SelectItem>
            <SelectItem value="admin_editor">Admin Editor</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            {permissions.isSuperAdmin && (
              <SelectItem value="admin_master">Super Admin</SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>E-mail</TableHead>
              <TableHead>CPF</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead>Perfil</TableHead>
              <TableHead>Cadastrado em</TableHead>
              {permissions.canManageUsers && <TableHead className="text-right">Ações</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.cpf}</TableCell>
                <TableCell>{user.phone}</TableCell>
                <TableCell>
                  <UserRoleIndicator role={user.role} />
                </TableCell>
                <TableCell>{user.createdAt}</TableCell>
                {permissions.canManageUsers && (
                  <TableCell className="text-right space-x-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleEditUser(user)}
                    >
                      <User className="h-4 w-4 mr-1" />
                      Editar
                    </Button>
                    {user.role !== "admin_master" && (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleResetPassword(user)}
                      >
                        <Key className="h-4 w-4 mr-1" />
                        Redefinir Senha
                      </Button>
                    )}
                  </TableCell>
                )}
              </TableRow>
            ))}
            
            {filteredUsers.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                  Nenhum usuário encontrado com os filtros selecionados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Create User Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Criar Novo Usuário</DialogTitle>
            <DialogDescription>
              Preencha as informações do novo usuário.
            </DialogDescription>
          </DialogHeader>
          
          {editingUser && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="create-name">Nome Completo</Label>
                <Input
                  id="create-name"
                  name="name"
                  value={editingUser.name}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="create-email">Email</Label>
                <Input
                  id="create-email"
                  name="email"
                  type="email"
                  value={editingUser.email}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="create-phone">Telefone</Label>
                <Input
                  id="create-phone"
                  name="phone"
                  value={editingUser.phone}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="create-cpf">CPF</Label>
                <Input
                  id="create-cpf"
                  name="cpf"
                  value={editingUser.cpf}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="create-role">Perfil</Label>
                <Select value={editingUser.role} onValueChange={handleRoleChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o perfil" />
                  </SelectTrigger>
                  <SelectContent>
                    {getAvailableRoles().map((role) => (
                      <SelectItem key={role.value} value={role.value}>
                        {role.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsCreateDialogOpen(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button 
              type="button" 
              className="eregulariza-gradient hover:opacity-90"
              onClick={createUser}
              disabled={isLoading}
            >
              {isLoading ? "Criando..." : "Criar usuário"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Editar Usuário</DialogTitle>
            <DialogDescription>
              Atualize as informações do usuário.
            </DialogDescription>
          </DialogHeader>
          
          {editingUser && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Nome Completo</Label>
                <Input
                  id="edit-name"
                  name="name"
                  value={editingUser.name}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  name="email"
                  type="email"
                  value={editingUser.email}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-phone">Telefone</Label>
                <Input
                  id="edit-phone"
                  name="phone"
                  value={editingUser.phone}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-cpf">CPF</Label>
                <Input
                  id="edit-cpf"
                  name="cpf"
                  value={editingUser.cpf}
                  disabled
                  className="bg-gray-100"
                />
                <p className="text-xs text-muted-foreground">
                  O CPF não pode ser alterado.
                </p>
              </div>

              {permissions.canManagePermissions && (
                <div className="space-y-2">
                  <Label htmlFor="edit-role">Perfil</Label>
                  <Select value={editingUser.role} onValueChange={handleRoleChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o perfil" />
                    </SelectTrigger>
                    <SelectContent>
                      {getAvailableRoles().map((role) => (
                        <SelectItem key={role.value} value={role.value}>
                          {role.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          )}
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsEditDialogOpen(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button 
              type="button" 
              className="eregulariza-gradient hover:opacity-90"
              onClick={saveUserChanges}
              disabled={isLoading}
            >
              {isLoading ? "Salvando..." : "Salvar alterações"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Reset Password Dialog */}
      <Dialog open={isResetPasswordDialogOpen} onOpenChange={setIsResetPasswordDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Redefinir Senha</DialogTitle>
            <DialogDescription>
              Uma nova senha será gerada e enviada por email para o usuário.
            </DialogDescription>
          </DialogHeader>
          
          {editingUser && (
            <div className="py-4">
              <div className="flex items-center justify-center text-center p-4 bg-gray-50 rounded-md">
                <div className="space-y-2">
                  <div className="flex justify-center">
                    <Mail className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <h3 className="font-medium">{editingUser.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {editingUser.email}
                  </p>
                  <UserRoleIndicator role={editingUser.role} />
                </div>
              </div>
              <p className="mt-4 text-sm">
                Uma nova senha segura será gerada e enviada para o email acima.
                O usuário deverá alterá-la após o primeiro acesso.
              </p>
            </div>
          )}
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsResetPasswordDialogOpen(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button 
              type="button" 
              className="eregulariza-gradient hover:opacity-90"
              onClick={resetUserPassword}
              disabled={isLoading}
            >
              {isLoading ? "Enviando..." : "Enviar nova senha"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
