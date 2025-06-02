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
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { usePermissions } from "@/hooks/usePermissions";
import { User, Key, Mail } from "lucide-react";

type UserData = {
  id: string;
  name: string;
  email: string;
  phone: string;
  cpf: string;
  createdAt: string;
  role: "cliente" | "admin";
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
      name: "Pedro Santos",
      email: "pedro@example.com",
      phone: "(31) 98765-4321",
      cpf: "456.789.123-00",
      createdAt: "20/02/2023",
      role: "cliente"
    },
    {
      id: "user-004",
      name: "Ana Oliveira",
      email: "ana@example.com",
      phone: "(41) 98765-4321",
      cpf: "789.123.456-00",
      createdAt: "12/03/2023",
      role: "cliente"
    },
    {
      id: "admin-001",
      name: "Administrador",
      email: "admin@eregulariza.com",
      phone: "(11) 99999-9999",
      cpf: "111.111.111-11",
      createdAt: "01/01/2023",
      role: "admin"
    }
  ]);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [editingUser, setEditingUser] = useState<UserData | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isResetPasswordDialogOpen, setIsResetPasswordDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.cpf.includes(searchTerm)
  );
  
  const handleEditUser = (user: UserData) => {
    // Only allow editing if user has permission or it's their own profile
    if (!permissions.canEditAllUsers && user.id !== "current-user-id") {
      toast({
        variant: "destructive",
        title: "Acesso negado",
        description: "Você não tem permissão para editar outros usuários."
      });
      return;
    }
    
    setEditingUser({...user});
    setIsEditDialogOpen(true);
  };
  
  const handleResetPassword = (user: UserData) => {
    setEditingUser(user);
    setIsResetPasswordDialogOpen(true);
  };
  
  const saveUserChanges = async () => {
    if (!editingUser) return;
    
    setIsLoading(true);
    
    try {
      // Mock API call to update user
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update local state
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
  
  const resetUserPassword = async () => {
    if (!editingUser) return;
    
    setIsLoading(true);
    
    try {
      // Mock API call to reset password
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

  // Show only clients if not admin
  const displayUsers = permissions.canEditAllUsers ? filteredUsers : filteredUsers.filter(u => u.role === "cliente");

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-xl font-semibold">
          {permissions.canEditAllUsers ? "Gerenciar Usuários" : "Usuários do Sistema"}
        </h2>
        <div className="relative w-full sm:w-[300px]">
          <Input
            placeholder="Buscar por nome, e-mail ou CPF..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>E-mail</TableHead>
              <TableHead>CPF</TableHead>
              <TableHead>Telefone</TableHead>
              {permissions.canEditAllUsers && <TableHead>Tipo</TableHead>}
              <TableHead>Cadastrado em</TableHead>
              {permissions.canEditAllUsers && <TableHead className="text-right">Ações</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.cpf}</TableCell>
                <TableCell>{user.phone}</TableCell>
                {permissions.canEditAllUsers && (
                  <TableCell>
                    <span className={`text-xs font-medium py-1 px-2 rounded-full ${
                      user.role === "admin" 
                        ? "bg-purple-100 text-purple-700" 
                        : "bg-blue-100 text-blue-700"
                    }`}>
                      {user.role === "admin" ? "Administrador" : "Cliente"}
                    </span>
                  </TableCell>
                )}
                <TableCell>{user.createdAt}</TableCell>
                {permissions.canEditAllUsers && (
                  <TableCell className="text-right space-x-2">
                    {user.role !== "admin" && (
                      <>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleEditUser(user)}
                        >
                          <User className="h-4 w-4 mr-1" />
                          Editar
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleResetPassword(user)}
                        >
                          <Key className="h-4 w-4 mr-1" />
                          Redefinir Senha
                        </Button>
                      </>
                    )}
                  </TableCell>
                )}
              </TableRow>
            ))}
            
            {displayUsers.length === 0 && (
              <TableRow>
                <TableCell colSpan={permissions.canEditAllUsers ? 7 : 6} className="text-center py-8 text-gray-500">
                  Nenhum usuário encontrado com os filtros selecionados.
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
            <DialogTitle>Editar Usuário</DialogTitle>
            <DialogDescription>
              Atualize as informações do usuário. O CPF não pode ser alterado.
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
