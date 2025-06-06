
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { 
  Shield, 
  ShieldCheck, 
  Eye, 
  Edit, 
  Users, 
  FileText, 
  Settings,
  Crown,
  CheckCircle,
  XCircle
} from "lucide-react";

interface Permission {
  name: string;
  description: string;
  icon: React.ReactNode;
}

interface Role {
  name: string;
  label: string;
  color: string;
  icon: React.ReactNode;
  permissions: boolean[];
}

export default function PermissionMatrixCard() {
  const permissions: Permission[] = [
    {
      name: "Visualizar Sistema",
      description: "Acesso básico ao painel administrativo",
      icon: <Eye className="h-4 w-4" />
    },
    {
      name: "Editar Conteúdo",
      description: "Criar e editar processos, clientes e conteúdo",
      icon: <Edit className="h-4 w-4" />
    },
    {
      name: "Gerenciar Processos",
      description: "Controle total sobre processos e documentos",
      icon: <FileText className="h-4 w-4" />
    },
    {
      name: "Gerenciar Usuários",
      description: "Criar, editar e remover usuários do sistema",
      icon: <Users className="h-4 w-4" />
    },
    {
      name: "Configurações do Sistema",
      description: "Alterar configurações gerais e integrações",
      icon: <Settings className="h-4 w-4" />
    },
    {
      name: "Gerenciar Permissões",
      description: "Alterar funções e permissões de outros admins",
      icon: <Crown className="h-4 w-4" />
    }
  ];

  const roles: Role[] = [
    {
      name: "admin_viewer",
      label: "Admin Viewer",
      color: "bg-admin-viewer text-white",
      icon: <Eye className="h-4 w-4" />,
      permissions: [true, false, false, false, false, false] // Apenas visualização
    },
    {
      name: "admin_editor",
      label: "Admin Editor",
      color: "bg-admin-editor text-white",
      icon: <Edit className="h-4 w-4" />,
      permissions: [true, true, true, false, false, false] // Visualizar + Editar + Processos
    },
    {
      name: "admin",
      label: "Admin",
      color: "bg-purple-600 text-white",
      icon: <ShieldCheck className="h-4 w-4" />,
      permissions: [true, true, true, true, true, false] // Tudo exceto gerenciar permissões
    },
    {
      name: "admin_master",
      label: "Super Admin",
      color: "bg-admin-master text-white",
      icon: <Crown className="h-4 w-4" />,
      permissions: [true, true, true, true, true, true] // Controle total
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Matriz de Permissões
        </CardTitle>
        <CardDescription>
          Visão geral das permissões por função administrativa
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3 font-medium text-gray-900">Permissão</th>
                {roles.map((role) => (
                  <th key={role.name} className="text-center p-3">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Badge className={`${role.color} flex items-center gap-1 px-3 py-1`}>
                            {role.icon}
                            {role.label}
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Função: {role.label}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {permissions.map((permission, permIndex) => (
                <tr key={permIndex} className="border-b hover:bg-gray-50">
                  <td className="p-3">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger className="flex items-center gap-2 text-left">
                          {permission.icon}
                          <span className="font-medium">{permission.name}</span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{permission.description}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </td>
                  {roles.map((role, roleIndex) => (
                    <td key={roleIndex} className="p-3 text-center">
                      {role.permissions[permIndex] ? (
                        <CheckCircle className="h-5 w-5 text-green-600 mx-auto" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-400 mx-auto" />
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Legenda:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-blue-800">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>Permissão concedida</span>
            </div>
            <div className="flex items-center gap-2">
              <XCircle className="h-4 w-4 text-red-400" />
              <span>Permissão negada</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
